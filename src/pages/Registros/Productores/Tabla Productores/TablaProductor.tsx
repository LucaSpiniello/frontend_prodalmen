import { Dispatch, FC, SetStateAction, useState } from "react";
import { TProductor } from "../../../../types/TypesRegistros.types";
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import useDarkMode from "../../../../hooks/useDarkMode";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import FieldWrap from "../../../../components/form/FieldWrap";
import Icon from "../../../../components/icon/Icon";
import Input from "../../../../components/form/Input";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../../components/ui/Card";
import Badge from "../../../../components/ui/Badge";
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template";
import ModalForm from "../../../../components/ModalForm.modal";
import { HeroEye, HeroPencilSquare, HeroXMark } from "../../../../components/icon/heroicons";
import { FaUserPlus, FaFileContract  } from "react-icons/fa";
import DetalleProductor from "../DetalleProductor";
import Tooltip from "../../../../components/ui/Tooltip";
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { deleteProductor } from "../../../../redux/slices/productoresSlice";
import FormularioEdicionProductor from "../Formularios/EdicionProductor";
import FormularioRegistroProductores from "../Formularios/RegistroProductor";
import { RootState } from "../../../../redux/store";
import Button from "../../../../components/ui/Button";
import { useAuth } from "../../../../context/authContext";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";

interface IProductorProps {
	data: TProductor[] | []
	refresh?: Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<TProductor>();



const TablaProductor: FC<IProductorProps> = ({ data  }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [registroModal, setRegistroModal] = useState<boolean>(false)
	const { isDarkTheme } = useDarkMode();
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos);


	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);



	const columns = [
		columnHelper.accessor('rut_productor', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{
						info.row.original.rut_productor
							? <span>{`${info.row.original.rut_productor}`}</span>
							: <span>No se ha registrado aun</span>
					}
				</div>
			),
			header: 'Rut Productor'
		}),
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold '>
					{
						info.row.original.nombre
							? <span>{`${info.row.original.nombre}`}</span>
							: <span>No se ha registrado aun</span>
					}
				</div>
			),
			header: 'nombre',
		}),
		columnHelper.accessor('email', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{
						info.row.original.email
							? <span>{`${info.row.original.email}`}</span>
							: <span>No se ha registrado aun</span>
					}
				</div>
			),
			header: 'Email',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{
						info.row.original.telefono
							? <span>{`${info.row.original.telefono}`}</span>
							: <span>No se ha registrado aun</span>
					}
				</div>

			),
			header: 'Telefono',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id
				const [detalleModalStatus, setDetalleModalStatus] = useState(false)
				const [selectedId, setSelectedId] = useState<number>(0);
				const [deleteModalStatus, setDeleteModalStatus] = useState(false);
				const confirmDelete = (id: number) => {
					dispatch(deleteProductor({ id, token, verificar_token: verificarToken }));
					setDeleteModalStatus(false); 
				  };
			
				return (
					<div className='h-full w-full flex justify-center gap-3 flex-wrap '>

						<ModalForm
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Productor'
							size={900}
							variant="solid"
							width={`hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleProductor id={id} setOpen={setDetalleModalStatus}/>
						</ModalForm>

						{hasGroup(['registros-admin']) && (
							<>
								<Tooltip text='Eliminar'>
								<Button onClick={() => {
									setSelectedId(id);
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
									onConfirm={() => confirmDelete(selectedId)}
									message="¿Estás seguro de que deseas eliminar este productor?"
								/>
							</>
							)}
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
			pagination: { pageSize: 5 },
		},
	});

	return (
		<PageWrapper name='Lista Productores' isProtectedRoute={true}>
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
							placeholder='Busca al productor...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalForm
						open={registroModal}
						setOpen={setRegistroModal}
						title='Registro Productores'
						variant="solid"
						textButton='Agregar Productor'
						width={`w-full md:w-full px-4 py-2 dark:bg-[#3B82F6] dark:hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105`}
						size={900}
					>
						<FormularioRegistroProductores setOpen={setRegistroModal}/>
					</ModalForm>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Productores</CardTitle>
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
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaProductor;
