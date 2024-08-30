import { Dispatch, FC, SetStateAction, useState } from "react";
import { TConductor } from "../../../../types/TypesRegistros.types";
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import useDarkMode from "../../../../hooks/useDarkMode";
import {format} from '@formkit/tempo'
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import FieldWrap from "../../../../components/form/FieldWrap";
import Icon from "../../../../components/icon/Icon";
import Input from "../../../../components/form/Input";
import ModalForm from "../../../../components/ModalForm.modal";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../../components/ui/Card";
import Badge from "../../../../components/ui/Badge";
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template";
import { HeroEye, HeroPencilSquare, HeroXMark } from "../../../../components/icon/heroicons";
import Tooltip from "../../../../components/ui/Tooltip";
import { deleteConductor } from "../../../../redux/slices/conductoresSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import DetalleConductor from "../DetalleConductor";
import FormularioRegistroChoferes from "../Formularios/RegistroConductor";
import { useAuth } from "../../../../context/authContext";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../components/ui/Button";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";


const columnHelper = createColumnHelper<TConductor>();



interface IConductorProps {
	data: TConductor[] | []
}


const TablaConductor: FC<IConductorProps> = ({ data }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { isDarkTheme } = useDarkMode();
	const { verificarToken } = useAuth()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);


	const columns = [
		columnHelper.accessor('rut', {
			cell: (info) => (
				<div className='font-bold'>
					{
						info.row.original.rut
							? <span>{`${info.row.original.rut}`}</span>
							: <span>No hay registros aún</span>
					}
				</div>

			),
			header: 'Rut',
		}),
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold'>
					{
						info.row.original.nombre
							? <span>{`${info.row.original.nombre}`}</span>
							: <span>No hay registros aún</span>
					}
				</div>

			),
			header: 'Nombre',
		}),
		columnHelper.accessor('apellido', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{
						info.row.original.apellido
							? <span>{`${info.row.original.apellido}`}</span>
							: <span>No hay registros aún</span>
					}
				</div>
			),
			header: 'Apellido',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold'>
					{
						info.row.original.telefono
							? <span>{`${info.row.original.telefono}`}</span>
							: <span>No hay registros aún</span>
					}
				</div>

			),
			header: 'Telefono',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>
					{`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short' })}`}
				</div>

			),
			header: 'Fecha Creación',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [detalleModalStatus, setDetalleModalStatus] = useState(false)
				const [selectedId, setSelectedId] = useState<number>(0);
				const [deleteModalStatus, setDeleteModalStatus] = useState(false);
				const confirmDelete = (id: number) => {
					dispatch(deleteConductor({ id, token, verificar_token: verificarToken }));
					setDeleteModalStatus(false); 
				  };

				return (
					<div className='h-full w-full flex gap-2 flex-wrap justify-center'>
						<ModalForm
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Chofer'
							variant='solid'
							color="blue"
							colorIntensity="700"
							size={700}
							width={`hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							
							<DetalleConductor id={id} setOpen={setDetalleModalStatus}/>
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
									message="¿Estás seguro de que deseas eliminar este conductor?"
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
		<PageWrapper name='Lista Choferes'>
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
							placeholder='Busca al Chofer...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalForm
						open={modalStatus}
						setOpen={setModalStatus}
						title='Registro Choferes'
						variant='solid'
						textButton='Agregar Chofer'
						width={`w-full h-11 px-5 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'}`}
						size={900}
					>

						<FormularioRegistroChoferes setOpen={setModalStatus} />
					</ModalForm>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className="w-full">
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Choferes</CardTitle>
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

export default TablaConductor;
