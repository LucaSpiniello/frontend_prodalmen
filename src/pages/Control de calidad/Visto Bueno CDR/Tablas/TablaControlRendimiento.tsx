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
import { IoMailOutline } from "react-icons/io5";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { ImSpinner2  } from "react-icons/im";
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { TControlCalidad } from '../../../../types/TypesControlCalidad.type';
import Tooltip from '../../../../components/ui/Tooltip';
import { useAuth } from '../../../../context/authContext';
import { fetchWithTokenPatch } from '../../../../utils/peticiones.utils';
import { fetchControlesDeCalidad } from '../../../../redux/slices/controlcalidadSlice';
import { BiCheckDouble } from 'react-icons/bi';
import toast from 'react-hot-toast';
import ModalConfirmacion from '../../../../components/ModalConfirmacion';
import ModalForm from '../../../../components/ModalForm.modal';
import Button from '../../../../components/ui/Button';
import { TbFidgetSpinner } from 'react-icons/tb';
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"


const columnHelper = createColumnHelper<TControlCalidad>();

interface IControlProps {
	data: TControlCalidad[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const TablaControlRendimiento: FC<IControlProps> = ({ data }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const navigate = useNavigate()

	const { isDarkTheme } = useDarkMode()
	const { pathname } = useLocation()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);


	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()
	


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
			dispatch(fetchControlesDeCalidad({ token, verificar_token: verificarToken }))
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
			dispatch(fetchControlesDeCalidad({ token, verificar_token: verificarToken }))
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
		columnHelper.accessor('productor', {
			cell: (info) => {
				return (
					<div className='font-bold'>{`${info.row.original.productor}`}</div>
				)
			},
			header: 'Productor ',
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
										onClick={() => navigate(`/cdc/crmp/pdf-rendimiento/${info.row.original.id}`, { state: { pathname: pathname } })}
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
							cantidad >= 2 && hasGroup(['dnandres'])
								? (
									<>
									{
										estado_aprobacion > 0 && estado_aprobacion < 2
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
																	textTool='Solicitar Contra Muestra'
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
											isComplete
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
												<Button
												title='Rechazar CC Rendimiento Lote'
												variant='solid'
												color='red'
												onClick={() => handleEstadoJefatura(id, '2')} 
												className='hover:scale-105'>
												<AiFillDislike className='text-4xl'/>
												</Button>
											</>
											)
											: <div className='text-red-500 font-bold'>Muestreo Incompleto</div> // Mensaje cuando isComplete es falso
										)
										}

									{
										estado_aprobacion > 0 && estado_aprobacion < 2 
											&& (
												<Button 
													title='Mandar Email a Proveedor'
													variant='solid'
													color='blue'
													colorIntensity='700'
													className=' hover:scale-105'>
													<IoMailOutline style={{ fontSize: 25 }} />
												</Button>
												)
											// : (
											// 	
											// )
											
										}
									</>
								)
								: !hasGroup(['dnandres'])
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
			pagination: { pageSize: 10 },
		},
	});

	const columnas: TableColumn[] = [
    { id: 'numero_lote', header: '', className: 'w-24'},
    { id: 'cantidad', header: '', className: 'w-40' },
    { id: 'actions', header: '', className: 'w-72' },
  ]


	return (
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

export default TablaControlRendimiento;
