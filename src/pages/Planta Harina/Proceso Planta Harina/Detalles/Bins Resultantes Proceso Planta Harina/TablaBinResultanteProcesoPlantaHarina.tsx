import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { useAuth } from '../../../../../context/authContext';
import { Link, useLocation, useParams } from 'react-router-dom';
import { format } from '@formkit/tempo';
import Tooltip from '../../../../../components/ui/Tooltip';
import { HeroEye, HeroXMark } from '../../../../../components/icon/heroicons';
import ModalForm from '../../../../../components/ModalForm.modal';
import { BiCheckDouble } from 'react-icons/bi';
import { fetchWithTokenPatch, fetchWithTokenPut } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { RiErrorWarningFill } from 'react-icons/ri';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import Button from '../../../../../components/ui/Button';
import { IoIosBarcode } from 'react-icons/io';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { TBinResultantePlantaHarina } from '../../../../../types/typesPlantaHarina';
import { eliminar_bin_resultante_planta_harina } from '../../../../../redux/slices/plantaHarinaSlice';
import { eliminar_bin_resultante_proceso_planta_harina } from '../../../../../redux/slices/procesoPlantaHarina';
import FormularioCCBinResultanteProcesoPlantaHarina from '../../Formularios/FormularioCCBinResultanteProcesoPlantaHarina';
import DetalleControlCalidadBinResultanteProcesoPlantaHarina from '../../../../Control de calidad/Control Calidad Bin Resultante Proceso Planta Harina/DetalleControlCalidadBinResultanteProcesoPlantaHarina';



const TablaBinResultanteProcesoPlantaHarina = () => {
  const { id } = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const bins_resultantes = useAppSelector((state: RootState) => state.proceso_planta_harina.bins_resultantes_proceso_planta_harina)
  const proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)
  const { pathname } = useLocation()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  // useEffect(() => {
  //     //@ts-ignore
  //     dispatch(fetchTarjasResultantes({ id, token, verificar_token: verificarToken }))
  // }, [])

  // const eliminarTarja = async (id_lote: number) => {
  //   const token_verificado = await verificarToken(token!)
  
  //   if (!token_verificado) throw new Error('Token no verificado')
  //   const res = await fetchWithTokenPatch(`api/proceso_planta_harina/${id}/tarjas_resultantes/eliminar_tarja/`, 
  //     {
  //       id: id_lote,
  //       proceso_planta_harina: id,
  //       esta_eliminado: true
  //     },
  //     token_verificado
  //   )

  //   if (res.ok){
  //     toast.success("Tarja Eliminada Correctamente")
  //     dispatch(fetchTarjasResultantes({ id:  parseInt(id!), token, verificar_token: verificarToken }))
  //     dispatch(fetchProgramaproceso_planta_harina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      
  //     setOpen(false)
  //   } else {
  //     toast.error("No se pudo eliminar la tarja, vuelve a intentarlo")
  //   }
  // }

  const columnHelper = createColumnHelper<TBinResultantePlantaHarina>();
  const columns = [

		columnHelper.accessor('codigo_tarja',{
      id: 'codigo_tarja',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.codigo_tarja}`}
				</div>
			),
			header: 'Código Tarja',
		}),
    columnHelper.accessor('peso',{
      id: 'peso_neto',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${(row?.peso! - parseInt(row?.tipo_patineta)!)?.toLocaleString()}`}
          </div>
        )
      },
			header: 'Peso Neto',
		}),
    columnHelper.accessor('tipo_patineta_label',{
      id: 'tipo_patineta',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${row.tipo_patineta_label}`}
          </div>
        )
      },
			header: 'Tipo Patineta',
		}),
    columnHelper.accessor('calidad',{
      id: 'calidad',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${row.calidad}`}
          </div>
        )
      },
			header: 'Calidad',
		}),
    columnHelper.accessor('fecha_creacion',{
      id: 'fecha_creacion',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${format(row?.fecha_creacion!, { date: 'short', time: 'short' }, 'es')}`}
          </div>
        )
      },
			header: 'Fecha Creción',
		}),
    columnHelper.display({
      id: 'actions',
			cell: (info) => {
        const row = info.row.original
        const [openModalCCTarja, setOpenModalCCTarja] = useState(false)
        const [detalleTarja, setDetalleTarja] = useState(false)

        return (
          <div className='w-full h-full flex justify-center flex-wrap gap-2'>
            {
            row?.cc_tarja
              ? (
                <>
                  <Button
                    title='Envase Procesado En Producción'
                    variant='solid'
                    color='emerald'
                    className='w-20 border-none rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <BiCheckDouble style={{ fontSize: 35 }}/>
                  </Button>

                  <ModalForm
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    open={detalleTarja}
                    setOpen={setDetalleTarja}
                    width={`text-white hover:scale-105`}
                    title='Detalle Control Calidad Bin Resultante Proceso Planta Harina'
                    icon={<HeroEye style={{ fontSize: 25 }} />}
                    >
                    <DetalleControlCalidadBinResultanteProcesoPlantaHarina id_bin={info.row.original.id}/>
                  </ModalForm>

                  <Button
                    title='Generación de código'
                    variant='solid'
                    color='sky'
                    className='w-20 border-none rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <IoIosBarcode  style={{ fontSize: 35 }}/>
                  </Button>
                </>
                )
              : (proceso_planta_harina?.estado_proceso! < '5' || proceso_planta_harina?.estado_proceso !== '2')
                ? (
                  <ModalForm
                    open={openModalCCTarja}
                    setOpen={setOpenModalCCTarja}
                    textTool='CC Tarja Resultante'
                    title='Control Calidad Tarja Resultante'
                    variant='solid'
                    color='amber'
                    icon={<RiErrorWarningFill style={{ fontSize: 35 }}/>}
                    size={900}
                    width={`w-20 rounded-md h-12 flex text-white items-center justify-center p-2 hover:scale-105`}
                    >
                      <FormularioCCBinResultanteProcesoPlantaHarina id_bin={info.row.original.id} setOpen={setOpenModalCCTarja}/>
                  </ModalForm>
                  )
                : null
            }
            {
              info.row.original.estado_bin != '2'
                ? (
                  <>
                    <Button
                      variant='solid'
                      color='red'
                      onClick={() => {
                        dispatch(eliminar_bin_resultante_proceso_planta_harina({ id: parseInt(id!), params: { id_bin: info.row.original.id }, token, verificar_token: verificarToken }))
                      }}
                      className='w-20 h-12 text-white'
                      >
                        <HeroXMark style={{ fontSize: 35 }}/>
                    </Button>
                  </>
                )
                : null
            }
            <>
          </>
          
        </div>
        )
      },
			header: 'Acciones',
		})
  ]

  const table = useReactTable({
		data: bins_resultantes,
    columns,
		state: {
			sorting,
			globalFilter,
		},
    enableRowSelection: true,
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
    { id: 'codigo_tarja', header: '', className: 'w-36' },
    { id: 'peso_neto', header: '', className: 'w-32' },
    { id: 'tipo_patineta', header: '', className: 'w-44 text-center' },
    { id: 'variedad', header: '', className: 'w-36 text-center' },
    { id: 'fecha_creacion', header: '', className: 'w-44 text-center' },
  ]
  

  return (
    <Container className='w-full !p-0'>
      <Card>
        <CardHeader>
          <FieldWrap
            firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
            lastSuffix={
              globalFilter && (
                <Icon
                  icon='HeroXMark'
                  color='red'
                  className='mx-2 cursor-pointer'
                  onClick={() => {
                    setGlobalFilter('');
                  }}
                />
              )
            }>
            <Input
              id='search'
              name='search'
              placeholder='Busca bin resultante...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </CardHeader>
        <CardBody className='overflow-x-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  );
};

export default TablaBinResultanteProcesoPlantaHarina;
