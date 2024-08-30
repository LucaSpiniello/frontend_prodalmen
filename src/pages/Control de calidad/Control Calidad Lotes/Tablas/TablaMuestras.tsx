import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { TControlCalidad, TRendimientoMuestra } from '../../../../types/TypesControlCalidad.type';
import useDarkMode from '../../../../hooks/useDarkMode';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import TableTemplate, { TableColumn } from '../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import Tooltip from '../../../../components/ui/Tooltip';
import { MdOutlineCommentsDisabled } from 'react-icons/md';
import { BiCheckDouble } from 'react-icons/bi';
import ModalForm from '../../../../components/ModalForm.modal';
import ModalConfirmacion from '../../../../components/ModalConfirmacion';
import FormularioPepaMuestra from '../Formularios/RegistroControlCalidadMuestras';
import { Link, useLocation, useParams } from 'react-router-dom';
import { HeroEye, HeroXMark } from '../../../../components/icon/heroicons';
import { format } from '@formkit/tempo';
import { GiTestTubes } from 'react-icons/gi';
import { useAuth } from '../../../../context/authContext';
import { fetchWithTokenDelete } from '../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';
import { fetchMuestrasControlCalidad } from '../../../../redux/slices/controlcalidadSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IRendimientoMuestra {
  id_lote: number
  ccLote?: TControlCalidad | null,
  setOpen?: Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<TRendimientoMuestra>();



const TablaMuestras: FC<IRendimientoMuestra> = ({ id_lote, setOpen }) => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)
  const rendimiento_muestra = useAppSelector((state: RootState) => state.control_calidad.cc_muestras)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()


  const deleteMuestra = async (id_muestra: number | null) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenDelete(`api/control-calidad/recepcionmp/${id}/muestras/${id_muestra}/`, token_verificado)
    if (res.ok){
      toast.success("Eliminado correctamente!")
      //@ts-ignore
      dispatch(fetchMuestrasControlCalidad({ id: id_lote, token, verificar_token: verificarToken }))
      setOpen!(false)
    } else {
      toast.error("No se ha podido eliminar")
    }
  }



  const columns = [
		columnHelper.accessor('id', {
			cell: (info) => {
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'
        return (
          <div className={`font-bold text-center  
            ${comprobacion && !info.row.original.es_contramuestra ? 'line-through text-orange-700': ''}
            `}>
            {`${info.row.index + 1}`}
          </div>
        )
      },
			header: 'N° Muestra',
		}),
		columnHelper.display({
      id: 'fecha_registro',
			cell: (info) => {
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'
        return (
          <div className={`font-bold text-center  ${comprobacion && !info.row.original.es_contramuestra ? 'line-through text-orange-700': ''}`}>
            {`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short'}, 'es' )}`}
          </div>
        )
      },
			header: 'Fecha Registro',
		}),
		columnHelper.display({
      id: 'registrado_por',
      cell: (info) => {
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'

				return (
					<div className={`font-bold text-center  ${comprobacion && !info.row.original.es_contramuestra ? 'line-through text-orange-700': ''}`}>
						{`${info.row.original.registrado_por_label} | ${info.row.original.email_registrador}`}  
					</div>
				)
			},
			header: 'Registrado Por',
		}),
    columnHelper.display({
      id: 'pepa',
			cell: (info) => {
        const row = info.row.original
        const index = info.row.index + 1
        const [confirmacion, setConfirmacion] = useState<boolean>(false)      
        const [ccPepaConfirmacion, setccPepaConfirmacion] = useState<boolean>(false)
        const [isCalibrable, setIsCalibrable] = useState<boolean>(false)
        const [openModalCCPepa, setOpenModalCCPepa] = useState(false)
        const [openConfirmacion, setOpenConfirmacion] = useState(false)
        const esta_calibrada = info.row.original.cc_calibrespepaok



        useEffect(() => {
          if (confirmacion){
            deleteMuestra(row.id)
          }
        }, [confirmacion])


				return (
					<div className='h-full w-full flex flex-wrap gap-2 justify-center'>
            {
              row?.cc_ok === true
                ? (
                  <Tooltip text={control_calidad?.esta_contramuestra === '1'  && !row?.es_contramuestra ? 'Muestra invalidad por Contra Muestra': esta_calibrada ? 'Muestra Calibrada' : 'Muestra Valida'}>
                    <div 
                      className={`w-24 flex items-center justify-center rounded-md px-1 h-[40px] text-white
                      ${control_calidad?.esta_contramuestra === '1'  && !row.es_contramuestra ? 'bg-orange-600 hover:bg-orange-400' : esta_calibrada ? 'bg-purple-600 hover:bg-purple-500' : 'bg-green-600 hover:bg-green-500'}
                      hover:scale-105`}>
                      
                      {
                        control_calidad?.esta_contramuestra === '1'  && !row.es_contramuestra
                          ? <MdOutlineCommentsDisabled className='text-4xl'/>
                          : <BiCheckDouble className='text-4xl'/>
                      }
                    </div>
                  </Tooltip>
                )
                : (
                  <ModalForm
                    open={openModalCCPepa}
                    setOpen={setOpenModalCCPepa}
                    title={`Muestra N° ${index}  Control de Rendimiento `}
                    textTool='CC Pepas Muestras'
                    variant="solid"
                    color='violet'
                    size={ccPepaConfirmacion ? 900 : 500}
                    width={`w-24 px-1 h-[40px] border border-purple-700 hover:border-purple-600 hover:scale-105`}
                    icon={<GiTestTubes className='text-4xl'/>}
                  >
                    <ModalConfirmacion
                      mensaje='¿Quieres registrar CC Pepa?'
                      formulario={<FormularioPepaMuestra isCalibrable={setIsCalibrable} id_lote={id_lote!} id_muestra={row?.id!} isOpen={setOpenModalCCPepa} />}
                      confirmacion={ccPepaConfirmacion}
                      setConfirmacion={setccPepaConfirmacion}
                      setOpen={setOpenModalCCPepa}
                      comprobar={false}
                      />
                  </ModalForm>
                )
              }

              <Tooltip text='Detalle Control Calidad Pepa '>
                <Link to={`/cdc/crmp/control-calidad/${id_lote}/muestra/${row?.id}`} state={{ pathname: pathname }}>
                  <Button
                    variant='solid'
                    className='w-24 h-[40px] flex items-center  bg-blue-700 hover:bg-blue-600 border border-blue-700 hover:border-blue-600 rounded-md hover:scale-105'>
                    <HeroEye style={{ fontSize: 35, fontWeight: 'semibold', color: 'white' }} />
                  </Button>
                </Link>
              </Tooltip>

              {
                userGroup?.groups && ('controlcalidad' in userGroup?.groups!)   
                  ? (
                    <ModalForm
                      open={openConfirmacion}
                      setOpen={setOpenConfirmacion}
                      title={`Muestra Control de Rendimiento del Lote N° ${row?.cc_recepcionmp}`}
                      textTool='Eliminar Muestra'
                      size={500}
                      variant="solid"
                      width={`w-24 h-[40px] px-1 bg-red-700 hover:bg-red-600 text-white hover:scale-105 border-none`}
                      icon={<HeroXMark style={{ fontSize: 25 }} />}
                    >
                      <ModalConfirmacion 
                        id={row?.id!}
                        mensaje='¿Estas seguro de eliminar esta muestra?'
                        confirmacion={confirmacion}
                        setConfirmacion={setConfirmacion}
                        setOpen={setOpenConfirmacion}
                        />
                    </ModalForm>
                    )
                  : null
                
            }
          </div>
				)
			},
			header: 'Acciones',
		}),
  ]


  const table = useReactTable({
		data: rendimiento_muestra,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
	});

  const columnas: TableColumn[] = [
    { id: 'id', header: '', className: 'w-24 lg:w-32 text-center ' },
    { id: 'fecha_registro', header: '', className: 'lg:w-72 ' },
    { id: 'fecha_registro', header: '', className: 'lg:w-72 ' },

  ]


  return (
    <PageWrapper name='Lista Programas Selección'>
      <Container breakpoint={null} className='w-full overflow-auto'>
        <Card className='h-full w-full'>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaMuestras;
