import {FC, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
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
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import { format } from "@formkit/tempo"
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../../components/icon/heroicons';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TCamion } from '../../../../types/TypesRegistros.types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import ModalForm from '../../../../components/ModalForm.modal';
import Tooltip from '../../../../components/ui/Tooltip';
import { deleteCamion } from '../../../../redux/slices/camionesSlice';
import FormularioRegistroCamiones from '../Formularios/RegistroCamiones';
import FormularioEditarCamiones from '../Formularios/EdicionCamiones';
import DetalleCamion from '../DetalleCamiones';
import { useAuth } from '../../../../context/authContext';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../../components/ui/Button';
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
interface ICamionProps {
	data: TCamion[] | []
}


const TablaCamion: FC<ICamionProps> = ({ data }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
	const { isDarkTheme } = useDarkMode();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)

  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);
	

	const { verificarToken } = useAuth()

	const columnHelper = createColumnHelper<TCamion>();

	const columns = [
		columnHelper.accessor('patente', {
			cell: (info) => (
				<div className='font-bold '>
					{
						info.row.original.patente
							? <span>{`${info.row.original.patente}`}</span>
							: <span>No hay registro aún</span>
					}
				</div>
			),
			header: 'Patente',
		}),
		columnHelper.accessor('observaciones', {
			cell: (info) => (
				<div className='font-bold'>
					{
						info.row.original.observaciones
							? <span>{`${info.row.original.observaciones}`}</span>
							: <span>No hay registro aún</span>
					}
				</div>
			),
			header: 'Observaciones',
		}),
		columnHelper.accessor('acoplado', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`}
				</div>
			),
			header: 'acoplado',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>
					{`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short' })}`}
				</div>
			),
			header: 'Fecha creación',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [detalleModalStatus, setDetalleModalStatus] = useState(false);
				const [deleteModalOpen, setDeleteModalOpen] = useState(false);
				const [selectedId, setSelectedId] = useState<number | null>(null);

				const confirmDelete = (id: number) => {
					setDeleteModalOpen(false);
					dispatch(deleteCamion({ id, token, verificar_token: verificarToken }));
				  };

				return (
					<div className='h-full w-full flex gap-2 flex-wrap justify-center'>
						<ModalForm
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Camión'
							variant='solid'
							color='blue'
							colorIntensity='700'
							width={`hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleCamion id={id} setOpen={setDetalleModalStatus}/>
						</ModalForm>


						{
							hasGroup(['registros-admin']) ? (
								<Button
								variant="solid"
								color="red"
								colorIntensity="700"
								onClick={() => {
									setSelectedId(id); // Establece el ID del camión a eliminar
									setDeleteModalOpen(true); // Abre el modal de confirmación
								}}
								>
								<HeroXMark style={{ fontSize: 25 }} />
								</Button>
							) : null
							}

							<DeleteConfirmationModal
								isOpen={deleteModalOpen}
								onClose={() => setDeleteModalOpen(false)}
								onConfirm={() => confirmDelete(id)}
								message="¿Estás seguro de que deseas eliminar este camión?"
							/>
					</div>
				);
			},
			header: 'Acciones'
		}),
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
		<PageWrapper name='Lista Camiones'>
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
							placeholder='Busca al camión...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalForm
						open={modalStatus}
						setOpen={setModalStatus}
						variant='solid'
						title='Registro Camiones'
						width={`w-full h-11 px-5 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] hover:bg-[#3b83f6cd] text-white'} hover:scale-105`}
						textButton='Agregar Camión'
					>
						<FormularioRegistroCamiones setOpen={setModalStatus} />
					</ModalForm>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full'>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Camiones</CardTitle>
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
					<TableCardFooterTemplate table={table} className='mt-2 mb-10' />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaCamion;
