import React, { FC, useEffect, useState } from 'react';
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
import useDarkMode from '../../../../hooks/useDarkMode';
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
import { fetchWithToken, fetchWithTokenPost, fetchWithTokenPut } from '../../../../utils/peticiones.utils';
import { TSeleccion } from '../../../../types/TypesSeleccion.type';
import { format } from '@formkit/tempo';
import { fetchProgramasDeSeleccion, fetchProgramasDeSeleccionPaginados, fetchRendimientoSeleccion } from '../../../../redux/slices/seleccionSlice';
import FormularioInformeSeleccion from '../Formularios/Formulario PDF\'s/FormularioInformeSeleccion';
import FormularioInformeKilosXOperario from '../Formularios/Formulario PDF\'s/FormularioInformeKilosXOperario';
import FormularioInformeOperariosResumido from '../Formularios/Formulario PDF\'s/FormularioInformeOperarioResumido';

import { HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";
import { TbEqual } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { fetchProgramasProduccion } from '../../../../redux/slices/produccionSlice';


interface IProduccionProps {
	data: TSeleccion[] | []
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




const TablaProgramasSeleccion: FC<IProduccionProps> = ({ 
	data, 
	paginationMetadata, 
	currentPage = 0, 
	onPageChange, 
	pageSize = 5,
	loadingPagination = false
}) => {
	const navigate = useNavigate()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const programas_produccion = useAppSelector((state: RootState) => state.programa_produccion.programas_produccion)
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
	const [disabled, setDisabled] = useState<boolean>(false)

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProgramaProduccion, setSelectedProgramaProduccion] = useState<string | null>(null);
	const [disabledModal, setDisabledModal] = useState(false);

	const[programaProduccion, setProgramaProduccion] = useState<string | null>(null)


	const actualizarEstadoProduccion = async (id: number, estado: string) => {

		try {
			const token_verificado = await verificarToken(token!)

			if (!token_verificado){
					throw new Error('Token no valido')
				}

			const response_estado = await fetchWithTokenPut(`api/seleccion/${id}/`, { id, estado_programa: estado, registrado_por: perfil?.id }, token_verificado)
			if (response_estado.ok){
				const data: TSeleccion = await response_estado.json()
				toast.success(`El programa esta en ${data.estado_programa_label}`)
				// Refresh current page data
				dispatch(fetchProgramasDeSeleccionPaginados({ 
					token, 
					verificar_token: verificarToken,
					params: { desde: currentPage * pageSize, hasta: (currentPage * pageSize) + pageSize - 1 }
				}))
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
			const response = await fetchWithTokenPost(`api/seleccion/`, { 
				registrado_por: perfil?.id,
				estado_programa: '1',
				produccion: selectedProgramaProduccion
			}, token_verificado)
			if (response.ok) {
				const data: TSeleccion = await response.json()
				toast.success(`El programa fue creado exitosamente`)
				navigate(`/pro/seleccion/programa-seleccion/registro-programa/${data.id}`, { state: { pathname: '/programa-seleccion' }})
			} else {
				setDisabled(false)
			}
		} catch (error) {
			setDisabled(false)
			throw new Error('Tuvimos problemas')
		}
	}

	const columnHelper = createColumnHelper<TSeleccion>();

	const columns = [
		columnHelper.accessor('id', {
			id: 'numero_programa',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('estado_programa', {
			id: 'estado',
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.estado_programa_label}`}
				</div>
			),
			header: 'Estado Programa',
		}),
		columnHelper.accessor('produccion', {
			id: 'produccion',
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.produccion}`}
				</div>
			),
			header: 'N° Produccion',
		}),
		columnHelper.accessor('comercializador', {
			id: 'comercializador',
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.comercializador}`}
				</div>
			),
			header: 'Comercializador',
		}),
		columnHelper.display({
			id: 'bins_sin_procesar',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.kilos_porcentaje.bins_sin_procesar} % Sin Procesar`}
				</div>
			),
			header: 'Sin Procesar',
		}),
		columnHelper.display({
			id: 'bins_procesados',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.kilos_porcentaje.bins_procesados} % Procesados`}
				</div>
			),
			header: 'Procesado',
		}),
		columnHelper.accessor('registrado_por', {
			id: 'registrado_por',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{info.row.original.registrado_por_label}</p>
					</div>
				)
			},
			header: 'Registrado Por',
		}),
		columnHelper.accessor('fecha_creacion', {
			id: 'fecha_creacion',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{format(info.row.original.fecha_creacion, { date: 'short', time: 'short' } , 'es' )}</p>
					</div>
				)
			},	
			header: 'Envases en Proc.',
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
							estado !== '2' && estado <= '3' && info.row.original.pepa_para_seleccion_length >= 1
								? (
									<Button
										title='Iniciar Producción'
										variant='solid'
										color='amber'
										colorIntensity='600'
										onClick={() => actualizarEstadoProduccion(id, '2')}
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
										title='Pausar Selección'
										variant='solid'
										color='blue'
										colorIntensity='600'
										onClick={() => actualizarEstadoProduccion(id, '3')}
										>
										<FaPause style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									
									)
								: null
						}

						{/* {
							info.row.original.condicion_termino && !['2', '4', '5'].includes(estado)
								? (
									<Button
										title='Terminar Selección'
										variant='solid'
										color='red'
										colorIntensity='600'
										onClick={() => actualizarEstadoProduccion(id, '4')}
										>
										<FaStop style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									)
								: null
						} */}
						
						{
							info.row.original.estado_programa === '1' || info.row.original.estado_programa === '2' ?
								<Button
									title='Agregar Bins a Selección'
									variant='solid'
									color='yellow'
									colorIntensity='500'
									onClick={() => navigate(`${`/pro/seleccion/programa-seleccion/registro-programa/${id}`}`, { state: { pathname: '/programa-seleccion' }})}
									className=' hover:scale-105'>
									<HeroPlus style={{ fontSize: 25, color: 'white' }}/>
								</Button>
							: null
						}


						<Button
							title='Detalle Selección'
							variant='solid'
							color='teal'
							colorIntensity='600'
							className='hover:scale-105'
							onClick={() => navigate(`${`/pro/seleccion/programa-seleccion/programa/${id}/`}`, { state: { pathname: '/programa-seleccion' }})}
							>
							<HeroEye style={{ fontSize: 25, color: 'white' }}/>
						</Button>
					

						{
							info.row.original.pepa_para_seleccion_length > 0
							? (
								<>
									<Button
										title='Documento entrada Programa'
										variant='solid'
										color='red'
										colorIntensity='800'
										className='hover:scale-105'
										onClick={() => navigate(`/pro/seleccion/programa-seleccion/pdf-detalle-entrada-seleccion/${id}`, { state: { pathname: '/programa-seleccion' }})}
										>
										<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
									</Button>

									<Button
										title='Documento de salida Programa'
										variant='solid'
										color='red'
										colorIntensity='800'
										className='hover:scale-105'
										onClick={() => navigate(`/pro/seleccion/programa-seleccion/pdf-detalle-salida-seleccion/${id}`, { state: { pathname: '/programa-seleccion' }})}
										>
										<FaFilePdf style={{ fontSize: 25, color: 'white'}}/>
									</Button>
								</>
							) : null
						}
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
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		// Disable built-in pagination since we're using server-side pagination
		// getPaginationRowModel: getPaginationRowModel(),
		// initialState: {
		// 	pagination: { pageSize: 5 },
		// },
	})

	const columnas: TableColumn[] = [
		{id: 'numero_programa', className: 'w-32'},
		{id: 'bins_sin_procesar', className: 'w-auto text-start'},
		{id: 'bins_procesados', className: 'w-auto text-start'},
		{id: 'registrado_por', className: 'w-auto lg:w-40 text-start'},
		{id: 'rendimientos', className: 'w-52'},
		{id: 'acciones', className: 'lg:w-96 '},
		
	]

	

	useEffect(() => {
		if (programas_produccion.length === 0){
			dispatch(fetchProgramasProduccion({ token, verificar_token: verificarToken }))
		}
	})

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

						<ModalForm
						open={isModalOpen}
						setOpen={setIsModalOpen}
						title="Selecciona el programa de producción"
						variant="solid"
						color="blue"
						colorIntensity="700"
						icon={<span className="text-lg text-white">Registrar Programa de Selección</span>}
						size={400}
						width="w-1/4"
						>
						<div className="p-4">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="programa">
							Programa de Producción
							</label>
							<select
							value={selectedProgramaProduccion || ''}
							onChange={(e) => setSelectedProgramaProduccion(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
							>
							<option value="">Selecciona un programa</option>
							{programas_produccion
								.map((programa) => (
								<option key={programa.id} value={programa.id} style={{ color: programa.hay_bins_en_g2 ? 'green' : 'red' }}>
									{`Programa N°${programa.id} - Lotes: ${programa.lotes_length} - Fecha Término: ${programa.fecha_termino_proceso}`}
								</option>
								))}
							</select>

							<div className="flex justify-end mt-4">
							<Button
								variant="solid"
								color="green"
								onClick={() => {
								if (selectedProgramaProduccion) {
									setIsModalOpen(false); 
									setDisabledModal(true);
									setProgramaProduccion(selectedProgramaProduccion)
									registroProgramaSeleccion(); 
								} else {
									toast.error("Por favor selecciona un programa de producción");
								}
								}}
							>
								Confirmar
							</Button>

							<Button
								variant="solid"
								color="red"
								onClick={() => setIsModalOpen(false)}
								className="ml-2"
							>
								Cancelar
							</Button>
							</div>
						</div>
						</ModalForm>


			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Programas Selección</CardTitle>
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

						<CardHeaderChild className='lg:w-[70%] sm:w-full md:w-full'>
							 	<div className='w-full flex gap-2'>
									<ModalForm
										open={informePro}
										setOpen={setInformePro}
										title='Informe de Selección'
										variant='solid'
										color='red'
										colorIntensity='800'
										icon={
										<div className='flex items-center gap-1.5'>
												<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
											<span className='text-md font-semibold'>Generar Informe de Selección</span>
										</div>
										}
										size={400}
										width={`w-10/12 hover:scale-105`}
									>
										<FormularioInformeSeleccion setOpen={setInformePro}/>
									</ModalForm>

									<ModalForm
										open={informeKgOp}
										setOpen={setInformeinformeKgOp}
										title='Informe de Kilos por Operario'
										variant='solid'
										color='red'
										colorIntensity='800'
										icon={
										<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
											<span className='text-md font-semibold'>Generar Informe de Kilos por Operario</span>
										</div>
										}
										width={`w-10/12 hover:scale-105`}
										size={400}
									>
										<FormularioInformeKilosXOperario setOpen={setInformeinformeKgOp}/>
									</ModalForm>

									<ModalForm
										open={informeResOp}
										setOpen={setInformeinformeResOp}
										title='Informe de Operarios Resumido'
										variant='solid'
										color='red'
										colorIntensity='800'
										icon={
										<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20}}/>
											<span className='text-md font-semibold'>Generar Informe de Operarios Resumido</span>
										</div>
										}
										width={`w-10/12 hover:scale-105`}
										size={400}
										>
											<FormularioInformeOperariosResumido setOpen={setInformePro}/>
									</ModalForm>
								</div>

						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-x-auto'>
						{loadingPagination ? (
							<div className="flex items-center justify-center py-8">
								<div className="flex items-center gap-2">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
									<span className="text-gray-600">Cargando programas...</span>
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
									isDisable={!paginationMetadata.has_previous || loadingPagination}
								>
									{loadingPagination ? (
										<div className="flex items-center gap-1">
											<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
											Cargando...
										</div>
									) : (
										'Anterior'
									)}
								</Button>
								<span className="text-sm text-gray-700">
									Página {currentPage + 1} de {Math.ceil(paginationMetadata.total_count / pageSize)}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onPageChange(currentPage + 1)}
									isDisable={!paginationMetadata.has_next || loadingPagination}
								>
									{loadingPagination ? (
										<div className="flex items-center gap-1">
											<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
											Cargando...
										</div>
									) : (
										'Siguiente'
									)}
								</Button>
							</div>
						</div>
					)}
				</Card>
			</Container>
		</PageWrapper>
		
	);
};

export default TablaProgramasSeleccion;

