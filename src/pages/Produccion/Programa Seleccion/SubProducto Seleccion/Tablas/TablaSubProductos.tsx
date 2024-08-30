	import { useEffect, useState } from 'react';
	import {
		createColumnHelper,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		SortingState,
		useReactTable,
	} from '@tanstack/react-table';
	import { Link, useLocation, useNavigate } from 'react-router-dom';
	import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
	import { useAuth } from '../../../../../context/authContext';
	import { RootState } from '../../../../../redux/store';
	import { TSeleccion, TSubproducto } from '../../../../../types/TypesSeleccion.type';
	import { format } from '@formkit/tempo';
	import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
	import Subheader, { SubheaderLeft } from '../../../../../components/layouts/Subheader/Subheader';
	import FieldWrap from '../../../../../components/form/FieldWrap';
	import Icon from '../../../../../components/icon/Icon';
	import Input from '../../../../../components/form/Input';
	import Container from '../../../../../components/layouts/Container/Container';
	import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../../components/ui/Card';
	import Badge from '../../../../../components/ui/Badge';
	import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
	import { fetchSubProductoListaSinFiltros } from '../../../../../redux/slices/seleccionSlice';
	import Label from '../../../../../components/form/Label';
	import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact';
	import { fetchOperarios } from '../../../../../redux/slices/operarioSlice';
	import { optionsTipoSubProducto } from '../../../../../utils/options.constantes';
	import { useDispatch } from 'react-redux';
	import { ThunkDispatch } from '@reduxjs/toolkit';



	const TablaSubProductos = () => {
		const navigate = useNavigate()
		const [registroSubProducto, setRegistroSubProducto] = useState<boolean>(false)
		const [sorting, setSorting] = useState<SortingState>([]);
		const [globalFilter, setGlobalFilter] = useState<string>('')
		const { pathname } = useLocation()
		const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
		const { verificarToken } = useAuth()

		const token = useAppSelector((state: RootState) => state.auth.authTokens)

		const listaSubproductos = useAppSelector((state: RootState) => state.seleccion.lista_subproducto_sin_filtros)
		const operarios = useAppSelector((state: RootState) => state.operarios.operarios)

		useEffect(()  => {
			//@ts-ignore
			dispatch(fetchOperarios({ token, verificar_token: verificarToken }))
		}, [])
		
		useEffect(()  => {
			//@ts-ignore
			dispatch(fetchSubProductoListaSinFiltros({ token, verificar_token: verificarToken }))
		}, [])


		const optionsOperarios: TSelectOptions = operarios.map((operario) => ({
			value: String(operario.id),
			label: `${operario.nombre} ${operario.apellido}`
		}))
		

		const columnHelper = createColumnHelper<TSubproducto>();

		const columns = [
			columnHelper.accessor('seleccion', {
				cell: (info) => (
					<div className='font-bold'>
						Programa Selección N° {`${info.row.original.seleccion}`}
					</div>
				),
				header: 'Programa Selección',
			}),
			columnHelper.accessor('operario_nombres', {
				cell: (info) => {

					return (
						<div className='font-bold'>
							<p className=''>{info.row.original.operario_nombres}</p>
						</div>
					)
				},
				header: 'Operario',
			}),
			columnHelper.accessor('peso', {
				cell: (info) => {

					return (
						<div className='font-bold'>
							<p className=''>{info.row.original.peso}</p>
						</div>
					)
				},
				header: 'Peso',
			}),
			columnHelper.accessor('tipo_subproducto_label', {
				cell: (info) => {

					return (
						<div className='font-bold'>
							<p className=''>{info.row.original.tipo_subproducto_label}</p>
						</div>
					)
				},
				header: 'Tipo Sub Producto',
			}),
			columnHelper.accessor('en_bin', {
				cell: (info) => {

					return (
						<div className='font-bold'>
							<p className=''>{info.row.original.en_bin ? 'Si' : 'No'}</p>
						</div>
					)
				},
				header: 'Procesado',
			}),
			columnHelper.accessor('fecha_creacion', {
				cell: (info) => {
					return (
						<div className='font-bold'>
							<p className=''>{format(info.row.original.fecha_creacion, { date: 'short', time: 'short' } , 'es' )}</p>
						</div>
					)
				},	
				header: 'Envases en Proc.',
			}),
		];



		const table = useReactTable({
			data: listaSubproductos,
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

		return (
			<PageWrapper name='Lista SubProductos'>
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
								placeholder='Busca programa...'
								value={globalFilter ?? ''}
								onChange={(e) => setGlobalFilter(e.target.value)}
							/>
						</FieldWrap>
					</SubheaderLeft>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full overflow-auto'>
					<Card className='h-full w-full'>
						<CardHeader>
							<div className='w-full lg:w-7/12 flex lg:flex-row flex-col gap-5'>
									
									<div className="w-full flex-col">
										<Label htmlFor="calle">Operario: </Label>
										<SelectReact
												options={[{ value: '', label: 'Selecciona un operario' }, ...optionsOperarios]}
												id='operario'
												placeholder='Operario'
												name='operario'
												className='w-full h-14 py-2'
												onChange={(selectedOption: any) => {
													if (selectedOption && selectedOption.value === '') {
														setGlobalFilter('')
													} else {
														setGlobalFilter(selectedOption.label);
													}
												}}
											/>
									</div>

									<div className="w-full flex-col">
										<Label htmlFor="calle">Sub Productos: </Label>
										<SelectReact
											options={[{ value: '', label: 'Selecciona un Sub Producto' }, ...optionsTipoSubProducto]}
											id='tipo_subproducto'
											placeholder='Tipo Sub Producto'
											name='tipo_subproducto'
											className='w-full h-14 py-2'
											onChange={(selectedOption: any) => {
												if (selectedOption && selectedOption.value === '') {
													setGlobalFilter('')
												} else {
													setGlobalFilter(selectedOption.label);
												}
											}}
										/>
									</div>

								</div>
						</CardHeader>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>Sub Productos Programas de Selección</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{table.getFilteredRowModel().rows.length} registros
								</Badge>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='overflow-x-auto'>
							<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
						</CardBody>
						<TableCardFooterTemplate table={table} />
					</Card>
				</Container>
			</PageWrapper>
		);
	};

	export default TablaSubProductos;

