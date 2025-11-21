import { Dispatch, FC, SetStateAction, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import useDarkMode from '../../../hooks/useDarkMode';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import Button from '../../../components/ui/Button';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import { HeroEye, HeroXMark } from '../../../components/icon/heroicons';
import Tooltip from '../../../components/ui/Tooltip';
import { FaFilePdf } from 'react-icons/fa';
import { TGuia } from '../../../types/TypesRecepcionMP.types';
import { useAuth } from '../../../context/authContext';
import { eliminarGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import { FetchOptions } from '../../../types/fetchTypes.types';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown';
import { HiCheckCircle, HiQuestionMarkCircle, HiXCircle } from 'react-icons/hi';
import { FaFileExcel } from "react-icons/fa6";
import * as XLSX from 'xlsx'
interface IGuiaProps {
	data: TGuia[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const TablaGuiaRecepcion: FC<IGuiaProps> = ({ data }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const kilos_recepcion = useAppSelector((state: RootState) => state.recepcionmp.kilos_recepcion);
	const { verificarToken } = useAuth()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)
	const columnHelper = createColumnHelper<TGuia>();
	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold w-20'>{`${info.row.original.id}`}</div>
			),
			header: 'N° Guia'
		}),
		columnHelper.accessor('nombre_productor', {
			cell: (info) => (
				<Tooltip text={`${info.row.original.nombre_productor}`}>
					<div className='font-bold truncate'>{`${info.row.original.nombre_productor}`}</div>
				</Tooltip>
			),
			header: 'Productor',
		}),
		columnHelper.accessor('camion', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.nombre_camion}`}</div>
			),
			header: 'Camión',
		}),
		columnHelper.accessor('lotesrecepcionmp', {
			cell: (info) => {
				const numero_lotes = info.row.original.lotesrecepcionmp ? info.row.original.lotesrecepcionmp.length : 0
				return (
					<>
						<Dropdown>
							<DropdownToggle>
								<Button variant='solid'>Lotes</Button>
							</DropdownToggle>
							<DropdownMenu>
								{
									info.row.original.lotesrecepcionmp && info.row.original.lotesrecepcionmp.length > 0 && info.row.original.lotesrecepcionmp.map(element => (
										<DropdownItem>
											<div className='w-full flex'>
												<span className='font-bold'>Lote N° { element.estado_recepcion == '4' && element.lote_rechazado != null ? element.lote_rechazado.numero_lote_rechazado : element.numero_lote } : {element.estado_label} </span>
												{element.estado_recepcion <= '2' ? <HiQuestionMarkCircle className='text-2xl' color='#2563eb' /> : element.estado_recepcion === '4' ? <HiXCircle className='text-2xl' color='#dc2626' /> : element.estado_recepcion >= '5' ? <HiCheckCircle className='text-2xl' color='#16a34a' /> : null }
											</div>
										</DropdownItem>
									))
								}
							</DropdownMenu>
						</Dropdown>
					</>
				)
			},
			header: 'Lotes',
		}),
		columnHelper.accessor('estado_recepcion', {
			cell: (info) => (
				<>
					{ info.row.original.lotesrecepcionmp && info.row.original.lotesrecepcionmp.length > 0 && info.row.original.estado_recepcion === '4' && info.row.original.lotesrecepcionmp.every(element => element.estado_recepcion === '4') ? (
						<div className='font-bold'>Guia Rechazada</div>
					) :
						<div className='font-bold'>{`${info.row.original.estado_recepcion_label}`}</div>
					}
				</>
			),
			header: 'Estado',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const row = info.row.original

				return (
					<div className={`h-full w-full flex gap-2 ${info.row.original.estado_recepcion === '4' ? 'flex-wrap justify-center' : 'flex-nowrap justify-center'}  `}>
						<Link to={`/rmp/recepcionmp/${info.row.original.id}`} state={{ pathname: '/recepcionmp/' }}>
							<Button
								variant='solid'
								color='blue'
								colorIntensity='700'>
								<HeroEye style={{ fontSize: 25 }} />
							</Button>
						</Link>

						{ info.row.original.lotesrecepcionmp && info.row.original.lotesrecepcionmp.length > 0 &&  info.row.original.estado_recepcion === '4' && !info.row.original.lotesrecepcionmp.every(element => element.estado_recepcion === '4') && (
							<Link to={`/rmp/pdf-guia-recepcion/${info.row.original.id}`} state={{ guia: row, pathname: '/recepcionmp/' }}>
								<Button
									variant='solid'
									color='red'
									colorIntensity='900'
									>
									<FaFilePdf style={{ fontSize: 25 }} />
								</Button>
							</Link>
						)}

						{/* { ((hasGroup(['registros-admin']) || hasGroup(['recepcion-mp'])) && comercializador == "Prodalmen" ) && (
							<Button
								variant='solid'
								color='red'
								colorIntensity='700'
								onClick={() => 
									dispatch(eliminarGuiaRecepcion({ id, token, verificar_token: verificarToken }))
								}>
								<HeroXMark style={{ fontSize: 25 }} />
							</Button>
						)} */}
					</div>
				);
			},
			header: 'Acciones'
		}),
	]

	const exportToExcel = (data: any[]) => {
			const filteredInfomation = data.map(({ original }) => ({
				"N° Guia": original.id,
				"Productor": original.nombre_productor,
				"Camión": original.nombre_camion,
				"Lotes": original.lotesrecepcionmp ? original.lotesrecepcionmp.map((element: any) => `${element.numero_lote}`).join(', ') : '',
				"Variedad": original.lotesrecepcionmp ? original.lotesrecepcionmp.map((element: any) => element.variedad || '').filter((v: string) => v).join(', ') : '',
				"Estado": original.estado_recepcion_label,
				"Fecha Recepción": original.fecha_creacion.split("T")[0],
				"N° Guia Productor": original.numero_guia_productor,
				"comercializador": original.nombre_comercializador,
				// Calculate kilos netos using kilos_neto_fruta which includes: kilos_brutos - kilos_tara - kilos_envases
				"Kilos Netos": original.lotesrecepcionmp ? original.lotesrecepcionmp.reduce((acc: number, element: any) => {
					return acc + (element.kilos_neto_fruta ?? 0);
				}, 0) : 0,
			}))
			const wb = XLSX.utils.book_new()
			const ws = XLSX.utils.json_to_sheet(filteredInfomation)
			XLSX.utils.book_append_sheet(wb, ws, 'Guias Recepcion')
			XLSX.writeFile(wb, 'guias_recepcion.xlsx')
	
		}

	const table = useReactTable({
		data,
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
		getSortedRowModel
		: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 5 } },
	});

	return (
		<PageWrapper name='Lista Guia Recepcion Materia Prima'>
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
							placeholder='Busca la guia...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
					
				</SubheaderLeft>
				<SubheaderRight className='w-full md:w-4/12'>
				<div className='w-full border-black flex flex-col md:flex-row lg:flex-row gap-2'>
                <div className='w-full lg:w-auto flex flex-col items-center rounded-md bg-emerald-700'>
                  <span className='text-lg text-center font-semibold text-white'>{Math.round(kilos_recepcion?.total_kilos_prodalmen ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kgs</span>
                  <label htmlFor="" className='font-semibold text-white text-center text-sm'>Total Recepcionados Prodalmen</label>
                </div>
				<div className='w-full lg:w-auto flex flex-col items-center rounded-md bg-emerald-700'>
                  <span className='text-lg text-center font-semibold text-white'>{Math.round(kilos_recepcion?.total_kilos_pacificnut ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kgs</span>
                  <label htmlFor="" className='font-semibold text-white text-center text-sm'>Total Recepcionados Pacific</label>
                </div>
				</div>
				</SubheaderRight>
				{ (hasGroup(['recepcion-mp']) && comercializador == "Prodalmen") && ( 
					<SubheaderRight>
						<Link to={`/rmp/registro-guia-recepcion/`} state={{ pathname: '/recepcionmp/' }}>
							<Button variant='solid' icon='HeroPlus'>
								Agregar Guia Recepción
							</Button>
						</Link>
					</SubheaderRight>
				)}
			</Subheader>
			<CardHeader>
			<div className="w-full flex	gap-5">
				<Button
					variant="solid"
					onClick={() => exportToExcel(table.getFilteredRowModel().rows)}
					className="bg-green-600 hover:bg-green-500 border border-green-600 hover:border-green-500 hover:scale-105"
					>
					<FaFileExcel style={{ fontSize: 20, color: 'white'}}/>
					Exportar archivo CSV
				</Button>
			</div>
		</CardHeader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Guias de Recepción</CardTitle>
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
						<TableTemplate className='table-fixed max-md:min-w-[80rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaGuiaRecepcion;
