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
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import useDarkMode from '../../../../hooks/useDarkMode';
import { HeroEye } from '../../../../components/icon/heroicons';
import { FaFilePdf } from "react-icons/fa6";
import { RiErrorWarningFill } from "react-icons/ri";

import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { ImSpinner2  } from "react-icons/im";
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { TControlCalidad } from '../../../../types/TypesControlCalidad.type';
import Tooltip from '../../../../components/ui/Tooltip';
import { useAuth } from '../../../../context/authContext';
import { fetchWithTokenPatch } from '../../../../utils/peticiones.utils';
import { fetchControlesDeCalidadPorComercializador, fetchControlesDeCalidad, fetchControlesDeCalidadPaginados } from '../../../../redux/slices/controlcalidadSlice';
import { fetchWithToken } from '../../../../utils/peticiones.utils';
import { BiCheckDouble } from 'react-icons/bi';
import toast from 'react-hot-toast';
import ModalConfirmacion from '../../../../components/ModalConfirmacion';
import ModalForm from '../../../../components/ModalForm.modal';
import Button from '../../../../components/ui/Button';
import { TbFidgetSpinner } from 'react-icons/tb';
import { ThunkDispatch } from "@reduxjs/toolkit"
import { Provider, useDispatch } from "react-redux"
import store from '../../../../redux/store';
import GeneratePdfAndSendMail from '../PDFEnvioProductores';
import { FaFileExcel } from "react-icons/fa6";
import * as XLSX from 'xlsx'

// Loading Modal Component
const LoadingModal: FC<{ isOpen: boolean }> = ({ isOpen }) => {
	if (!isOpen) return null;
	
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
					Exportando archivo Excel...
				</div>
				<div className="text-sm text-gray-500 dark:text-gray-400">
					Obteniendo datos de controles de calidad
				</div>
			</div>
		</div>
	);
};

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


const TablaControlRendimiento: FC<IControlProps> = ({ 
	data, 
	paginationMetadata, 
	currentPage = 0, 
	onPageChange, 
	pageSize = 10,
	loadingPagination = false
}) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [isExporting, setIsExporting] = useState<boolean>(false)
	const navigate = useNavigate()

	const { isDarkTheme } = useDarkMode()
	const { pathname } = useLocation()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);
	const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)

	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()
	
	// Helper function to convert numbers to string with comma as decimal separator
	const convertNumberToCommaString = (value: any): any => {
		if (value !== null && value !== undefined && typeof value === 'number') {
			return value.toString().replace('.', ',');
		}
		return value;
	};

	const exportToExcel = async () => {
		setIsExporting(true)
		try {
			// Para la exportación, necesitamos obtener todos los datos
			const token_verificado = await verificarToken(token!)
			
			if (!token_verificado) throw new Error('Token no verificado')
			
			let allData: TControlCalidad[] = []
			
			if (comercializador == 'Pacific Nut'){
				const response = await fetchWithToken(`api/control-calidad/recepcionmp/get_by_comercializador/?comercializador=${comercializador}`, token_verificado)
				if (response.ok) {
					allData = await response.json()
				}
			} else {
				const response = await fetchWithToken(`api/control-calidad/recepcionmp/`, token_verificado)
				if (response.ok) {
					allData = await response.json()
				}
			}
			
			if (allData.length === 0) {
				toast.error('No hay datos para exportar')
				setIsExporting(false)
				return
			}
		// Campos cuantitativos que queremos incluir del control_rendimiento
		const quantitativeFields = [
			'peso_muestra',
			'basura',
			'pelon',
			'cascara',
			'pepa_huerto',
			'pepa',
			'ciega',
			'peso_muestra_calibre',
			'muestra_variedad',
			'daño_insecto',
			'hongo',
			'doble',
			'fuera_color',
			'vana_deshidratada',
			'punto_goma',
			'goma',
		];

		const calibreFields = [
			'pre_calibre',
			'calibre_18_20',
			'calibre_20_22',
			'calibre_23_25',
			'calibre_25_27',
			'calibre_27_30',
			'calibre_30_32',
			'calibre_32_34',
			'calibre_34_36',
			'calibre_36_40',
			'calibre_40_mas',
		];
	
		// Campos que necesitan cálculo de porcentaje (todos excepto peso_muestra)
		const fieldsForPercentage = quantitativeFields.filter(field => field !== 'peso_muestra');
	
		const filteredInformation = allData.map((item) => {
			// Información básica del lote
			const baseInfo: Record<string, any> = {
				"N° Lote": item.numero_lote,
				"N° Guia": item.guia_recepcion,
				"Productor": item.productor,
				"Variedad": item.variedad,
				"Kilos Totales": convertNumberToCommaString(item.kilos_totales_recepcion),
				"Humedad": convertNumberToCommaString(item.humedad),
				"Presencia Insectos": item.presencia_insectos_selected
			};
	
			// Agregar datos de cada muestra
			if (item.control_rendimiento && item.control_rendimiento.length > 0) {
				const samplesData: Record<string, any> = {};
				let calibreSampleFound = false;
				
				item.control_rendimiento.forEach((sample: any, index: number) => {
					const sampleNumber = index + 1;
					const prefix = `_muestra_${sampleNumber}`;
					
					// Obtener el peso_muestra para esta muestra (para calcular porcentajes)
					let pesoMuestra = 0;
					if (sample.hasOwnProperty('peso_muestra')) {
						pesoMuestra = sample.peso_muestra;
						samplesData['peso_muestra' + prefix] = pesoMuestra;
					} else if (sample.cc_rendimiento && sample.cc_rendimiento.hasOwnProperty('peso_muestra')) {
						pesoMuestra = sample.cc_rendimiento.peso_muestra;
						samplesData['peso_muestra' + prefix] = pesoMuestra;
					}
					
					// Agregar campos del nivel superior de la muestra
					quantitativeFields.forEach(field => {
						if (sample.hasOwnProperty(field)) {
							// Agregar el valor original en kilos (convertir puntos a comas)
							samplesData[field + prefix] = convertNumberToCommaString(sample[field]);
							
							// Agregar el porcentaje para los campos que lo requieren
							if (fieldsForPercentage.includes(field) && pesoMuestra > 0) {
								const percentage = (sample[field] / pesoMuestra) * 100;
								samplesData[field + '_porcentaje' + prefix] = percentage.toFixed(2).replace('.', ',') + '%';
							}
						}
					});
					
					// Agregar campos del cc_rendimiento (si existe)
					if (sample.cc_rendimiento) {
						quantitativeFields.forEach(field => {
							if (sample.cc_rendimiento.hasOwnProperty(field)) {
								// Agregar el valor original en kilos (convertir puntos a comas)
								samplesData[field + prefix] = convertNumberToCommaString(sample.cc_rendimiento[field]);
								
								// Agregar el porcentaje para los campos que lo requieren
								if (fieldsForPercentage.includes(field) && pesoMuestra > 0) {
									const percentage = (sample.cc_rendimiento[field] / pesoMuestra) * 100;
									samplesData[field + '_porcentaje' + prefix] = percentage.toFixed(2).replace('.', ',') + '%';
								}
							}
						});

						// Lógica para calibres
						if (sample.cc_calibrespepaok && !calibreSampleFound) {
							calibreSampleFound = true;
							const pesoMuestraCalibre = sample.cc_rendimiento.peso_muestra_calibre || 0;
							const desviacion = sample.cc_rendimiento.desviacion || 0;
							const divisor = pesoMuestraCalibre - desviacion;

							calibreFields.forEach(field => {
								if (sample.cc_rendimiento.hasOwnProperty(field)) {
									// Nombre de columna consolidado
									const consolidatedFieldName = field.replace('calibre_', 'Calibre_');
									samplesData[consolidatedFieldName] = convertNumberToCommaString(sample.cc_rendimiento[field]);

									// Cálculo de porcentaje de calibre
									if (divisor > 0) {
										const percentage = (sample.cc_rendimiento[field] / divisor) * 100;
										samplesData[consolidatedFieldName + '_porcentaje'] = percentage.toFixed(2).replace('.', ',') + '%';
									}
								}
							});
						}
					}
				});
	
				return { ...baseInfo, ...samplesData };
			}
	
			return baseInfo;
		});
	
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(filteredInformation);
		XLSX.utils.book_append_sheet(wb, ws, 'Control Rendimiento');
		XLSX.writeFile(wb, 'control_rendimiento.xlsx');
		toast.success('Archivo exportado exitosamente')
	} catch (error) {
		console.error('Error exporting to Excel:', error)
		toast.error('Error al exportar el archivo')
	} finally {
		setIsExporting(false)
	}
	};
	const handleEstadoJefatura = async (id: number, estado: string) => {
		const token_verificado = await verificarToken(token!)
	
		if (!token_verificado) throw new Error('Token no verificado')
		const response = await fetchWithTokenPatch(`api/control-calidad/recepcionmp/${id}/`,
			{
				estado_aprobacion_cc: estado
			},
			token_verificado
		)
		if (response.ok) {
			toast.success('El lote fue aprobado')
			// Refresh current page data
			dispatch(fetchControlesDeCalidadPaginados({ 
				token, 
				verificar_token: verificarToken,
				params: { desde: currentPage * pageSize, hasta: (currentPage * pageSize) + pageSize - 1, comercializador }
			}))
		} else {
			toast.error('El lote no fue aprobado')
		}
	}

	const handleContramuestra = async (id: number, estado: string,  setPosted: Dispatch<SetStateAction<boolean>>) => {
		const token_verificado = await verificarToken(token!)
	
		if (!token_verificado) throw new Error('Token no verificado')
		const response = await fetchWithTokenPatch(`api/control-calidad/recepcionmp/${id}/`, 
			{
				esta_contramuestra: estado
			},
			token_verificado
		)

		if (response.ok) {
			toast.success('Fue solicitada una Contra Muestra')
			// Refresh current page data
			dispatch(fetchControlesDeCalidadPaginados({ 
				token, 
				verificar_token: verificarToken,
				params: { desde: currentPage * pageSize, hasta: (currentPage * pageSize) + pageSize - 1, comercializador }
			}))
			setPosted(true)

		} else {
			console.log("nop no lo logre")
		}
	}

	const handlePreContramuestra = async (id: number, estado: string,  setPosted: Dispatch<SetStateAction<boolean>>) => {
		const token_verificado = await verificarToken(token!)
		await handleEstadoJefatura(id, '1')
		if (!token_verificado) throw new Error('Token no verificado')
		const response = await fetchWithTokenPatch(`api/control-calidad/recepcionmp/${id}/`, 
			{
				esta_contramuestra: estado
			},
			token_verificado
		)

		if (response.ok) {
			toast.success('Fue solicitada una Contra Muestra')
			// Refresh current page data
			dispatch(fetchControlesDeCalidadPaginados({ 
				token, 
				verificar_token: verificarToken,
				params: { desde: currentPage * pageSize, hasta: (currentPage * pageSize) + pageSize - 1, comercializador }
			}))
			setPosted(true)

		} else {
			console.log("nop no lo logre")
		}
	}

	const columns = [
		columnHelper.display({
			id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold text-center'>{`${info.row.original.numero_lote}`}</div>
			),
			header: 'N° Lote',
		}),
		columnHelper.display({
			id: 'numero_guia',
			cell: (info) => (
				<div className='font-bold text-center'>{`${info.row.original.guia_recepcion}`}</div>
			),
			header: 'N° Guia',
		}),
		columnHelper.accessor('productor', {
			cell: (info) => {
				return (
					<div className='font-bold'>{`${info.row.original.productor}`}</div>
				)
			},
			header: 'Productor ',
		}),
		columnHelper.accessor('comercializador', {
			cell: (info) => {
				return (
					<div className='font-bold'>{`${info.row.original.comercializador}`}</div>
				)
			},
			header: 'Comercializador ',
		}),
		columnHelper.display({
			id: 'cantidad',
			cell: (info) => {
				const cantidad = info.row.original.control_rendimiento.length ? info.row.original.control_rendimiento.length : 0
				return (
					<div className='font-bold text-center'>{`${cantidad < 2 ? 'Sin muestras registradas' : cantidad}`}</div>
				)
			},
			header: 'Cantidad Muestras',
		}),
		columnHelper.accessor('estado_aprobacion_cc', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.estado_aprobacion_cc_label}`}</div>
			),
			header: 'Estado VB Lote',
		}),
		columnHelper.display({
			id: 'informe',
			cell: (info) => {
				const cantidad = info.row.original.control_rendimiento.length
				const isComplete = info.row.original.control_rendimiento.every((item: any) => item.cc_rendimiento !== null) &&
				info.row.original.control_rendimiento.some((item: any) => item.cc_calibrespepaok === true);

				return (
					<>
						{
  						cantidad >= 2
						? isComplete
						? (
							<div className='h-full w-full flex justify-center  gap-2'>
							<Button
								variant='solid'
								color='zinc'
								colorIntensity='700'
								className={`hover:scale-105`}
								onClick={() => navigate(`/cdc/crmp/vb_control/${info.row.original.id}`, { state: { pathname: pathname } })}
							>
								<HeroEye style={{ fontSize: 25 }}/>
							</Button>

							{
								info.row.original.esta_contramuestra === '1'
								? null
								: (
									<Button
										title='PDF CC Rendimiento'
										variant='solid'
										color='red'
										colorIntensity='900'
										className={`hover:scale-105`}
										onClick={() => window.open(`/cdc/crmp/pdf-rendimiento/${info.row.original.recepcionmp}`, '_blank')}
									>
										<FaFilePdf style={{ fontSize: 28 }}/>
									</Button>
								)	
							}
							</div>
						)
						: <div className='text-red-500 font-bold text-center w-full'>Muestreo Incompleto</div>
						: <div className='text-md font-semibold text-center w-full'>Muestras insuficientes para CDR</div>
					}

					</>
					
				)
			},
			header: 'Informes CDR',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;

				const cantidad = info.row.original.control_rendimiento.length
				const estado_aprobacion = info.row.original.estado_aprobacion_cc
	
				const isComplete = info.row.original.control_rendimiento.every((item: any) => item.cc_rendimiento !== null) &&
                   info.row.original.control_rendimiento.some((item: any) => item.cc_calibrespepaok === true);


				const contra_muestras_estado =  info.row.original.esta_contramuestra
				const [posted, setPosted] = useState<boolean>(false)
				const [confirmacion, setConfirmacion] = useState(false)

				return (
					<div className='h-full w-full flex justify-center  gap-2'>
						{
							cantidad >= 2 && ( hasGroup(['dnandres']) || hasGroup(['comercializador']))
								? (
									<>
									{
										estado_aprobacion == 1 
											&& (
												<div className='flex items-center'>
													{
														contra_muestras_estado === '0'
															? (
																<ModalForm
																	variant='solid'
																	open={posted}
																	setOpen={setPosted}
																	color='amber'
																	colorIntensity='700'
																	width='hover:scale-105'
																	textTool='Solicitar Contra Muestra' // here
																	icon = {<RiErrorWarningFill className='text-4xl'/>}
																	>
																		<ModalConfirmacion
																			id = {id}
																			confirmacion={confirmacion}
																			setConfirmacion={setConfirmacion}
																			mensaje='¿Está seguro de solicitar contra muestra?. ¡invalidara el muestreo de rendimiento aprobado!'
																			formulario={<TbFidgetSpinner className=' animate-spin text-6xl'/>}
																			setOpen={(setPosted)} 
																			functionAction={handleContramuestra}
																		/>
																</ModalForm>
																)
															: (
																	<Button
																		title={contra_muestras_estado === '0' ? 'Solicitar Contra Muestra' : contra_muestras_estado === '1' ? 'Contra Muestra Solicitada' : contra_muestras_estado === '5' ? 'Contra Muestra Completada' : ''}
																		variant='solid'
																		color={contra_muestras_estado === '0' ? 'amber' : contra_muestras_estado === '1' ? 'emerald' : contra_muestras_estado === '5' ? 'emerald' : 'zinc' }
																		onClick={() => {
																			if (contra_muestras_estado === '1' || contra_muestras_estado === '5'){
																				{}
																			} else {
																				posted ? null : handleContramuestra(id, '1', setPosted)
																			}
																		}}
																		className='hover:scale-105'>
																		{
																			contra_muestras_estado === '0'
																				? <RiErrorWarningFill className='text-3xl'/>
																				: contra_muestras_estado === '1'
																					? <ImSpinner2  className='text-3xl transition-all delay-200 animate-spin'/>
																					: contra_muestras_estado === '5'
																						? <BiCheckDouble className='text-3xl'/>
																						: null
																		}
																	</Button>
															)
													}
												</div>
											)

									}
									{
										estado_aprobacion == 0 && (
											isComplete && comercializador === 'Prodalmen'
											? (
											<>
												<Button
												title='Aprobar CC Rendimiento Lote'
												variant='solid'
												color='emerald'
												onClick={() => handleEstadoJefatura(id, '1')} 
												className='hover:scale-105'>
												<AiFillLike className='text-4xl'/>
												</Button>
												<ModalForm
														variant='solid'
														open={posted}
														setOpen={setPosted}
														color='red'
														colorIntensity='700'
														width='hover:scale-105'
														textTool='Solicitar Contra Muestra' // here
														icon = {<AiFillDislike className='text-4xl'/>}
														>
															<ModalConfirmacion
																id = {id}
																confirmacion={confirmacion}
																setConfirmacion={setConfirmacion}
																mensaje='¿Está seguro de solicitar contra muestra?. ¡invalidara el muestreo de rendimiento aprobado!'
																formulario={<TbFidgetSpinner className=' animate-spin text-6xl'/>}
																setOpen={(setPosted)} 
																functionAction={handlePreContramuestra}
															/>

													</ModalForm>

				
											</>
											)
											: <div className='text-red-500 font-bold'>Muestreo Incompleto</div> // Mensaje cuando isComplete es falso
										)
										}

									{
										estado_aprobacion > 0 && estado_aprobacion < 2 
											&& (
													<GeneratePdfAndSendMail key = {id} id={info.row.original.id} mailEnviado={info.row.original.mailEnviado} />
												)
											
										}
									</>
								)
								: !hasGroup(['dnandres']) && !hasGroup(['comercializador']) 
									?	<span>No tienes permisos</span>
									: <span className='text-md font-semibold'>Muestras insuficientes en CDC</span>
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
		// 	pagination: { pageSize: 10 },
		// },
	});

	const columnas: TableColumn[] = [
    { id: 'numero_lote', header: '', className: 'w-24'},
    { id: 'cantidad', header: '', className: 'w-40' },
    { id: 'actions', header: '', className: 'w-72' },
  ]


	return (
		<>
			<LoadingModal isOpen={isExporting} />
			<PageWrapper name='Lista Control Rendimiento'>
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
							<CardTitle>VB Control Rendimiento Lote</CardTitle>
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
					<CardHeader>
								<div className="w-full flex	gap-5">
									<Button
										variant="solid"
										onClick={() => exportToExcel()}
										className="bg-green-600 hover:bg-green-500 border border-green-600 hover:border-green-500 hover:scale-105"
										>
										<FaFileExcel style={{ fontSize: 20, color: 'white'}}/>
										Exportar archivo CSV
									</Button>
								</div>
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
		</>
	);
};

export default TablaControlRendimiento;
