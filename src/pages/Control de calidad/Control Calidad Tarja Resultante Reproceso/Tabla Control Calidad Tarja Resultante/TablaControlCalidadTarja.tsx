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
import { Link, useLocation } from 'react-router-dom';
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
	SubheaderRight,
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import { format } from "@formkit/tempo"
import ModalRegistro from '../../../../components/ModalForm.modal';
import useDarkMode from '../../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../../components/icon/heroicons';
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { TControlCalidadTarja } from '../../../../types/TypesControlCalidad.type';
import { variedadFilter } from '../../../../utils/options.constantes';
import { GiTestTubes } from 'react-icons/gi';
import Tooltip from '../../../../components/ui/Tooltip';
import ModalForm from '../../../../components/ModalForm.modal';
import FormularioControlCalidadTarjaReproceso from '../../../Produccion/Programa Programa Reproceso/Formularios/FormularioControlCalidadTarjaReproceso';
import { fetchCalibracionTarjasReproceso } from '../../../../redux/slices/controlcalidadSlice';
import { useAuth } from '../../../../context/authContext';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

const columnHelper = createColumnHelper<TControlCalidadTarja>();




interface IControlProps {
	data: TControlCalidadTarja[] | []
}

const TablaControlCalidadTarja: FC<IControlProps> = ({ data }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const [detalleModalStatus, setDetalleModalStatus] = useState<boolean>(false);
	const { isDarkTheme } = useDarkMode()
	const { pathname } = useLocation()
	const { verificarToken } = useAuth()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const [refresh, setRefresh] = useState<boolean>(false)
	
	useEffect(() => {
		dispatch(fetchCalibracionTarjasReproceso({ token, verificar_token: verificarToken }))
	}, [refresh])

// 	const asisteDelete = async (id: number) => {
// 		const base_url = process.env.VITE_BASE_URL
// 		const response = await fetch(`${base_url}/api/envasesmp/${id}/`, {
// 			method: 'DELETE',
// 		})
// 		if (response.ok) {
// 			// refresh(true)
// 		} else {
// 			console.log("nop no lo logre")
// 		}
// 	}

// 	const updateEstadoLote = async (id: number, estado: string, setOpen: Dispatch<SetStateAction<boolean>>) => {
//     const res = await fetch(`/api/estado-update/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}` 
//       },
//       body: JSON.stringify({  
//         estado_recepcion: estado
//       })
//     });

//     if (res.ok) {
// 			setOpen(false)
// 			// refresh(true)

//     } else {
//       console.log("Errores sobre errores");
//     }
//   }

	const columns = [
		columnHelper.display({
			id: 'tarja',
			cell: (info) => (
				<div className='font-bold text-center '>{`${info.row.original.tarja}`}</div>
			),
			header: 'N° Tarja',
		}),
		columnHelper.display({
			id: 'codigo_tarja',
			cell: (info) => (
				<div className='font-bold text-center '>{`${info.row.original.codigo_tarja}`}</div>
			),
			header: 'Código Tarja',
		}),
		columnHelper.display({
			id: 'variedad',
			cell: (info) => {
				const variedad = info.row.original.variedad;
				const variedadLabel = variedad ? variedadFilter.find(variety => variety.value === variedad)?.label : 'No disponible';
				return <div className='font-bold text-center'>{variedadLabel ? variedadLabel : 'No disponible'}</div>;
			},
			header: 'Variedad',
		}),
		columnHelper.display({
			id: 'estado',
			cell: (info) => (
				<div className='font-bold text-center'>{`${info.row.original.estado_cc_label}`}</div>
			),
			header: 'Estado',
		}),
		columnHelper.display({
			id: 'fecha_creacion',
			cell: (info) => (
				<div className='font-bold text-center'>{`${format(info.row.original.fecha_creacion, {date: 'long', time: 'short'}, 'es')}`}</div>
			),
			header: 'Fecha Creación',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {

				const id = info.row.original.id;
				const [edicionModalStatus, setEdicionModalStatus] = useState<boolean>(false);
				const [calibracionModalStatus, setCalibracionModalStatus] = useState<boolean>(false);

				return (
					<div className='h-full w-full flex justify-center gap-2 flex-wrap'>
						<Link to={`/cdc/cpro/tarjas-cc-reproceso/${info.row.original.tarja}`} state={{ pathname: pathname }}
							className={`w-16 px-1 h-12 
								${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'}
								 hover:scale-105 rounded-md flex items-center justify-center`}>
							<HeroEye style={{ fontSize: 32 }} />
						</Link>

						{
							(('controlcalidad') in userGroup?.groups!) && info.row.original.estado_cc !== '3'
								? (
									<ModalForm
											open={calibracionModalStatus}
											setOpen={setCalibracionModalStatus}
											title='Calibración Tarja Reproceso'
											textTool='Calibrar Tarja Reproceso'
											size={900}
											width={`w-16 h-12 dark:bg-[#7124b5] dark:hover:bg-[#8647bc] bg-[#7124b5] hover:bg-[#8647bc] text-white hover:scale-105`}
											icon={<GiTestTubes style={{ fontSize: 25 }}
											/>}
										>
											{/* hola */}
											<FormularioControlCalidadTarjaReproceso refresh={refresh} setRefresh={setRefresh} isOpen={setCalibracionModalStatus} id_lote={id} tipo_resultante={info.row.original.tipo_resultante_label} />
										</ModalForm>
									)
								: null
						}

						{/* {
							hasGroup(['controlcalidad'])
								? (
									<Tooltip text='Eliminar'>
										<button onClick={async () => await asisteDelete(id)} type='button' className={`w-16 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
											<HeroXMark style={{ fontSize: 25 }} />
										</button>
									</Tooltip>
									)
								: null
						} */}
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

	
	const columnas: TableColumn[] = [
    { id: 'tarja', header: '', className: 'w-24 lg:w-32 text-center' },
    { id: 'actions', header: '', className: 'lg:w-72' },
  ]


	return (
		<PageWrapper name='Lista Control Calidad Tarjas Reproceso'>
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
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Controles de Calidad Tarjas Reproceso</CardTitle>
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

export default TablaControlCalidadTarja;
