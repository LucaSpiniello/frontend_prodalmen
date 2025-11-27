import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';

import { 
	FaPlay,
	FaStop,
	FaPause,
	FaFilePdf,

} from "react-icons/fa";
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import Tooltip from '../../../components/ui/Tooltip';
import { HeroEye, HeroPlus } from '../../../components/icon/heroicons';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import Container from '../../../components/layouts/Container/Container';
import Badge from '../../../components/ui/Badge';
import ModalForm from '../../../components/ModalForm.modal';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../templates/common/TableParts.template';
import Button from '../../../components/ui/Button';
import { GUARDAR_PROGRAMA } from '../../../redux/slices/produccionSlice';
import { useAuth } from '../../../context/authContext';
import { fetchWithToken, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPut } from '../../../utils/peticiones.utils';
import { format } from '@formkit/tempo';
import { fetchProgramasDeSeleccion, fetchRendimientoSeleccion } from '../../../redux/slices/seleccionSlice';
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";
import { TbEqual } from "react-icons/tb";
import { TEmbalaje } from '../../../types/TypesEmbalaje.type';
import { fetchProgramasEmbalaje } from '../../../redux/slices/embalajeSlice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TProgramaPlantaHarina } from '../../../types/typesPlantaHarina';
import { actualizar_planta_harina, fetchProgramasPlantaHarina, GUARDAR_ESTADO_TABLA_PROGRAMAS_PHARINA } from '../../../redux/slices/plantaHarinaSlice';
import FormularioRegistroProgramaPlantaHarina from './Formularios/FormularioRegistroProgramaPlantaHarina';
import ModalConfirmacion from '../../../components/ModalConfirmacion';
import FormularioInformePHarina from './Formularios/Formulario PDF/FormularioInformePHarina';

import FormularioInformeKilosXOperario from './Formularios/Formulario PDF/FormularioInformeKilosXOperario';
import FormularioInformeOperariosResumido from './Formularios/Formulario PDF/FormularioInformeOperarioResumido';




const TablaProgramaPHarina = () => {
	// Obtener el estado guardado de Redux
	const tabla_state = useAppSelector((state: RootState) => state.planta_harina.tabla_programas_pharina_state);

	const { pathname } = useLocation()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>(tabla_state.globalFilter)
	const [pagination, setPagination] = useState({
		pageIndex: tabla_state.pageIndex,
		pageSize: tabla_state.pageSize,
	});
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const [openModal, setOpenModal] = useState<boolean>(false)
	const navigate = useNavigate()


	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

	const programas_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programas_planta_harina)

	useEffect(() => {
		dispatch(fetchProgramasPlantaHarina({ token, verificar_token: verificarToken }))
	}, [])


	const columnHelper = createColumnHelper<TProgramaPlantaHarina>();
	const columns = [
		columnHelper.accessor('id', {
			id: 'id',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('tipo_programa_label', {
			id: 'tipo_programa',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.tipo_programa_label}`}
				</div>
			),
			header: 'Tipo Programa',
		}),
		columnHelper.accessor('ubicacion_producto', {
			id: 'ubicacion_producto',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.ubicacion_producto}`}
				</div>
			),
			header: 'Ubicación',
		}),
		columnHelper.accessor('estado_programa_label', {
			id: 'estado',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.estado_programa_label}`}
				</div>
			),
			header: 'Estado Programa',
		}),
		columnHelper.display({
			id: 'acciones',
			cell: (info) => {
				const id = info.row.original.id;
				const row = info.row.original
				const estado = info.row.original.estado_programa

				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

						{
							estado === '0' && info.row.original.condicion_inicio || estado !== '2' && estado! <= '3' && info.row.original.bins_ingresados_length >= 1 && info.row.original.condicion_inicio
								? (
									<Button
										variant='solid'
										color='amber'
										colorIntensity='600'
										onClick={() => {dispatch(actualizar_planta_harina({ id, data: { estado_programa: '2'}, params: { perfil: perfil, estado: '2' } ,token, verificar_token: verificarToken  }))}}
										>
											<FaPlay style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									)
								: null
						}

						{
							estado === '2'
								? (
									<Button
										title='Pausar Programa Planta Harina'
										variant='solid'
										color='blue'
										colorIntensity='700'
										onClick={() => {dispatch(actualizar_planta_harina({ id, data: { estado_programa: '3'}, params: { perfil: perfil, estado: '3' } ,token, verificar_token: verificarToken  }))}}
										>
										<FaPause style={{ fontSize: 25, color: 'white' }}/>
									</Button>

									)
								: null
						}


						{
							estado != '4' && estado != '5'
								? (
									<Link to={`${`/ph/ph-prog/registro-programa-planta-harina/${id}`}`} state={{ pathname: `/programas-planta-harina/` }}>
										<Button
											title='Agregar Bins A Planta Harina'
											variant='solid'
											color='blue'
											colorIntensity='700'							
											>
												<HeroPlus style={{ fontSize: 25, color: 'white' }}/>
										</Button>
									</Link>
								) : null
						}

						<Link to={`${`/ph/ph-prog/${id}/`}`} state={{ pathname: '/programas-planta-harina' }}>
							<Button
								title='Detalle Programa Planta Harina'
								variant='solid'
								color='emerald'
								colorIntensity='700'							
								>
									<HeroEye style={{ fontSize: 25, color: 'white' }}/>
							</Button>
						</Link>
					

							{
								1==1
									? (
										<>
											<Button
												title='Documento Entrada'
												variant='solid'
												color='red'
												colorIntensity='800'
												onClick={() => navigate(`/ph/ph-prog/pdf-detalle-entrada-planta-harina/${id}`, { state: {pathname: '/programas-planta-harina'}})}
												>
													<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
											</Button>

											<Button
												title='Documento Salida'
												variant='solid'
												color='red'
												colorIntensity='800'
												onClick={() => navigate(`/ph/ph-prog/pdf-detalle-salida-planta-harina/${id}`, { state: {pathname: '/programas-planta-harina'}})}
												>
													<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
											</Button>

										</>
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
		data: programas_planta_harina,
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

	// Guardar el estado de la tabla en Redux cuando cambie
	useEffect(() => {
		dispatch(GUARDAR_ESTADO_TABLA_PROGRAMAS_PHARINA({
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize,
			globalFilter: globalFilter,
		}));
	}, [pagination.pageIndex, pagination.pageSize, globalFilter, dispatch]);

	const columnas: TableColumn[] = [
		{ id: 'id', className: 'w-40'},
		{ id: 'tipo_programa', className: 'md:w-40 lg:w-2/12'},
		{ id: 'ubicacion_producto', className: 'md:w-40 lg:w-auto'},
		
	]

	return (
		<PageWrapper name='Lista Programas Planta Harina'>
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

				{ (
							<SubheaderRight>
								<ModalForm
									title='Registro Programa Planta Harina'
									variant='solid'
									open={openModal}
									setOpen={setOpenModal}
									textButton='Registrar Programa Planta Harina'
									size={800}
									>
										<FormularioRegistroProgramaPlantaHarina />
								</ModalForm>
							</SubheaderRight>
							)				}
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Programas Planta Harina</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild className='lg:w-[70%] sm:w-full md:w-full'>
							 	<div className='flex gap-2 '>
									<ModalForm
										open={informePro}
										setOpen={setInformePro}
										title='Informe Programas'
										variant='solid'
										icon={
										<div className='flex items-center gap-1.5'>
												<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
											<span className='text-md font-semibold'>Generar Informe Programas</span>
										</div>
										}
										width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-auto text-white bg-red-700 hover:bg-red-600 hover:scale-105 border-none`}
									>
										<FormularioInformePHarina setOpen={setInformePro}/>
									</ModalForm>

									<ModalForm
										open={informeKgOp}
										setOpen={setInformeinformeKgOp}
										title='Informe de Kilos por Operario'
										variant='solid'
										icon={
										<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
											<span className='text-md font-semibold'>Generar Informe de Kilos por Operario</span>
										</div>
										}
										width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-0 text-white bg-red-700 hover:bg-red-600 hover:scale-105 border-none`}
										size={700}
									>
										<FormularioInformeKilosXOperario setOpen={setInformePro}/>
									</ModalForm>

									<ModalForm
										open={informeResOp}
										setOpen={setInformeinformeResOp}
										title='Informe de Operarios Resumido'
										variant='solid'
										icon={
										<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20}}/>
											<span className='text-md font-semibold'>Generar Informe de Operarios Resumido</span>
										</div>
										}
										width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-0 text-white bg-red-700 hover:bg-red-600 hover:scale-105 border-none`}
										size={500}
										>
											<FormularioInformeOperariosResumido setOpen={setInformePro}/>
									</ModalForm>
								</div>

						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaProgramaPHarina;

