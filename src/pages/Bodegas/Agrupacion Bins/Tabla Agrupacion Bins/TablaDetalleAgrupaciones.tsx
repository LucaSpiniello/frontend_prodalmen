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
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPostAction, fetchWithTokenPut } from '../../../../utils/peticiones.utils';
import { ELIMINAR_ENVASE } from '../../../../redux/slices/envasesSlice';
import toast from 'react-hot-toast';
import { fetchBinAgrupado, fetchBinsAgrupados } from '../../../../redux/slices/bodegaSlice';
import { TAgrupacion, TBinResultanteAgrupado } from '../../../../types/TypesBodega.types';
import { format } from '@formkit/tempo';
import Button from '../../../../components/ui/Button';
import { IoIosBarcode } from 'react-icons/io';
import ModalRegistroAgrupacion from '../Formulario/ModalRegistroAgrupacion';
import TablaBinAgrupado from '../Formulario/TablaBinBodega';
import { Link, useLocation, useParams } from 'react-router-dom';
import { binarySearch } from '@fullcalendar/core/internal';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const TablaDetalleAgrupaciones = () => {
  const { id: id_agrupacion } = useParams()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const { pathname } = useLocation()
	const bin_agrupacion = useAppSelector((state: RootState) => state.bodegas.bin_agrupado)

	useEffect(() => {
		//@ts-ignore
		dispatch(fetchBinsAgrupados({ token, verificar_token: verificarToken }))
	}, [])




	const agruparBins = async () => {
		const token_verificado = await verificarToken(token!)
	
		if (!token_verificado) throw new Error('Token no verificado')

		const res = await fetchWithTokenPostAction(`api/agrupacion/${id_agrupacion}/agrupar/`, token_verificado)
		if (res.ok){
			toast.success('Agrupación realizada correctamente!')
			//@ts-ignore
			dispatch(fetchBinAgrupado({ id: id_agrupacion, token, verificar_token: verificarToken }))

		} else {
			toast.error('Error al agrupar los bins')
		}
	}

	const confirmarAgrupacion = async () => {
		const token_verificado = await verificarToken(token!)
	
		if (!token_verificado) throw new Error('Token no verificado')

		const res = await fetchWithTokenPatch(`api/agrupacion/${id_agrupacion}/`, {
			agrupamiento_ok: true
		}, token_verificado)
		if (res.ok){
			toast.success('Agrupación realizada correctamente!')
			//@ts-ignore
			dispatch(fetchBinAgrupado({ id: id_agrupacion, token, verificar_token: verificarToken }))

		} else {
			toast.error('Error al agrupar los bins')
		}
	}


	const columnHelper = createColumnHelper<TBinResultanteAgrupado>();
	const columns = [
		columnHelper.accessor('codigo_tarja', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.codigo_tarja}`}</div>
			),
			header: 'Código Tarja',
		}),
		columnHelper.accessor('kilos_fruta', {
			cell: (info) => (
				<div className='font-bold'>{`${(info.row.original.kilos_fruta ?? 0).toLocaleString()}`}</div>
			),
			header: 'Kilos Fruta',
		}),
		columnHelper.accessor('calle', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.calle}`}</div>
			),
			header: 'Calle',
		}),
		columnHelper.accessor('fecha_registro', {
			cell: (_info) => (
				<div className='font-bold'>
					{/* {`${format(info.row.original.fecha_registro, { date: 'short', time: 'short' }, 'es' )}`} */}
					</div>
			),
			header: 'Creado el',
		}),
	];

	const table = useReactTable({
		data: bin_agrupacion?.bins_agrupados ? bin_agrupacion?.bins_agrupados : [],
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
					{
						bin_agrupacion?.bins_agrupados.length! < 1
							? (
								<Tooltip text='Añadir bin a agrupación'>
									<Link to={`/bdg/acciones/agrupaciones/registro-agrupacion-bin/${id_agrupacion}`} state={{ pathname: pathname }}>
										<Button
											variant='solid'
											className='bg-blue-800 hover:bg-blue-700 border-none py-3 hover:scale-105'
											>
												Agregar Bin 
										</Button>
									</Link>
								</Tooltip>
										)
							: bin_agrupacion?.bins_agrupados.reduce((acc, bin) => bin.kilos_fruta + acc, 0)! > 500
										? (
											<Tooltip text='Añadir bin a agrupación'>
												<Button
													variant='solid'
													onClick={async () => agruparBins()}
													className='bg-blue-800 hover:bg-blue-700 border-none py-3 hover:scale-105'
													>
														Aquintalar Bin
												</Button>
											</Tooltip>
											)
										: bin_agrupacion?.agrupamiento_ok
											? null
											: (
												<Tooltip text='Añadir bin a agrupación'>
													<Button
														variant='solid'
														onClick={async () => confirmarAgrupacion()}
														className='bg-blue-800 hover:bg-blue-700 border-none py-3 hover:scale-105'
														>
															Confirmar Agrupación
													</Button>
												</Tooltip>
											)
					}
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardTitle>Bins que componen la agrupación</CardTitle>
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

export default TablaDetalleAgrupaciones 
