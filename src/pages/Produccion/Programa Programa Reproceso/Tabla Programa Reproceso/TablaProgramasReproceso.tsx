import React, { Dispatch, FC, SetStateAction, useState } from 'react';
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
	FaUserPlus,
	FaFileContract,
	FaPlay,
	FaStop,
	FaPause,
	FaFilePdf,

} from "react-icons/fa";
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import Tooltip from '../../../../components/ui/Tooltip';
import { HeroEye, HeroPlus } from '../../../../components/icon/heroicons';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import Container from '../../../../components/layouts/Container/Container';
import Badge from '../../../../components/ui/Badge';
import ModalForm from '../../../../components/ModalForm.modal';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../templates/common/TableParts.template';
import Button from '../../../../components/ui/Button';
import { GUARDAR_PROGRAMA } from '../../../../redux/slices/produccionSlice';
import { useAuth } from '../../../../context/authContext';
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPost, fetchWithTokenPut } from '../../../../utils/peticiones.utils';
import { TSeleccion } from '../../../../types/TypesSeleccion.type';
import { format } from '@formkit/tempo';
import { fetchProgramasDeSeleccion } from '../../../../redux/slices/seleccionSlice';
import { TReprocesoProduccion } from '../../../../types/TypesReproceso.types';
import { actualizar_programa_reproceso, fetchProgramasReprocesos, registro_programa_reproceso } from '../../../../redux/slices/reprocesoSlice';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import FormularioInformeReproceso from '../Formularios/FormularioInformeReproceso';
import FormularioResumenOperarioReproceso from '../Formularios/FormularioInformeResumenOperarioReproceso';
import { tieneTresOMasMenoresQueValor } from '../../../../utils/contarMenos'


interface IReprocesoProps {
	data: TReprocesoProduccion[] | []
}


const estados = [
	{value: '0',label: 'Pausa' },
	{value: '2',label: 'En Curso'},
	{value: '5',label: 'Terminado'}
]

const columnHelper = createColumnHelper<TReprocesoProduccion>();



const TablaProgramasReproceso: FC<IReprocesoProps> = ({ data }) => {
	const navigate = useNavigate()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [edicionModalStatus, setEdicionModalStatus] = useState<boolean>(false);
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const { pathname } = useLocation()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const [disabled, setDisabled] = useState<boolean>()

	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)


	const actualizarEstadoProduccion = async (id: number, estado: string) => {

		try {
			const token_verificado = await verificarToken(token!)

			if (!token_verificado){
					throw new Error('Token no valido')
				}

			const response_estado = await fetchWithTokenPut(`api/reproceso/${id}/`, { id, estado: estado, registrado_por: perfil?.id }, token_verificado)
			if (response_estado.ok){
				const data: TReprocesoProduccion = await response_estado.json()
				
				toast.success(`El programa esta en ${data.estado_label}`)
				//@ts-ignore
				dispatch(fetchProgramasReprocesos({ token, verificar_token: verificarToken }))
			}
		} catch (error) {
			toast.error('Error en la peticion')
		}
	}


	const registroProgramaSeleccion = async () => {

		try {
			 const token_verificado = await verificarToken(token!)
			
			 if (!token_verificado){
					throw new Error('Token no verificado')
			 }

			 const response = await fetchWithTokenPost(`api/reproceso/`, { 
				registrado_por: perfil?.id,
				estado_programa: '0'
			}, token_verificado)
			 if (response.ok) {
				const data: TReprocesoProduccion = await response.json()
				toast.success(`El programa reproceso fue creado exitosamente`)
				navigate(`/pro/reproceso/registro-programa/${data.id}`, { state: { pathname: '/reproceso/' }})
			} else {
				toast.error('No se logro crear el programa de reproceso')
			}
		} catch (error) {
			throw new Error('Tuvimos problemas')
		}
	}


	const columns = [
		columnHelper.display({
			id: 'id', 
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_programa}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.display({
			id: 'bins', 
			cell: (info) => {
				return (
					<div className='font-bold text-center'>
						{`${info.row.original.bines_length}`}
					</div>
				)
			},
			header: 'Bins',
		}),
		columnHelper.display({
			id: 'bins_ingresados',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className='text-center'>{info.row.original.bines_por_procesar}</p>
					</div>
				)
			},
			header: 'Envases en Proc.',
		}),
		columnHelper.display({
			id: 'bins_procesados', 
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className='text-center'>{info.row.original.bines_procesados}</p>
					</div>
				)
			},
			header: 'Envases en Proc.',
		}),
		columnHelper.display({
			id: 'estado', 
			cell: (info) => {
				const estado = info.row.original.estado_label
				return  (
					<div className='font-bold'>
						<p className='text-center'>{estado}</p>
					</div>
	
				)
			},
			header: 'Estado',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id
				const estado = info.row.original.estado

				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>
							{
								(estado === '0' || estado !== '2' && estado <= '3')  && info.row.original.bines_length >= 1
								? (
										<Button
											title='Iniciar Reproceso'
											variant='solid'
											color='amber'
											colorIntensity='600'
											className='hover:scale-105'
											onClick={() => { 
												dispatch(
													actualizar_programa_reproceso({
														id: info.row.original.id, 
														params: { 
															estado: '2',
															tipo_boton: 'inicio',
															perfil: perfil,
															fecha_registrada: info.row.original.fecha_inicio_reproceso
															},
														token, 
														verificar_token: verificarToken 
														})
												)}}
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
										title='Pausar Reproceso'
										variant='solid'
										color='blue'
										colorIntensity='700'
										className='hover:scale-105'
										onClick={() => dispatch(
											actualizar_programa_reproceso({
												id: info.row.original.id, 
												params: { 
													estado: '1',
													perfil: perfil,
													},
												token, 
												verificar_token: verificarToken 
												})
										)}
										>
											<FaPause style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									)
								: null
						}

						{
							info.row.original.condicion_cierre && ['1'].includes(estado) 
								? (
									<Button
										title='Terminar Reproceso'
										variant='solid'
										color='red'
										colorIntensity='700'
										className='hover:scale-105'
										onClick={() => {
											dispatch(
												actualizar_programa_reproceso({
													id: info.row.original.id, 
													params: { 
														estado: '3',
														perfil: perfil,
														},
													token, 
													verificar_token: verificarToken 
													})
											)
										}}
										>
										<FaStop style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									)
								: null
						}

						{
							estado <= '3' && (
								<Link to={`${`/pro/reproceso/registro-programa/${id}/`}`} state={{ pathname: '/reproceso/' }}>
									<Button
										title='Agregar Bins al Programa Reproceso'
										variant='solid'
										color='amber'
										className='hover:scale-105'
										>
											<HeroPlus style={{ fontSize: 25, color: 'white' }}/>
									</Button>
								</Link>

							)
						}
							
						<Link to={`${`/pro/reproceso/programa/${id}/`}`} state={{ pathname: '/reproceso/' }}>
							<Button
								title='Detalle Reproceso'
								variant='solid'
								color='emerald'
								className='hover:scale-105'
								>
									<HeroEye style={{ fontSize: 25, color: 'white' }}/>
							</Button>
						</Link>
					

						{
							info.row.original.bines_length
								? (
									<>
											<Link to={`/pro/reproceso/pdf-documento-entrada/${id}`} state={{ pathname: '/reproceso' }}>
												<Button
													variant='solid'
													title='Documento Entrada'
													color='red'
													colorIntensity='800'
													className='hover:scale-105'
													>
														<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
												</Button>
											</Link>

											<Link to={`/pro/reproceso/pdf-documento-salida/${id}`} state={{ pathname: '/reproceso' }}>
											<Button
													variant='solid'
													title='Documento Salida'
													color='red'
													colorIntensity='800'
													className='hover:scale-105'
													>
														<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
												</Button>
											</Link>
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

	const columnas: TableColumn[] = [
    { id: 'id', header: '', className: 'w-24 lg:w-32 text-center' },
    { id: 'bins', header: '', className: 'lg:w-48 text-center' },
    { id: 'registrado_por', header: '', className: 'lg:w-48 text-center' },
		{ id: 'fecha_creacion', header: '',className: 'lg:w-48 text-center'},
		{ id: 'rendimientos', header: '',className: 'w-56 md:w-48 lg:w-auto'},
  ]



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
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
	});

	return (
		<PageWrapper name='Lista Programas Selección'>
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
					data.length <= 1 || tieneTresOMasMenoresQueValor(data.map(da => da.estado), 3)
					 ? (
						<SubheaderRight>
										<Button
											variant='solid'
											isDisable={disabled}
											onClick={() => {setDisabled(true); dispatch(registro_programa_reproceso({ token, data: { 
												registrado_por: perfil?.id,
												estado_programa: '0'
											 }, params: { navigate: navigate }, verificar_token: verificarToken}))}}
											className='w-full rounded-md h-12 bg-blue-700 flex items-center justify-center p-2 hover:scale-105 px-2 border-none'>
											<span className='text-lg text-white'>Registrar Programa de Reproceso</span>
										</Button>
								</SubheaderRight>
					 )
					 : null
				}
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Programas Reproceso</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild className='lg:w-[50%] sm:w-full md:w-full'>
							<div className='w-full flex justify-between gap-3'>
								<ModalForm
									open={informePro}
									setOpen={setInformePro}
									title='Informe de Reproceso'
									variant='solid'
									color='red'
									colorIntensity='700'
									icon={
									<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
										<span className='text-md font-semibold'>Generar Informe de Reproceso</span>
									</div>
									}
									width={`w-full hover:scale-105`}
									size={400}
								>
									<FormularioInformeReproceso setOpen={setInformePro} />
								</ModalForm>

								<ModalForm
									open={informeKgOp}
									setOpen={setInformeinformeKgOp}
									title='Informe de Kilos por Operario'
									variant='solid'
									color='red'
									colorIntensity='700'
									icon={
									<div className='flex items-center gap-1.5'>
										<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
										<span className='text-md font-semibold'>Generar Informe de Kilos por Operario</span>
									</div>
									}
									width={`w-full hover:scale-105`}
									size={400}
								>
									<FormularioResumenOperarioReproceso setOpen={setInformeinformeKgOp}/>
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

export default TablaProgramasReproceso;

