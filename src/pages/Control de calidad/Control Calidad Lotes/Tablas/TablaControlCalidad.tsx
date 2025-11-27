import { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
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
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, {
	TableCardFooterTemplate,
	TableColumn,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import { format } from "@formkit/tempo"
import ModalRegistro from '../../../../components/ModalForm.modal';
import useDarkMode from '../../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import { useAuth } from '../../../../context/authContext';
import { TControlCalidad } from '../../../../types/TypesControlCalidad.type';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import FormularioEdicionControlCalidad from '../Formularios/EdicionControlCalidadMuestras';
import Button from '../../../../components/ui/Button';
import { fetchWithTokenDelete, fetchWithTokenPut } from '../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { DuoDoubleCheck } from '../../../../components/icon/duotone';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { fetchControlesDeCalidadPaginados, GUARDAR_ESTADO_TABLA_CC } from '../../../../redux/slices/controlcalidadSlice';


const columnHelper = createColumnHelper<TControlCalidad>();


interface IControlProps {
	data: TControlCalidad[] | []
	paginationMetadata?: {
		total_count: number
		desde: number
		hasta: number
		has_next: boolean
		has_previous: boolean
	}
	currentPage?: number
	onPageChange?: (newPage: number) => void
	pageSize?: number
	loadingPagination?: boolean
}

const TablaControlCalidad: FC<IControlProps> = ({
	data,
	paginationMetadata,
	currentPage = 0,
	onPageChange,
	pageSize = 10,
	loadingPagination = false
}) => {
	// Obtener el estado guardado de Redux
	const tabla_state = useAppSelector((state: RootState) => state.control_calidad.tabla_cc_state);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>(tabla_state.globalFilter)
	// Para paginación del servidor, pageIndex local siempre es 0 (los datos ya vienen paginados)
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: tabla_state.pageSize,
	});

	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)

	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);

	const { verificarToken } = useAuth()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	
	

	

	const asisteDelete = async (id: number) => {
		const token_verificado = await verificarToken(token!)
	
		if (!token_verificado) throw new Error('Token no verificado')

		const response = await fetchWithTokenDelete(`api/control-calidad/recepcionmp/${id}/`, token_verificado)
		if (response.ok) {
			toast.success(`El control de calidad N° ${id} fue eliminado exitosamente`)
			// Refresh the data after deletion by calling onPageChange to reload current page
			if (onPageChange) {
				onPageChange(currentPage)
			}
		} else if (response.status === 400) {
			toast.error(`El control de calidad N° ${id} no pudo ser eliminado`)
		}
	}

	const columns = [
		columnHelper.accessor('guia_recepcion', {
			id: 'numero_guia',
			cell: (info) => (
				<div className='font-bold text-center'>{`${info.row.original.guia_recepcion}`}</div>
			),
			header: 'N° Guia',
		}),
		columnHelper.accessor('numero_lote', {
			id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold text-center'>{`${info.row.original.numero_lote}`}</div>
			),
			header: 'N° Lote',
		}),
		columnHelper.accessor('productor', {
			cell: (info) => {
				return (
					<div className='font-bold'>{`${info.row.original.productor}`}</div>
				)
			},
			header: 'Productor ',
		}),
		columnHelper.accessor('estado_cc_label', {
			id: 'estado',
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.estado_cc_label}`}</div>
			),
			header: 'Estado',
		}),
		columnHelper.accessor('estado_aprobacion_cc_label', {
			id: 'estado_aprobacion',
			cell: (info) => (
				<div className='font-bold'>
					{ !info.row.original.control_rendimiento.some(lotes => lotes.cc_calibrespepaok === true) ?
						'En Espera de Registro y Calibracion de Muestras'
					: 
						info.row.original.estado_aprobacion_cc_label
					}
				</div>
			),
			header: 'Estado Aprobación Jefatura',
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

				const id = info.row.original.id;
				const [selectedId, setSelectedId] = useState<number>(0);
				const [deleteModalStatus, setDeleteModalStatus] = useState(false);
				const confirmDelete = (id: number) => {
					dispatch(asisteDelete(id));
					setDeleteModalStatus(false); 
				  };
				return (
					<div className='h-full w-full flex gap-2 flex-wrap justify-center'>
						{
							info.row.original.control_rendimiento.some(lotes => lotes.cc_calibrespepaok === true)
								? (
									<>
										<Button
											title='Lote Calibrado'
											variant='solid'
											color='violet'
											className='w-20 h-12 flex items-center hover:scale-105'
											>
												<DuoDoubleCheck style={{ fontSize: 25 }}/>
										</Button>
									</>
								)
								: null
						}


						<Link to={`/cdc/crmp/control-calidad/${info.row.original.id}`} state={{ pathname: '/control-calidad/' }}>
							<Button
								variant='solid'
								color='blue'
								className='w-20 h-12 text-white flex items-center justify-center hover:scale-105 '
								>
								<HeroEye style={{ fontSize: 25 }} />
							</Button>
						</Link>

						{hasGroup(['controlcalidad']) && (
													<>
														<Tooltip title='Eliminar'>
														<Button onClick={() => {
															setSelectedId(id);
															setDeleteModalStatus(true);
														}}
															variant="solid"
															color="red"
															colorIntensity="700"
															className={`hover:scale-105`}>
															<HeroXMark style={{ fontSize: 25 }} />
														</Button>
														</Tooltip>
														<DeleteConfirmationModal
															isOpen={deleteModalStatus}
															onClose={() => setDeleteModalStatus(false)}
															onConfirm={() => confirmDelete(selectedId)}
															message="¿Estás seguro de que deseas eliminar esta Guia?"
														/>
													</>
													)}
				</div>
				);
			},
			header: 'Acciones'
		}),
	];

	const table = useReactTable({
		data: data ? data : [],
		columns,
		state: {
			sorting,
			globalFilter,
			pagination,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		// Evitar que la tabla resetee la paginación cuando cambian los datos
		autoResetPageIndex: false,
	})

	// Para tablas con paginación del servidor, el estado se guarda en el componente padre (ListaControlCalidad)
	// Solo guardamos el filtro global cuando cambia
	useEffect(() => {
		if (globalFilter !== tabla_state.globalFilter) {
			dispatch(GUARDAR_ESTADO_TABLA_CC({
				pageIndex: tabla_state.pageIndex,
				pageSize: tabla_state.pageSize,
				globalFilter: globalFilter,
			}));
		}
	}, [globalFilter, dispatch]);


	const columnas: TableColumn[] = [
		{ id: 'numero_guia', className: 'w-24'},
		{ id: 'numero_lote', className: 'w-24'},
		{ id: 'estado', className: 'w-56'},
		{ id: 'estado_aprobacion', className: 'w-48'},
	]

	return (
		<PageWrapper name='Lista Control Calidad'>
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
							<CardTitle>Controles de Calidad</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{loadingPagination ? (
									<div className="flex items-center gap-1">
										<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
										Cargando...
									</div>
								) : (
									`${paginationMetadata?.total_count || table.getFilteredRowModel().rows.length} registros`
								)}
							</Badge>
						</CardHeaderChild>
						<CardHeaderChild>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-x-auto'>
						{loadingPagination ? (
							<div className="flex items-center justify-center py-8">
								<div className="flex items-center gap-2">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
									<span className="text-gray-600">Cargando controles...</span>
								</div>
							</div>
						) : (
							<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
						)}
					</CardBody>
					{paginationMetadata && onPageChange && (
						<div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-700">
									Mostrando {paginationMetadata.desde + 1} a {Math.min(paginationMetadata.hasta + 1, paginationMetadata.total_count)} de {paginationMetadata.total_count} registros
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => onPageChange(currentPage - 1)}
									isDisable={!paginationMetadata.has_previous}
								>
									Anterior
								</Button>
								<span className="text-sm text-gray-700">
									Página {currentPage + 1} de {Math.ceil(paginationMetadata.total_count / pageSize)}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onPageChange(currentPage + 1)}
									isDisable={!paginationMetadata.has_next}
								>
									Siguiente
								</Button>
							</div>
						</div>
					)}
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaControlCalidad;
