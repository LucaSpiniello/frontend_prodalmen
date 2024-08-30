import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';

import DetalleEnvaseMP from '../DetalleEnvase';
import { TEnvases } from '../../../../types/TypesRecepcionMP.types';
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
import FormularioRegistroEnvases from '../Formularios/FormularioRegistroEnvases';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import Container from '../../../../components/layouts/Container/Container';
import Badge from '../../../../components/ui/Badge';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../templates/common/TableParts.template';
import { useAuth } from '../../../../context/authContext';
import { fetchWithToken, fetchWithTokenDelete } from '../../../../utils/peticiones.utils';
import { ELIMINAR_ENVASE } from '../../../../redux/slices/envasesSlice';
import toast from 'react-hot-toast';
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

const columnHelper = createColumnHelper<TEnvases>();

interface IEnvasesProps {
	data: TEnvases[]
}

const TablaEnvases: FC<IEnvasesProps> = ({ data }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()


	const asisteDelete = async (id: number) => {

		const token_verificado = await verificarToken(token!)
		if (!token_verificado) throw new Error('Token no verificado')

		const response = await fetchWithTokenDelete(`api/envasesmp/${id}/`, token_verificado )
		if (response.ok) {
			toast.success('Envase eliminado correctamente')
			dispatch(ELIMINAR_ENVASE(id))
		} else if (response.status === 400) {
			const errorData = await response.json()
			toast.error(`${Object.entries(errorData)}`)
		}
	}

	const columns = [
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.nombre}`}</div>
			),
			header: 'Nombre',
		}),
		columnHelper.accessor('peso', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.peso}`}</div>
			),
			header: 'Peso',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [detalleModalStatus, setDetalleModalStatus] = useState(false);

				return (
					<div className='h-full w-full flex gap-2 '>
						<ModalForm
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Envase Materia Prima'
							variant='solid'
							width={`w-20 px-1 h-12 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleEnvaseMP id={id}/>
						</ModalForm>

						<Tooltip text='Eliminar'>
							<button onClick={async () => await asisteDelete(id)} type='button' className={`w-20 px-1 h-12 bg-red-800 text-white rounded-md flex items-center justify-center hover:scale-105`}>
								<HeroXMark style={{ fontSize: 25 }} />
							</button>
						</Tooltip>
					</div>
				);
			},
			header: 'Acciones'
		}),
	];

	const columnas: TableColumn[] = [
    { id: 'actions', header: '', className: 'lg:w-56' },
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
		<PageWrapper name='ListaEnvases'>
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
							placeholder='Busca el envase...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalForm
						open={modalStatus}
						setOpen={setModalStatus}
						title='Registro Envases'
						variant='solid'
						textButton='Agregar Envases'
						width={`px-6 py-3 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105`}

					>
						<FormularioRegistroEnvases setOpen={setModalStatus} />
					</ModalForm>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Envases</CardTitle>
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

export default TablaEnvases;
