import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiCheckDouble } from 'react-icons/bi';
import ModalForm from '../../../../../components/ModalForm.modal';
import { RiErrorWarningFill } from 'react-icons/ri';
import { fetchWithTokenPatch } from '../../../../../utils/peticiones.utils';
import { Link, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HeroEye, HeroXMark } from '../../../../../components/icon/heroicons';
import { fetchCalibracionTarjasSeleccionadas } from '../../../../../redux/slices/controlcalidadSlice';
import Button from '../../../../../components/ui/Button';
import { TTarjaResultanteReproceso } from '../../../../../types/TypesReproceso.types';
import { fetchBinsEnReproceso, fetchProgramaReproceso, fetchTarjasResultantesReproceso } from '../../../../../redux/slices/reprocesoSlice';
import { format } from '@formkit/tempo';
import FormularioControlCalidadTarjaReproceso from '../../Formularios/FormularioControlCalidadTarjaReproceso';
import { IoIosBarcode } from 'react-icons/io';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IRendimientoMuestra {

}

const TablaTarjaResultanteReproceso: FC<IRendimientoMuestra> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [cc_seleccionada, setCCSeleccionada] = useState(false)
  const { pathname } = useLocation()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const tarja_resultante_reproceso = useAppSelector((state: RootState) => state.reproceso.tarjas_resultantes)
  const programa_reproceso = useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
  const cc_tarjas_seleccionadas = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_tarjaseleccionada)

  useEffect(() => {
    dispatch(fetchCalibracionTarjasSeleccionadas({ token, verificar_token: verificarToken }))
    dispatch(fetchBinsEnReproceso({ id, token, verificar_token: verificarToken }))
    dispatch(fetchProgramaReproceso({ id, token, verificar_token: verificarToken }))
  }, [])
  

  const eliminarTarja = async (id_lote: number) => {
    const token_verificado = await verificarToken(token!)
    
    if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/reproceso/${id}/tarjas_resultantes/eliminar_tarja_reproceso/`, 
    {
      id: id_lote,
      reproceso: id,  
      esta_eliminado: true  
    },
    token_verificado
  )
  
  if (res.ok){
    toast.success("Tarja Eliminada Correctamente")
    dispatch(fetchTarjasResultantesReproceso({ id: parseInt(id!), token, verificar_token: verificarToken }))
    setOpen(false)
  } else {
    toast.error("No se pudo eliminar la tarja, vuelve a intentarlo")
  }
}
  const columnHelper = createColumnHelper<TTarjaResultanteReproceso>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.codigo_tarja}`}
          </div>
        ),
        header: 'Código Tarja',
      }),
      columnHelper.accessor('peso', {
        cell: (info) => (
          <div className='font-bold'>
            {`${(info.row.original.peso - info.row.original.tipo_patineta).toLocaleString()}`}
          </div>
        ),
        header: 'Fruta Neta',
      }),
      columnHelper.accessor('tipo_patineta_label', {
        cell: (info) => (
          <div className='font-bold '>
            {`${info.row.original.tipo_patineta_label}`}
          </div>
        ),
        header: 'Tipo Patineta',
      }),
      columnHelper.accessor('fecha_creacion', {
        cell: (info) => (
          <div className='font-bold'>
            {`${format(info.row.original.fecha_creacion, { date: 'medium', time: 'short' }, 'es' )}`}
          </div>
        ),
        header: 'Calibre',
      }),
    columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
        const estado = info.row.original.cc_tarja
        const [cc_tarja_reproceso, setCCTarjaReproceso] = useState(false)


        return (
          <div className='w-full flex justify-center gap-2 flex-wrap'>
            {
              estado 
                ? (
                  <>
                    <Tooltip text='Envase Procesado en Producción'>
                      <Button
                        variant='solid'
                        className='w-20 border-none rounded-md h-12 bg-green-600 hover:bg-green-500 flex items-center justify-center p-2'
                        >
                          <BiCheckDouble style={{ fontSize: 35 }}/>
                      </Button>
                    </Tooltip>

                    <Tooltip text='Detalle Control Calidad Tarja Seleccionada'>
                      <Link to={`/cdc/cpro/tarjas-cc-reproceso/${id}/`} state={{ pathname: `/reproceso/programa/${id}/` }}>
                        <Button
                          variant='solid'
                          className='w-20 border-none rounded-md h-12 bg-blue-600 hover:bg-blue-500 flex items-center justify-center p-2 hover:scale-105'
                          >
                            <HeroEye style={{ fontSize: 35 }}/>
                        </Button>
                      </Link>
                    </Tooltip>

                    <Tooltip text='Generar código'>
                        <Button
                          variant='solid'
                          className='w-20 border-none rounded-md h-12 bg-blue-600 hover:bg-blue-500 flex items-center justify-center p-2 hover:scale-105'
                          >
                            <IoIosBarcode  style={{ fontSize: 35 }}/>
                        </Button>
                    </Tooltip>
                  </>
                  )
                : !(programa_reproceso?.estado! === '0' || programa_reproceso?.estado! !== '2' && programa_reproceso?.estado! <= '3')
                  ? (
                    <ModalForm
                      open={cc_tarja_reproceso}
                      setOpen={setCCTarjaReproceso}
                      textTool='Control Calidad Tarja Reproceso'
                      title='Control Calidad Tarja Reproceso'
                      variant='solid'
                      icon={<RiErrorWarningFill style={{ fontSize: 35 }}/>}
                      size={900}
                      width={`w-20 rounded-md border-none h-12 !bg-amber-600 flex items-center justify-center p-2 hover:scale-105`}
                      >
                        <FormularioControlCalidadTarjaReproceso id_lote={id} isOpen={setCCTarjaReproceso} tipo_resultante={info.row.original.tipo_patineta_label}/>
                    </ModalForm>
                    )
                  : null
            }
            {
               (programa_reproceso?.estado! === '0' || programa_reproceso?.estado! !== '2' && programa_reproceso?.estado! <= '3') || programa_reproceso?.estado === '5'
                ? null
                : !info.row.original.cc_tarja
                  ? (
                    (
                      <Tooltip text='Eliminar tarja'>
                        <Button
                          variant='solid'
                          onClick={() => eliminarTarja(id)}
                          className='w-20 border-none rounded-md h-12 bg-red-600 hover:bg-red-700 border-red-700 hover:border-red-700 flex items-center text-white justify-center p-2 hover:scale-105'
                          >
                            <HeroXMark style={{ fontSize: 35 }}/>
                        </Button> 
                      </Tooltip>
                    )
                  )
                  : null 
            }
          </div> 
        )
      },
      header: 'Acciones'
    })
	];
  
  const table = useReactTable({
		data: tarja_resultante_reproceso,
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
    { id: 'id', header: 'Código Tarja', className: 'w-36' },
    { id: 'peso', header: 'Fruta Neta', className: 'w-36' },
    { id: 'tipo_patineta_label', header: '', className: 'w-36' },
    { id: 'fecha_creacion', header: '', className: 'w-48' },
  ]

  return (
    <Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
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
                placeholder='Busca tarja resultante...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaTarjaResultanteReproceso;


