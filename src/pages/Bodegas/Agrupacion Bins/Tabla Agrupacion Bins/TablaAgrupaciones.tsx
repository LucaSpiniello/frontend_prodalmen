import React, { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';

import useDarkMode from '../../../../hooks/useDarkMode';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import ModalForm from '../../../../components/ModalForm.modal';
import { HeroEye, HeroXMark } from '../../../../components/icon/heroicons';
import Tooltip from '../../../../components/ui/Tooltip';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';

import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import Container from '../../../../components/layouts/Container/Container';
import Badge from '../../../../components/ui/Badge';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import { useAuth } from '../../../../context/authContext';
import { fetchWithToken, fetchWithTokenDelete } from '../../../../utils/peticiones.utils';
import { ELIMINAR_ENVASE } from '../../../../redux/slices/envasesSlice';
import toast from 'react-hot-toast';
import { fetchBinsAgrupados } from '../../../../redux/slices/bodegaSlice';
import { TAgrupacion } from '../../../../types/TypesBodega.types';
import { format } from '@formkit/tempo';
import Button from '../../../../components/ui/Button';
import { IoIosBarcode } from 'react-icons/io';
import ModalRegistroAgrupacion from '../Formulario/ModalRegistroAgrupacion';
import TablaBinAgrupado from '../Formulario/TablaBinBodega';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';


const TablaBinsAgrupados = () => {
	const { pathname } = useLocation()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const { isDarkTheme } = useDarkMode()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()

	const bins_agrupados = useAppSelector((state: RootState) => state.bodegas.bins_agrupados)

	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);

	useEffect(() => {
		dispatch(fetchBinsAgrupados({ token, verificar_token: verificarToken }))
	}, [])

	const deleteAgrupacion = async (id_agrupacion: number) => {
		const token_verificado = await verificarToken(token!)
		if (!token_verificado) throw new Error('Token no verificado')
		const res = await fetchWithTokenDelete(`api/agrupacion/${id_agrupacion}/`, token_verificado)
		if (res.ok){
			toast.success('Agrupación eliminada exitosamente')
			dispatch(fetchBinsAgrupados({ token, verificar_token: verificarToken }))
		} else {
			toast.error('Error al eliminar la agrupación')
		}
	}

	const columnHelper = createColumnHelper<TAgrupacion>();
	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.id}`}</div>
			),
			header: 'ID',
		}),
		columnHelper.accessor('codigo_tarja', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.codigo_tarja}`}</div>
			),
			header: 'Código Tarja',
		}),
		columnHelper.accessor('transferir_bodega', {
			cell: (info) => (
				<div className='font-bold'>{`Bodega ${info.row.original.transferir_bodega}`}</div>
			),
			header: 'Bin Bodega',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>{`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short' }, 'es' )}`}</div>
			),
			header: 'Fecha Creación',
		}),
		columnHelper.accessor('registrado_por_nombre', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.registrado_por_nombre}`}</div>
			),
			header: 'Registrado Por',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;

				return (
					<div className='h-full w-full flex gap-2 justify-center flex-wrap'>
						<Tooltip text={`Imprimir etiqueta Bin Agrupación ${id}`}>
							<Link to={`/bdg/acciones/agrupaciones/agrupacion/${id}/`} state={{ pathname: pathname }}>
								<Button
									variant='solid'
									className='w-20 border-none rounded-md h-12 bg-blue-600 hover:bg-blue-500 flex items-center justify-center p-2 hover:scale-105'
									>
										<HeroEye style={{ fontSize: 25 }} />
								</Button>
							</Link>
						</Tooltip>

						<Tooltip text={`Imprimir etiqueta Bin Agrupación ${id}`}>
							<Button
								variant='solid'
								className='w-20 border-none rounded-md h-12 bg-green-600 hover:bg-green-500 flex items-center justify-center p-2 hover:scale-105'
								>
									<IoIosBarcode style={{ fontSize: 35 }}/>
							</Button>
						</Tooltip>

						{
							hasGroup(['bodega'])
								? (
									<Tooltip text='Eliminar'>
										<button onClick={async () => await deleteAgrupacion(id)} type='button' className={`w-20 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
											<HeroXMark style={{ fontSize: 25 }} />
										</button>
									</Tooltip>
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
		data: bins_agrupados,
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
		<PageWrapper name='Lista de Agrupaciones'>
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
							placeholder='Busca el agrupación...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalForm
						open={modalStatus}
						setOpen={setModalStatus}
						title='Registro de transferencia'
						variant='solid'
						textButton='Agregar Agrupación'
						width={`px-6 py-3 dark:bg-blue-800 border-none hover:bg-blue-700 bg-blue-800 text-white hover:scale-105`}
					>
						<ModalRegistroAgrupacion setOpen={setModalStatus}/>
					</ModalForm>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Agrupaciones</CardTitle>
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
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaBinsAgrupados;
