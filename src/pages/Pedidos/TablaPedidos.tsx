import {FC, useEffect, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { useAuth } from '../../context/authContext';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import ModalForm from '../../components/ModalForm.modal';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Checkbox, { CheckboxGroup } from '../../components/form/Checkbox';
import TableTemplate, { TableCardFooterTemplate } from '../../templates/common/TableParts.template';
import Tooltip from '../../components/ui/Tooltip';
import Button from '../../components/ui/Button';
import { HeroEye, HeroXMark } from '../../components/icon/heroicons';
import { fetchWithTokenDelete } from '../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import Input from '../../components/form/Input';
import { DETALLE_PEDIDO, fetchPedidos } from '../../redux/slices/pedidoSlice';
import { PedidoTipo, TPedidos, getButtonColor } from '../../types/TypesPedidos.types';
import { format } from '@formkit/tempo';
import FormularioPedidoMercadoInterno from './Formularios/FormularioPedidoMercadoInterno';
import FormularioPedidoExportacion from './Formularios/FormularioPedidoExportacion';
import { Link, useNavigate } from 'react-router-dom';
import { fetchContentTypes } from '../../redux/slices/registrosbaseSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import FormularioGuiaSalida from './Guia Salida/FormularioGuiaSalida';
import { FaFilePdf } from 'react-icons/fa6';


const TablaPedidos = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()

	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const [checkboxSeleccionado, setCheckboxSeleccionado] = useState<{ [key: string]: boolean }>({});
	const pedidos = useAppSelector((state: RootState) => state.pedidos.pedidos)
	const contenttypes = useAppSelector((state: RootState) => state.core.contenttypes)

	const navigate = useNavigate()


	useEffect(() => {
		if (contenttypes.length < 1){
			dispatch(fetchContentTypes({ token, verificar_token: verificarToken }))	
		}
	}, [contenttypes])

  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);

  useEffect(() => {
    setCheckboxSeleccionado({ pedidomercadointerno: true });
  }, []);

  useEffect(() => {
    if (Object.keys(checkboxSeleccionado).length > 0) {
      dispatch(fetchPedidos({ 
        params: { search: `?tipo_pedido=${Object.keys(checkboxSeleccionado)[0]}` }, 
        token, 
        verificar_token: verificarToken 
      }));
    }
  }, [checkboxSeleccionado, dispatch, token, verificarToken]);


  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxSeleccionado(() => {
      const newState = {};

      // Si se está marcando un checkbox, desmarca todos los demás
      if (checked) {
				//@ts-ignore
        newState[id] = true;
      }

      return newState;
    });
  };




	const eliminarPedido = async (id: number) => {
		const token_verificado = await verificarToken(token!)
	
		if (!token_verificado) throw new Error('Token no verificado')

		const res = await fetchWithTokenDelete(`api/pedidos/eliminar_pedido?tipo_pedido=${Object.keys(checkboxSeleccionado)[0]}&id=${id}`, token_verificado)
		if  (res.ok){
			toast.success('Se ha eliminado exitosamente')
			//@ts-ignore
			dispatch(fetchPedidos({ params: { search: `?tipo_pedido=${Object.keys(checkboxSeleccionado)[0]}` }, token, verificar_token: verificarToken }))
		} else {
			toast.error('No ha logrado eliminar')
		}
	}


	const columnHelper = createColumnHelper<TPedidos>();

	const columns = [
		Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' || Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion'
			? (
				columnHelper.accessor('pedido', {
					cell: (info) => (
						<div className='font-bold '>
							{`${info.row.original.pedido}`}
						</div>
					),
					header: 'N° Pedido',
				})
			)
			: (
				columnHelper.accessor('cliente', {
					cell: (info) => (
						<div className='font-bold '>
							{`${info.row.original.cliente}`}
						</div>
					),
					header: 'Cliente',
				})
			),
		Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' || Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion'
			? (
				columnHelper.accessor('razon_social', {
					cell: (info) => (
						<div className='font-bold '>
							{`${info.row.original.razon_social}`}
						</div>
					),
					header: 'Razón Social',
				})
			)
			: (
				columnHelper.accessor('tipo_guia', {
					cell: (info) => (
						<div className='font-bold '>
							{`${info.row.original.tipo_guia}`}
						</div>
					),
					header: 'Tipo Guía',
				})
			),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold	'>
					{format(info.row.original.fecha_creacion, { date: 'short', time: 'short'}, 'es' )}
				</div>
			),
			header: 'Fecha Creación',
		}),
		columnHelper.accessor('fecha_entrega', {
			cell: (info) => (
				<div className='font-bold'>
					{format(info.row.original.fecha_entrega, { date: 'short'}, 'es' )}
				</div>
			),
			header: 'Fecha Entrega',
		}),
		columnHelper.accessor('estado_pedido', {
			cell: (info) => {
				const estado = info.row.original.estado_pedido

				return (
					<div className='w-full'>
						<Button
							variant='solid'
							className='w-full text-lg'
							color={getButtonColor(Object.keys(checkboxSeleccionado)[0] as PedidoTipo, estado)}
						>
							{info.row.original.estado_pedido}
						</Button>
					</div>
				)
			},
			header: 'Estado Pedido',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const [detalleModalStatus, setDetalleModalStatus] = useState(false)
				const link_mercado_interno = `/ventas/pedidos/pedido-interno/${info.row.original.id_pedido}`
				const link_exportacion = `/ventas/pedidos/pedido-exportacion/${info.row.original.id_pedido}`
				const link_guia_salida = `/ventas/pedidos/guia/guia-salida/${info.row.original.id_guia}/`

				const link_pdf_mercado_interno = `/ventas/pedidos/pdf-pedido-interno/${info.row.original.id_pedido}`
				const link_pdf_mercado_externo = `/ventas/pedidos/pdf-pedido-exportacion/${info.row.original.id_pedido}`
				const link_pdf_guia_salida = `/ventas/pedidos/guia/pdf-guia-salida/${info.row.original.id_guia}`




				return (
					<div className='h-full w-full flex gap-2 flex-wrap justify-center'>
						<Link to={Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' ?
						 	link_mercado_interno : Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion' ?
							link_exportacion : link_guia_salida} state={{ pathname: '/pedidos/'}}>
							<Button 
								title='Detalle'
								variant='solid'
								color='blue'
								colorIntensity='700'
								className='hover:scale-105'
								>
								<HeroEye style={{ fontSize: 25 }}/>
							</Button>
						</Link>
					{
						hasGroup(['registros-admin', ''])
								? (
									<Button
										title='Eliminar'
										variant = 'solid'
										color = 'red'
										colorIntensity = '600'
										className='hover:scale-105'
										onClick={() => {
											if (['pedidoexportacion', 'pedidomercadointerno'].includes(info.row.original.tipo_guia!)){
												eliminarPedido(info.row.original.id_pedido)
											} else {
												eliminarPedido(info.row.original.id_guia!)
											}
										}}
										>
											<HeroXMark style={{ fontSize: 25 }} />
									</Button>
								)
							: null
					}

					{
							['Pedido Completado', 'Pedido Entregado y Finalizado', 'Completado', 'Completado','Aprobada', 'Completada y entregada'].includes(info.row.original.estado_pedido) 
								? (
									<Link to={Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' ?
										link_pdf_mercado_interno : Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion' ?
										link_pdf_mercado_externo : link_pdf_guia_salida} state={{ pathname: '/pedidos/'}}>
										<Button 
											title='Detalle'
											variant='solid'
											color='red'
											colorIntensity='800'
											className='hover:scale-105'
											>
											<FaFilePdf style={{ fontSize: 25 }}/>
										</Button>
									</Link>
								)
								: null
						}
						<Button variant='solid' color="fuchsia" onClick={() => {navigate(`/ventas/pedidos/detalle/${info.row.original.id}`)}}><HeroEye fontSize={25}/></Button>
					</div>
				);
			},
			header: 'Acciones'
		})
	]




	const table = useReactTable({
		data: pedidos,
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
			pagination: { pageSize: 8 },
		},
	});

	return (
		<PageWrapper name='Lista Pedidos'>
			<Subheader>
				<SubheaderLeft>
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
							placeholder='Busca un pedido...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					{
						Object.keys(checkboxSeleccionado)[0] === 'guiasalidafruta'
						? (
							<ModalForm
								variant='solid'
								color='blue'
								open={modalStatus}
								setOpen={setModalStatus}
								textButton='Agregar Guía Salida'
								title='Agregar Guía Salida'
								>
									<FormularioGuiaSalida />
							</ModalForm>
						)
						: Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno'
							? (
								<>
									<ModalForm
										open={modalStatus}
										setOpen={setModalStatus}
										variant='solid'
										size={800}
										title={Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' ? 'Agregar Pedido Mercado Interno' : Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion' ? 'Agregar Pedido Exportación' : ''}
										width={`w-full h-11 px-5 dark:bg-[#3B82F6] dark:hover:bg-[#3b83f6cd] bg-[#3B82F6] hover:bg-[#3b83f6cd] text-white hover:scale-105`}
										textButton={Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' ? 'Agregar Pedido Mercado Interno' : Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion' ? 'Agregar Pedido Exportación' : null}
									>
										<FormularioPedidoMercadoInterno setOpen={setModalStatus} tipo_cliente='pedidomercadointerno'/>
									</ModalForm>
								</>
								)
							: Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion'
								? (
									<ModalForm
										open={modalStatus}
										setOpen={setModalStatus}
										variant='solid'
										size={800}
										title={Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' ? 'Agregar Pedido Mercado Interno' : Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion' ? 'Agregar Pedido Exportación' : ''}
										width={`w-full h-11 px-5 dark:bg-[#3B82F6] dark:hover:bg-[#3b83f6cd] bg-[#3B82F6] hover:bg-[#3b83f6cd] text-white hover:scale-105`}
										textButton={Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno' ? 'Agregar Pedido Mercado Interno' : Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion' ? 'Agregar Pedido Exportación' : null}
									>
										<FormularioPedidoExportacion setOpen={setModalStatus} tipo_pedido='pedidoexportacion'/>
									</ModalForm>
									)
								: null
							
					}
					
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>
								{
									Object.keys(checkboxSeleccionado)[0] === 'pedidomercadointerno'
										? 'Pedidos Mercado Interno'
										: Object.keys(checkboxSeleccionado)[0] === 'pedidoexportacion'
											? 'Pedidos Exportación'
											: Object.keys(checkboxSeleccionado)[0] === 'guiasalidafruta'
												? 'Guias Salida'
												: null
								}
							</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>
						<CardHeaderChild>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						<CheckboxGroup isInline>
							<Checkbox
								label='Pedidos Mercado Interno'
								id='pedidomercadointerno'
								onChange={(e) => handleCheckboxChange('pedidomercadointerno', e.target.checked)}
								checked={checkboxSeleccionado['pedidomercadointerno']}
							/>
							<Checkbox
								label='Pedidos Exportación'
								id='pedidoexportacion'
								onChange={(e) => handleCheckboxChange('pedidoexportacion', e.target.checked)}
								checked={checkboxSeleccionado['pedidoexportacion']}
							/>
							<Checkbox
								label='Guias Salida'
								id='guiasalidafruta'
								onChange={(e) => handleCheckboxChange('guiasalidafruta', e.target.checked)}
								checked={checkboxSeleccionado['guiasalidafruta']}
							/>
						</CheckboxGroup>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} className='mt-2 mb-10' />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaPedidos;
