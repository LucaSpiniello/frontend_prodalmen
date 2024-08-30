import {FC, useEffect, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useAuth } from '../../../context/authContext';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import ModalForm from '../../../components/ModalForm.modal';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Checkbox, { CheckboxGroup } from '../../../components/form/Checkbox';
import { fetchClientes } from '../../../redux/slices/clientes';
import { TClientes } from '../../../types/TypesRegistros.types';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import Tooltip from '../../../components/ui/Tooltip';
import Button from '../../../components/ui/Button';
import { HeroEye, HeroXMark } from '../../../components/icon/heroicons';
import { fetchWithTokenDelete } from '../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import FormularioRegistroClientes from './Formularios/FormularioRegistroClientes';
import DetalleClientes from './Detalles/DetalleClientes';
import Input from '../../../components/form/Input';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import ButtonsTablaClientes, { OPTIONS_TABLA_CLIENTES, TTabsTableCliente, TTabsTableClientes } from './Botones/ButtonsTablaClientes';



const TablaClientes = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()
	const [activeTab, setActiveTab] = useState<TTabsTableClientes>(OPTIONS_TABLA_CLIENTES.CMI)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const clientes = useAppSelector((state: RootState) => state.clientes.clientes)

  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);

	useEffect(() => {
		if (activeTab){
		dispatch(fetchClientes({ params: { search: `?tipo_cliente=${activeTab.text === 'Clientes Mercado Interno' ? 'clientemercadointerno' : 'clienteexportacion'}` }, token, verificar_token: verificarToken }))
		}
	}, [activeTab])


	const eliminarCliente = async (rut_cliente: string) => {
		const token_verificado = await verificarToken(token!)
		if (!token_verificado) throw new Error('Token no verificado')
		const res = await fetchWithTokenDelete(`api/clientes/eliminar_cliente?rut=${rut_cliente}`, token_verificado)
		if  (res.ok){
			toast.success('Se ha eliminado exitosamente')
			dispatch(fetchClientes({ params: { search: `?tipo_cliente=${activeTab.text === 'Clientes Mercado Interno' ? 'clientemercadointerno' : 'clienteexportacion'}` }, token, verificar_token: verificarToken }))
		} else {
			toast.error('No ha logrado eliminar')
		}
	}




	const columnHelper = createColumnHelper<TClientes>();

	const columns = [
		columnHelper.accessor('rut_dni', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.rut_dni}`}
				</div>
			),
			header: 'Run/Dni',
		}),
		columnHelper.accessor('razon_social', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.razon_social}`}
				</div>
			),
			header: 'Razón Social',
		}),
		columnHelper.accessor('pais_ciudad', {
			cell: (info) => (
				<div className='font-bold	'>
					{info.row.original.pais_ciudad}
				</div>
			),
			header: 'País/Ciudad',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold'>
					{info.row.original.telefono}
				</div>
			),
			header: 'Telefono',
		}),
		columnHelper.accessor('movil', {
			cell: (info) => (
				<div className='font-bold'>
					{info.row.original.movil}
				</div>
			),
			header: 'Móvil',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const [detalleModalStatus, setDetalleModalStatus] = useState(false);
				const [deleteModalStatus, setDeleteModalStatus] = useState(false);
				const confirmDelete = () => {
					dispatch(eliminarCliente(info.row.original.rut_dni));
					setDeleteModalStatus(false); 
				  };
				return (
					<div className='h-full w-full flex gap-2 flex-wrap justify-center'>

						<ModalForm
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool={`Detalle ${activeTab.text}`}
							title={`Detalle ${activeTab.text}`}
							variant='solid'
							color='blue'
							colorIntensity='700'
							size={900}
							modalAction={true}
							
							width={`hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleClientes setOpen={setDetalleModalStatus} tipo_cliente={activeTab.text === 'Clientes Mercado Interno' ? 'clientemercadointerno' : 'clienteexportacion'} rut={info.row.original.rut_dni}/>
						</ModalForm>

						{hasGroup(['registros-admin']) && (
							<>
								<Tooltip text='Eliminar'>
								<Button onClick={() => {
									setDeleteModalStatus(true);
								}}
									variant="solid"
									color="red"
									colorIntensity="700"
									className={`hover:scale-105`}>
									<HeroXMark style={{ fontSize: 25 }} />
								</Button>
								</Tooltip>
								<DeleteConfirmationModal
									isOpen={deleteModalStatus}
									onClose={() => setDeleteModalStatus(false)}
									onConfirm={() => confirmDelete()}
									message="¿Estás seguro de que deseas eliminar este productor?"
								/>
							</>
							)}
					</div>
				);
			},
			header: 'Acciones'
		})
	]




	const table = useReactTable({
		data: clientes,
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
			pagination: { pageSize: 8 },
		},
	});

	return (
		<PageWrapper name='Lista Clientes'>
			<Subheader>
				<SubheaderLeft className='w-full md:w-auto first-line:lg:w-auto'>
					<FieldWrap
						className='w-full'
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
							placeholder='Busca al camión...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight className='w-full md:w-auto lg:w-auto'>
					<ModalForm
						open={modalStatus}
						setOpen={setModalStatus}
						variant='solid'
						size={700}
						title={`Agregar ${activeTab.text}`}
						width={`hover:scale-105`}
						textButton={`Agregar ${activeTab.text}`}
					>
						<FormularioRegistroClientes tipo_cliente={activeTab.text === 'Clientes Mercado Interno' ? 'clientemercadointerno' : 'clienteexportacion' } setOpen={setModalStatus}/>
					</ModalForm>
					
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>{activeTab.text}</CardTitle>
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
						<div className='flex flex-wrap mb-3'>
							<ButtonsTablaClientes activeTab={activeTab} setActiveTab={setActiveTab}/>
						</div>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} className='mt-2 mb-10' />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaClientes;
