import React, { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Link, useLocation } from 'react-router-dom';
import { format } from "@formkit/tempo"
import { GiTestTubes } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { TControlCalidadTarja } from '../../../types/TypesControlCalidad.type';
import useDarkMode from '../../../hooks/useDarkMode';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { HeroEye } from '../../../components/icon/heroicons';
import ModalForm from '../../../components/ModalForm.modal';
import FormularioControlCalidadTarjaSeleccionada from '../../Produccion/Programa Seleccion/Formularios/FormularioControlCalidadTarjaSeleccionada';
import { useAuth } from '../../../context/authContext';
import { fetchCalibracionTarjasSeleccionadas } from '../../../redux/slices/controlcalidadSlice';
import { TTarjaSeleccionadaCalibracion } from '../../../types/TypesSeleccion.type';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft } from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../templates/common/TableParts.template';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';


const columnHelper = createColumnHelper<TTarjaSeleccionadaCalibracion>();

const TablaControlCalidadTarja = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const { isDarkTheme } = useDarkMode()
	
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const { pathname } = useLocation()
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)
	
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()

	const cc_tarja_seleccionadas = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_tarjaseleccionada)
	useEffect(() => {
		//@ts-ignore
		dispatch(fetchCalibracionTarjasSeleccionadas({ token, verificar_token: verificarToken }))
	}, [])
	


	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.id}`}</div>
			),
			header: 'N° Tarja',
		}),
		columnHelper.accessor('codigo_tarja', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.codigo_tarja}`}</div>
			),
			header: 'Código Tarja',
		}),
		columnHelper.accessor('variedad', {
			cell: (info) => {
				<div>{info.row.original.variedad}</div>
			},
			header: 'Variedad',
		}),
		columnHelper.accessor('estado_cc_label', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.estado_cc_label}`}</div>
			),
			header: 'Estado',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>{`${format(info.row.original.fecha_creacion, {date: 'long', time: 'short'}, 'es')}`}</div>
			),
			header: 'Fecha Creación',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const [calibracionModalStatus, setCalibracionModalStatus] = useState<boolean>(false);
				const id = info.row.original.id;


				return (
					<div className='h-full w-full flex justify-center gap-2 flex-wrap'>
						<Link to={`/cdc/csel/tarja-cc-seleccion/${info.row.original.id}`} state={{ pathname: '/tarja-cc-seleccion/'}}>
							<Button
								variant='solid'
								color='blue'
								colorIntensity='700'
								className='w-20 px-1 h-12 text-white hover:scale-105'
								>
								<HeroEye style={{ fontSize: 32 }} />
							</Button>
						</Link>
						

						{
							hasGroup(['controlcalidad'])  && info.row.original.estado_cc !== '3'
								? (
									<ModalForm
											open={calibracionModalStatus}
											setOpen={setCalibracionModalStatus}
											title='Calibración Tarja'
											textTool='Calibrar Tarja'
											variant='solid'
											size={900}
											width={`w-16 h-12 dark:bg-[#7124b5] dark:hover:bg-[#8647bc] !bg-[#7124b5] hover:bg-[#8647bc] text-white hover:scale-105 border-none`}
											icon={<GiTestTubes style={{ fontSize: 25 }}
											/>}
										>
											<FormularioControlCalidadTarjaSeleccionada isOpen={setCalibracionModalStatus} id_lote={id}/>
										</ModalForm>
									)
								: null
						}
					</div>
				);
			},
			header: 'Acciones'
		}),
	];

	const table = useReactTable({
		data: cc_tarja_seleccionadas,
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
    { id: 'id', header: '', className: 'lg:w-32' },
    { id: 'codigo_tarja', header: '', className: 'lg:w-48' },

  ]
  

	return (
		<PageWrapper name='Lista Control Calidad Tarjas'>
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
							placeholder='Busca el control...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Controles de Calidad Tarjas</CardTitle>
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
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaControlCalidadTarja;
