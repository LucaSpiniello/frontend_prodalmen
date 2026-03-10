import { FC, useState } from 'react';
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
	FaPlus,

} from "react-icons/fa";
import FormularioInformeProduccion from '../Formularios/FormularioInformeProduccion';
import FormularioKilosOperarios from '../Formularios/FormularioKilosOperarios';
import FormularioResumen from '../Formularios/FormularioResumenOperario';
import { TProduccion } from '../../../../types/TypesProduccion.types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/hooks';
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
import { actualizar_programa_produccion, registrar_programa_produccion } from '../../../../redux/slices/produccionSlice';
import { useAuth } from '../../../../context/authContext';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';


interface IProduccionProps {
	data: TProduccion[] | []
}

const TablaProgramas: FC<IProduccionProps> = ({ data }) => {
	const navigate = useNavigate()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const { pathname } = useLocation()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
	const userGroups = useAppSelector((state: RootState) => state.auth.grupos)


const columnHelper = createColumnHelper<TProduccion>();

	const columns = [
		columnHelper.accessor('numero_programa', {
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_programa}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('lotes_length', {
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.lotes_length}`}
				</div>
			),
			header: 'N° Envases',
		}),
		columnHelper.display({
			id: 'lotes_ingresados',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className='text-center'>{info.row.original.lotes_por_procesar}</p>
					</div>
				)
			},
			header: 'Envases en Proc.',
		}),
		columnHelper.display({
			id: 'lotes_procesados', 
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className='text-center'>{info.row.original.lotes_procesados}</p>
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
			id:'rendimientos',
			cell: (info) => (
				<div className='font-bold truncate'>
					<Tooltip text='Rendimiento CDC'>
						<Link to={`/pro/produccion/proyeccion-rendimiento/${info.row.original.id}/`} state={{ pathname: '/produccion/' }}>
							<button className='w-full rounded-md h-12 bg-zinc-300 flex items-center justify-center p-2'>
								<p className='text-black m-0'>Rendimiento CDC</p>
							</button>
						</Link>
					</Tooltip>
				</div>

			),
			header: 'Rendimiento Programa',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id
				const estado = info.row.original.estado
				

				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

{
						estado === '0' || estado === '1' && estado <= '2' && info.row.original.lotes_length
							? (
								<>
									<Button
										title='Iniciar Producción'
										variant='solid'
										color='amber'
										onClick={() => dispatch(
											actualizar_programa_produccion({
												id, 
												params: { 
													estado: '2',
													perfil: perfil
													},
												token, 
												verificar_token: verificarToken 
												})
										)}
										className='w-16 rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'>
										<FaPlay style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									<Button
										title='Registrar Lotes en Programa'
										variant='solid'
										color='blue'
										onClick={() => navigate(`/pro/produccion/registro-programa/${info.row.original.id}`)}
										className='w-16 rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'>
										<FaPlus style={{ fontSize: 25, color: 'white' }}/>
									</Button>
								</>
								)
							: null
					}

					{
						estado === '2'
							? (
								<>
								<Button
										title='Registrar Lotes en Programa'
										variant='solid'
										color='blue'
										onClick={() => navigate(`/pro/produccion/registro-programa/${info.row.original.id}`)}
										className='w-16 rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'>
										<FaPlus style={{ fontSize: 25, color: 'white' }}/>
									</Button>
									<Button
										title='Pausar Producción'
										variant='solid'
										color='blue'
										onClick={() => dispatch(
											actualizar_programa_produccion({
												id, 
												params: { 
													estado: '0',
													tipo_boton: 'pausa',
													perfil: perfil,
													},
												token, 
												verificar_token: verificarToken 
												})
										)}
										className='w-16 rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'>
										<FaPause style={{ fontSize: 25, color: 'white' }}/>
									</Button>
								</>
								)
							: null
					}

					

						<Link to={`${`/pro/produccion/programa/${id}/`}`} state={{ pathname: `/produccion/` }}>
							<Tooltip text='Detalle Produccion'>
								<button className='w-16 rounded-md h-12 bg-[#40be75] hover:bg-[#49bb78] flex items-center justify-center p-2 hover:scale-105'>
									<HeroEye style={{ fontSize: 35, color: 'white' }}/>
								</button>
							</Tooltip>
						</Link>

						

						{
							info.row.original.lotes_length
								? (
									<>
										<Tooltip text='Detalle envases del lote en Programa'>
											<Link to={`/pro/produccion/pdf-detalle-envases/${id}`} state={{ fecha_creacion: info.row.original.fecha_creacion , pathname: pathname }}>
												<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2'>
													<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
												</button>
											</Link>
										</Tooltip>

										<Tooltip text='Documento de entrada a proceso'>
											<Link to={`/pro/produccion/pdf-documento-entrada/${id}`} state={{ fecha_creacion: info.row.original.fecha_creacion , pathname: pathname }}>
												<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2'>
													<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
												</button>
											</Link>
										</Tooltip>
										<Tooltip text='Documento de salida Programa'>
											<Link to={`/pro/produccion/pdf-produccion-salida/${id}`}>
												<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2'>
													<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
												</button>
											</Link>
										</Tooltip>
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
		{ id: 'numero_programa', header: '', className: 'w-28 text-center' },
    { id: 'lotes_length', header: '', className: 'w-28 text-center' },
    { id: 'lotes_ingresados', header: '', className: 'w-auto lg:w-72 text-center' },
    { id: 'lotes_procesados', header: '', className: 'w-auto lg:w-72 text-center' },
    { id: 'rendimientos', header: '', className: 'w-56 text-center' },
    { id: 'estado', header: '', className: 'lg:w-72'},
  ]

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
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
	});

	return (
		<PageWrapper name='Lista Programas'>
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

				{/* {
					data.length <= 1 || data.slice(2).every((lote) => lote.estado === '5')
						? ( */}
							<SubheaderRight>
									<Button
										variant='solid'
										onClick={() => dispatch(registrar_programa_produccion({ params: { perfil: perfil, navigate: navigate }, token, verificar_token: verificarToken }))}
										className='w-full rounded-md h-12 bg-blue-700 flex items-center justify-center p-2 hover:scale-105 px-2 border-none'>
										<span className='text-lg text-white'>Registrar Programa de Producción</span>
									</Button>
							</SubheaderRight>
							{/* )
						: null 
				}  */}
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Programas Producción</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild>
							<div className='flex flex-col *:w-full md:w-auto lg:w-auto md:flex-row lg:flex-row gap-5'>
								<ModalForm
									open={informePro}
									setOpen={setInformePro}
									title='Informe de Producción'
									variant='solid'
									color='red'
									colorIntensity='800'
									icon={
									<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
										<span className='text-md font-semibold'>Generar Informe de Producción</span>
									</div>
									}
									width={`w-full hover:scale-105`}
									size={800}
								>
									<FormularioInformeProduccion setOpen={setInformePro}/>
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
									width={`w-full hover:scale-105`}
									size={700}
								>
									<FormularioKilosOperarios setOpen={setInformePro}/>
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
									width={`w-full hover:scale-105`}
									size={500}
								>
									<FormularioResumen setOpen={setInformeinformeResOp}/>
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

export default TablaProgramas;

