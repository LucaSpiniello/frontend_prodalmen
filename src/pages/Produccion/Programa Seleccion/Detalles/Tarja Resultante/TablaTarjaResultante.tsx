import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { TTarjaSeleccionada } from '../../../../../types/TypesSeleccion.type';
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
import { fetchTarjasSeleccionadas } from '../../../../../redux/slices/seleccionSlice';
import { fetchCalibracionTarjasSeleccionadas } from '../../../../../redux/slices/controlcalidadSlice';
import FormularioControlCalidadTarjaSeleccionada from '../../Formularios/FormularioControlCalidadTarjaSeleccionada';
import Button from '../../../../../components/ui/Button';
import { IoIosBarcode } from 'react-icons/io';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
// impoer TIPO_RESULTANTE_SELECCION from constante.ts
import { TIPO_RESULTANTE_SELECCION } from '../../../../../utils/constante'

interface IRendimientoMuestra {

}


const TablaTarjaResultanteSeleccion: FC<IRendimientoMuestra> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [cc_seleccionada, setCCSeleccionada] = useState(false)
  const { pathname } = useLocation()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const tarja_resultante_seleccion = useAppSelector((state: RootState) => state.seleccion.tarjas_seleccionadas)
  const programa_seleccion = useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)


  useEffect(() => {
    dispatch(fetchCalibracionTarjasSeleccionadas({ token, verificar_token: verificarToken }))
  }, [])
  

  const eliminarTarja = async (id_lote: number) => {
    const token_verificado = await verificarToken(token!)
    
    if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/seleccion/${id}/tarjaseleccionada/eliminar_tarja_seleccion/`, 
    {
      id: id_lote,
      seleccion: id,
      esta_eliminado: true
    },
    token_verificado
  )
  
  if (res.ok){
    toast.success("Tarja Eliminada Correctamente")
    //@ts-ignore
    dispatch(fetchTarjasSeleccionadas({ id, token, verificar_token: verificarToken }))
    setOpen(false)
  } else {
    toast.error("No se pudo eliminar la tarja, vuelve a intentarlo")
  }
}
  const columnHelper = createColumnHelper<TTarjaSeleccionada>();

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
          <div className='font-bold text-center'>
            {`${(info.row.original.peso - info.row.original.tipo_patineta).toLocaleString()}`}
          </div>
        ),
        header: 'Fruta Neta',
      }),
      columnHelper.accessor('tipo_resultante', {
        cell: (info) => {
          const tipoResultante = TIPO_RESULTANTE_SELECCION.find(
            (item) => item.value === info.row.original.tipo_resultante
          );
          
          return (
            <div className='font-bold text-center'>
              {tipoResultante ? tipoResultante.label : 'Desconocido'}
            </div>
          );
        },
        header: 'Tipo',
      }),
      columnHelper.accessor('calidad', {
        cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.calidad}`}
          </div>
        ),
        header: 'Calidad',
      }),
      columnHelper.accessor('variedad', {
        cell: (info) => (
          <div className='font-bold '>
            {`${info.row.original.variedad}`}
          </div>
        ),
        header: 'Variedad',
      }),
      columnHelper.accessor('calibre', {
        cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.calibre}`}
          </div>
        ),
        header: 'Calibre',
      }),
    columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
        const estado = info.row.original.cc_tarja
        const [cc_seleccionada, setCCSeleccionada] = useState(false)


        return (
          <div className='w-full flex flex-wrap justify-center gap-2'>
            {
              estado
                ? (
                  <>

                    <Button
                      title='Envase Procesado en Selección'
                      variant='solid'
                      color='emerald'
                      colorIntensity='700'
                      className='w-20 border-none rounded-md h-12 bg-green-600 hover:bg-green-500 flex items-center justify-center p-2'
                      >
                        <BiCheckDouble style={{ fontSize: 35 }}/>
                    </Button>

                    <Link to={`/cdc/csel/tarja-cc-seleccion/${id}/`} state={{ pathname: pathname }}>
                      <Button
                        title='Detalle Control Calidad Tarja Seleccionada'
                        color='blue'
                        colorIntensity='700'
                        variant='solid'
                        className='w-20 border-none rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'
                        >
                          <HeroEye style={{ fontSize: 35 }}/>
                      </Button>
                    </Link>

                    <Button
                      title='Generar Código'
                      variant='solid'
                      color='violet'
                      className='w-20 border-none rounded-md h-12  flex items-center justify-center p-2 hover:scale-105'
                      >
                        <IoIosBarcode style={{ fontSize: 35 }}/>
                    </Button>
                  </>
                  )
                : !(programa_seleccion?.estado_programa! !== '2' && programa_seleccion?.estado_programa! <= '3')
                  ? (
                    <ModalForm
                      open={cc_seleccionada}
                      setOpen={setCCSeleccionada}
                      textTool='CC Tarja Seleccionada'
                      color='amber'
                      colorIntensity='600'
                      title='Control Calidad Tarja Seleccionada'
                      variant='solid'
                      icon={<RiErrorWarningFill style={{ fontSize: 35 }}/>}
                      size={900}
                      width={`w-20 rounded-md border-none h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105`}
                      >
  
                        <FormularioControlCalidadTarjaSeleccionada id_lote={id} isOpen={setCCSeleccionada}/>
                    </ModalForm>
                    )
                  : null
            }
            {
              programa_seleccion?.estado_programa === '5' || (programa_seleccion?.estado_programa! !== '2' && programa_seleccion?.estado_programa! <= '3')
                ? null
                : !info.row.original.cc_tarja
                  ? (
                    <Tooltip text='Envase a Procesar'>
                      <Button
                        variant='solid'
                        color='red'
                        colorIntensity='700'
                        onClick={() => eliminarTarja(id)}
                        className='text-white hover:scale-105'
                        >
                          <HeroXMark style={{ fontSize: 25 }}/>
                      </Button>
                    </Tooltip>
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
		data: tarja_resultante_seleccion ? tarja_resultante_seleccion : [],
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
    { id: 'id', header: 'Código Tarja', className: 'lg:w-36 ' },
    { id: 'peso', header: 'Fruta Neta', className: 'lg:w-32' },
    { id: 'tipo_resultante', header: 'Tipo', className: 'lg:w-40' },
    { id: 'calidad', header: '', className: 'lg:w-40' },
    { id: 'variedad', header: '', className: 'lg:w-40' },
    { id: 'calibre', header: '', className: 'lg:w-40' },
    { id: 'actions', header: '', className: 'w-auto' },
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
                placeholder='Busca programa...'
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

export default TablaTarjaResultanteSeleccion;


