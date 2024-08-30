import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { TControlCalidadBinResultantePlantaHarina, TControlCalidadBinResultanteProcesoPlantaHarina } from '../../../types/typesPlantaHarina';
import { format } from '@formkit/tempo';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { HeroEye } from '../../../components/icon/heroicons';
import ModalForm from '../../../components/ModalForm.modal';
import { GiTestTubes } from 'react-icons/gi';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../templates/common/TableParts.template';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft } from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { fetchCCBinesResultantePlantaHarina } from '../../../redux/slices/plantaHarinaSlice';
import { useAuth } from '../../../context/authContext';
import FormularioCCBinResultantePlantaHarina from '../../Planta Harina/Programa Planta Harina/Formularios/FormularioCCBinResultantePlantaHarina';
import { fetchCCBinesResultanteProcesoPlantaHarina } from '../../../redux/slices/procesoPlantaHarina';
import DetalleControlCalidadBinResultanteProcesoPlantaHarina from './DetalleControlCalidadBinResultanteProcesoPlantaHarina';

const TablaControlCalidadBinResultanteProcesoPlantaHarina = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const [detalleModalStatus, setDetalleModalStatus] = useState<boolean>(false)
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);

  const navigate = useNavigate()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const cc_bin_resultante_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.controles_calidad_bin_resultante_proceso_planta_harina)
	const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchCCBinesResultanteProcesoPlantaHarina({ token, verificar_token: verificarToken }))
  }, [])

  const columnHelper = createColumnHelper<TControlCalidadBinResultanteProcesoPlantaHarina>();

	const columns = [
		columnHelper.display({
			id: 'bin_resultante',
			cell: (info) => (
				<div className='font-bold text-center '>{`${info.row.original.bin_resultante}`}</div>
			),
			header: 'N° Bin',
		}),
		columnHelper.display({
			id: 'codigo_tarja',
			cell: (info) => (
				<div className='font-bold text-center '>{`${info.row.original.codigo_tarja}`}</div>
			),
			header: 'Código Tarja',
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
				const [calibracionModalStatus, setCalibracionModalStatus] = useState<boolean>(false);
				const [detalleCCBin, setDetalleCCBin] = useState<boolean>(false);

				return (
					<div className='h-full w-full flex justify-center gap-2 flex-wrap'>
						<ModalForm
							variant='solid'
							color='blue'
							colorIntensity='700'
							open={detalleCCBin}
							setOpen={setDetalleCCBin}
							width={`text-white hover:scale-105`}
							title='Detalle Control Calidad Bin Resultante Proceso Planta Harina'
							icon={<HeroEye style={{ fontSize: 25 }} />}
							>
							<DetalleControlCalidadBinResultanteProcesoPlantaHarina id_bin={info.row.original.bin_resultante}/>
						</ModalForm>
						{ hasGroup(['controlcalidad']) && info.row.original.estado_control !== '1'? (
							<ModalForm
								open={calibracionModalStatus}
								setOpen={setCalibracionModalStatus}
								title='Calibración Bin Resultante'
								color='violet'
								variant='solid'
								colorIntensity='700'
								textTool='Calibrar Bin Resultante'
								width={`text-white hover:scale-105`}
								icon={<GiTestTubes style={{ fontSize: 25 }}/>}
							>
								<FormularioCCBinResultantePlantaHarina id_bin={info.row.original.bin_resultante} setOpen={setCalibracionModalStatus}/>
							</ModalForm>
						) : null }
					</div>
				);
			},
			header: 'Acciones'
		}),
	];

	const table = useReactTable({
		data: cc_bin_resultante_proceso_planta_harina,
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
		<PageWrapper name='Lista Control Calidad Bin Proceso Planta Harina'>
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
							<CardTitle>Controles de Calidad Bin Resultante Proceso Planta Harina</CardTitle>
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
}

export default TablaControlCalidadBinResultanteProcesoPlantaHarina
