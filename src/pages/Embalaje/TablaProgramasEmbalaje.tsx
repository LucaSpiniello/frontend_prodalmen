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
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import Tooltip from '../../components/ui/Tooltip';
import { HeroEye, HeroPlus } from '../../components/icon/heroicons';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../components/ui/Card';
import Container from '../../components/layouts/Container/Container';
import Badge from '../../components/ui/Badge';
import ModalForm from '../../components/ModalForm.modal';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../templates/common/TableParts.template';
import Button from '../../components/ui/Button';
import { GUARDAR_PROGRAMA } from '../../redux/slices/produccionSlice';
import { useAuth } from '../../context/authContext';
import { fetchWithToken, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils';
// import { TSeleccion } from '../../types/TypesSeleccion.type';
import { format } from '@formkit/tempo';
// import FormularioInformeSeleccion from '../Formularios/Formulario PDF\'s/FormularioInformeSeleccion';
// import FormularioInformeKilosXOperario from '../Formularios/Formulario PDF\'s/FormularioInformeKilosXOperario';
// import FormularioInformeOperariosResumido from '../Formularios/Formulario PDF\'s/FormularioInformeOperarioResumido';

import { HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";
import { TbEqual } from "react-icons/tb";
import { TEmbalaje } from '../../types/TypesEmbalaje.type';
import { fetchProgramasEmbalaje } from '../../redux/slices/embalajeSlice';
import FormularioRegistroProgramaEmbalaje from './Formularios/FormularioRegistroProgramaEmbalaje';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';






const TablaProgramaEmbalaje = () => {
	const navigate = useNavigate()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const [openModal, setOpenModal] = useState<boolean>(false)


	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

	const programa_embalaje = useAppSelector((state: RootState) => state.embalaje.programa_embalaje)

	useEffect(() => {
		dispatch(fetchProgramasEmbalaje({ token, verificar_token: verificarToken }))
	}, [])


	const actualizarEstadoEmbalaje = async (id: number, estado: string) => {
		try {
			const token_verificado = await verificarToken(token!)

			if (!token_verificado){
					throw new Error('Token no valido')
				}

			const response_estado = await fetchWithTokenPatch(`api/embalaje/${id}/`, { id, estado_embalaje: estado, registrado_por: perfil?.id }, token_verificado)
			if (response_estado.ok){
				const data: TEmbalaje = await response_estado.json()
				toast.success(`El programa esta en ${data.estado_embalaje_label}`)
	
				dispatch(fetchProgramasEmbalaje({ token, verificar_token: verificarToken }))
			}
		} catch (error) {
			toast.error('Error en la peticion')
		}
	}



	const columnHelper = createColumnHelper<TEmbalaje>();
	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('calidad', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.calidad_label}`}
				</div>
			),
			header: 'Calidad',
		}),
		columnHelper.accessor('calibre', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.calibre_label}`}
				</div>
			),
			header: 'Calibre',
		}),
		columnHelper.accessor('variedad', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.variedad_label}`}
				</div>
			),
			header: 'Variedad',
		}),
		columnHelper.accessor('kilos_solicitados', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.kilos_solicitados}`}
				</div>
			),
			header: 'Kilos Solicitados',
		}),
		columnHelper.accessor('estado_embalaje', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.estado_embalaje_label}`}
				</div>
			),
			header: 'Estado Embalaje',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const row = info.row.original
				const estado = info.row.original.estado_embalaje
				

				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

						{
							estado === '0' || estado !== '2' && estado! <= '3' && info.row.original.fruta_bodega.length >= 1
								? (
									<Button
										variant='solid'
										color='amber'
										colorIntensity='600'
										className='hover:scale-105'
										onClick={() => actualizarEstadoEmbalaje(id, '2')}
										>
											<FaPlay style={{ fontSize: 25, color: 'white'}}/>
									</Button>
									)
								: null
						}

						{
							estado === '2'
								? (
									<Button
										variant='solid'
										color='sky'
										colorIntensity='500'
										className='hover:scale-105'
										onClick={() => actualizarEstadoEmbalaje(id, '3')}
										>
											<FaPause style={{ fontSize: 25, color: 'white'}}/>
									</Button>
									)
								: null
						}

						{
							['4', '5'].includes(info.row.original.estado_embalaje)
								? null
								: (
									<Link to={`${`/emb/registro-programa-embalaje/${id}`}`} state={{ pathname: `/programas-embalaje/` }}>
										<Button
											color='yellow'
											colorIntensity='700'
											variant='solid'
											className='hover:scale-105'>
											<HeroPlus style={{ fontSize: 25, color: 'white' }}/>
										</Button>
									</Link>
								)
						}

						<Link to={`${`/emb/embalaje-programa/${id}/`}`} state={{ pathname: '/programas-embalaje' }}>
							<Button
								color='blue'
								colorIntensity='700'
								variant='solid'
								className='hover:scale-105'>
								<HeroEye style={{ fontSize: 25, color: 'white' }}/>
							</Button>
						</Link>

						<Link to={`${`/emb/pdf-entrada/${id}`}`} state={{ pathname: `/programas-embalaje/` }}>
							<Button
								title='Documento Entrada'
								color='red'
								colorIntensity='800'
								variant='solid'
								className='hover:scale-105'>
								<FaFilePdf style={{ fontSize: 25, color: 'white' }}/>
							</Button>
						</Link>

						<Link to={`${`/emb/pdf-salida/${id}`}`} state={{ pathname: `/programas-embalaje/` }}>
							<Button
								title='Documento Salida'
								color='red'
								colorIntensity='800'
								variant='solid'
								className='hover:scale-105'>
								<FaFilePdf style={{ fontSize: 25, color: 'white' }}/>
							</Button>
						</Link>
				
					</div>
				);
			},
			header: 'Acciones'
		}),
	];



	const table = useReactTable({
		data: programa_embalaje,
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
	})

	return (
		<PageWrapper name='Lista Programas Embalaje'>
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

							<SubheaderRight>
								<ModalForm
									title='Registro Programa Embalaje'
									variant='solid'
									open={openModal}
									setOpen={setOpenModal}
									textButton='Registrar Programa Embalaje'
									size={800}
									>
										<FormularioRegistroProgramaEmbalaje />
								</ModalForm>
							</SubheaderRight>
								

			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Programas Embalaje</CardTitle>
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

export default TablaProgramaEmbalaje;

