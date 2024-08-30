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
import TableTemplate, { TableCardFooterTemplate }  from '../../../templates/common/TableParts.template';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/authContext';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TProcesoPlantaHarina } from '../../../types/typesPlantaHarina';
import FormularioRegistroProgramaPlantaHarina from './Formularios/FormularioRegistroProcesoPlantaHarina';
import { actualizar_proceso_planta_harina, fetchProcesosPlantaHarina } from '../../../redux/slices/procesoPlantaHarina';
import FormularioRegistroProcesoPlantaHarina from './Formularios/FormularioRegistroProcesoPlantaHarina';






const TablaProcesoPlantaHarina = () => {
	const { pathname } = useLocation()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const [openModal, setOpenModal] = useState<boolean>(false)
	const navigate = useNavigate()


	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

	const procesos_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.procesos_planta_harina)

	useEffect(() => {
		dispatch(fetchProcesosPlantaHarina({ token, verificar_token: verificarToken }))
	}, [])


	const columnHelper = createColumnHelper<TProcesoPlantaHarina>();
	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('tipo_proceso_label', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.tipo_proceso_label}`}
				</div>
			),
			header: 'Tipo proceso',
		}),
		columnHelper.accessor('estado_proceso_label', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.estado_proceso_label}`}
				</div>
			),
			header: 'Estado proceso',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const row = info.row.original
				const estado = info.row.original.estado_proceso

				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>
						{
							estado === '0' && info.row.original.condicion_inicio || estado !== '2' && estado! <= '3' && info.row.original.bins_ingresados_length >= 1 && info.row.original.condicion_inicio
								? (
									<Button
										variant='solid'
										color='amber'
										colorIntensity='600'
										onClick={() => 
											dispatch(
												actualizar_proceso_planta_harina({
													 	id, 
														params: { 
															estado: '2',
															tipo_boton: 'inicio',
															fecha_registrada: info.row.original?.fecha_inicio_programa,
															perfil: perfil, 
														} ,
														token, 
														verificar_token: verificarToken  
													}))}
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
										onClick={() => 
											dispatch(
												actualizar_proceso_planta_harina({ 
													id, 
													params: { 
														estado: '3',
														detail: false,
														perfil: perfil, 
													},
													token, 
													verificar_token: verificarToken  
												}))}
										>
										<FaPause style={{ fontSize: 25, color: 'white' }}/>
									</Button>

									)
								: null
						}
					
						{
							estado != '4' && estado != '5'
								? (
									<Link to={`${`/ph/ph-proc/registro-proceso-planta-harina/${id}`}`} state={{ pathname: `/procesos-planta-harina/` }}>
										<Button
											title='Agregar Bins A Planta Harina'
											variant='solid'
											color='blue'
											colorIntensity='700'							
											>
												<HeroPlus style={{ fontSize: 25, color: 'white' }}/>
										</Button>
									</Link>
								)
								: null
						}

						<Link to={`${`/ph/ph-proc/${id}/`}`} state={{ pathname: '/procesos-planta-harina' }}>
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
								info.row.original.condicion_termino
									? (
										<>
											<Button
												title='Documento Entrada'
												variant='solid'
												color='red'
												colorIntensity='800'
												onClick={() => navigate(`/ph/ph-proc/pdf-detalle-entrada-proceso-planta-harina/${id}`, { state: { pathname: '/procesos-planta-harina' }})}
												>
													<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
											</Button>

											<Button
												title='Documento Salida'
												variant='solid'
												color='red'
												colorIntensity='800'
												onClick={() => navigate(`/ph/ph-proc/pdf-detalle-salida-proceso-planta-harina/${id}`, { state: { pathname: '/procesos-planta-harina' }})}
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
		data: procesos_planta_harina,
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
		<PageWrapper name='Lista Procesos Planta Harina'>
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

				{
					procesos_planta_harina?.length <= 1 || procesos_planta_harina?.slice(2).every((bin) => bin.estado_proceso === '5')
						? (
							<SubheaderRight>
								<ModalForm
									title='Registro Proceso Planta Harina'
									variant='solid'
									open={openModal}
									setOpen={setOpenModal}
									textButton='Registro Proceso Planta Harina'
									size={800}
									>
										<FormularioRegistroProcesoPlantaHarina />
								</ModalForm>
							</SubheaderRight>
							)	
						: null 
				}
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Procesos Planta Harina</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild className='lg:w-[70%] sm:w-full md:w-full'>
							 	{/* <div className='flex gap-2 '>
									<ModalForm
										open={informePro}
										setOpen={setInformePro}
										title='Informe de Selección'
										variant='solid'
										icon={
										<div className='flex items-center gap-1.5'>
												<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
											<span className='text-md font-semibold'>Generar Informe de Selección</span>
										</div>
										}
										width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-auto text-white bg-red-700 hover:bg-red-600 hover:scale-105 border-none`}
									>
										hola
										<FormularioInformeSeleccion setOpen={setInformePro}/>
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
										hola
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
											hola
											<FormularioInformeOperariosResumido setOpen={setInformePro}/>
									</ModalForm>
								</div> */}

								
							{/*
								

							</div> */}
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

export default TablaProcesoPlantaHarina;

