import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { RootState } from "../../../redux/store";
import { useAuth } from "../../../context/authContext";
import {optionsBodegasB, optionsCalibres, optionsCalidad, optionsVariedad } from "../../../utils/options.constantes";
import SelectReact from "../../../components/form/SelectReact";
import Label from "../../../components/form/Label";
import { SubheaderRight } from "../../../components/layouts/Subheader/Subheader";
import FieldWrap from "../../../components/form/FieldWrap";
import Icon from "../../../components/icon/Icon";
import Input from "../../../components/form/Input";
import Container from "../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader } from "../../../components/ui/Card"
import TableTemplate, { TableCardFooterTemplate, TableColumn } from "../../../templates/common/TableParts.template";
import { GUARDAR_BIN_SELECCIONADO_PARA_PEDIDO, LIMPIAR_BIN_SELECCIONADO_PARA_PEDIDO, QUITAR_BIN_DE_FRUTA_PARA_PEDIDO, fetchBinBodega, fetchPDFBodegas } from "../../../redux/slices/bodegaSlice";
import { TBinBodega } from "../../../types/TypesSeleccion.type";
import Tooltip from "../../../components/ui/Tooltip";
import Button from "../../../components/ui/Button";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { HeroPlus, HeroXMark } from "../../../components/icon/heroicons";

interface IBodegaG4Props {
	setFruta: Dispatch<SetStateAction<number | null>>
}


const TablaBodegasUnidas: FC<IBodegaG4Props> = ({ setFruta }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()
	const bodegasunidas = useAppSelector((state: RootState) => state.bodegas.bins_para_fruta_en_pedido)
	const bins_seleccionados = useAppSelector((state: RootState) => state.bodegas.bins_seleccionados_en_fruta_pedido)
	const [filtroBodega, setFiltroBodega] = useState<string>('')


	useEffect(() => {
		dispatch(fetchBinBodega({ params: { search: !filtroBodega ? 'g1,g2,g3,g4,g5,g6,g7' : filtroBodega }, token, verificar_token: verificarToken }));
	}, [filtroBodega])

	useEffect(() => {
		dispatch(LIMPIAR_BIN_SELECCIONADO_PARA_PEDIDO())
	}, [])

 
	
	const columnHelper = createColumnHelper<TBinBodega>();
	const columns = [
		columnHelper.accessor('binbodega', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.binbodega}`}
				</div>
			),
			header: 'Cod. Tarja'
		}),
		columnHelper.accessor('programa', {
			cell: (info) => (
				<Tooltip text={info.row.original.tipo_binbodega} className="bg-black text-white text-xl">
					<div className='font-bold '>
						{`${info.row.original.programa}`}
						</div>
				</Tooltip>
			),
			header: 'Resultante del Proceso',
		}),
		columnHelper.display({
			id: 'cc_tarja',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.calibrado}`}
				</div>
			),
			header: '¿CC Tarja?',
		}),
		columnHelper.accessor('fumigado',{
			id: 'fumigado',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.fumigado}`}
				</div>

			),
			header: '¿Fumigado?',
		}),
		columnHelper.accessor('kilos_bin', {
			id: 'kilos_bin',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.kilos_bin}`}
				</div>

			),
			header: 'Fruta Neta',
		}),
		columnHelper.accessor('variedad', {
			id: 'variedad',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.variedad}`}
				</div>

			),
			header: 'Variedad',
		}),
		columnHelper.display({
			id: 'calibre',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.calibre}`}
				</div>

			),
			header: 'Calibre',
		}),
		columnHelper.display({
			id: 'calidad',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.calidad}`}
				</div>

			),
			header: 'Calidad',
		}),
		columnHelper.display({
			id: 'Acciones',
			cell: (info) => {
				const isSelected = bins_seleccionados.some(bin => bin.id === info.row.original.id);
				return(
					<div className='w-full flex items-center justify-center flex-wrap'>
						{isSelected ? (
							<Button
								variant="solid"
								color="red"
								colorIntensity="700"
								onClick={() => {
									dispatch(QUITAR_BIN_DE_FRUTA_PARA_PEDIDO(info.row.original.id));
								}}
							>
								<HeroXMark style={{ fontSize: 25 }} />
							</Button>
						) : bins_seleccionados.length === 0 ? (
							<Button
								variant="solid"
								color="emerald"
								colorIntensity="700"
								onClick={() => {
									dispatch(GUARDAR_BIN_SELECCIONADO_PARA_PEDIDO(info.row.original))
									setFruta(info.row.original.id)
								}}
							>
								<HeroPlus style={{ fontSize: 25 }} />
							</Button>
						) : null}
						</div>
				)},
			header: 'Acciones',
		}),
	];


	const columnas: TableColumn[] = [
    { id: 'binbodega', header: '', className: 'w-32'},
    { id: 'programa', header: '', className: 'w-32'},
    { id: 'fumigado', header: '', className: 'w-28 text-start' },
    { id: 'cc_tarja', header: '', className: 'w-24' },
    { id: 'kilos_bin', header: '', className: 'w-32 text-center' },
    { id: 'calidad', header: '', className: 'w-38' },
    { id: 'calibre', header: '', className: 'w-38' },
	{ id: 'variedad', header: '',className: 'w-24'},
  ]

	



	const table = useReactTable({
		data: bodegasunidas,
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


	const kilos_totales_bodega = (table.getFilteredRowModel().rows.reduce((acc, bodega) => bodega.original.kilos_bin + acc, 0) ?? 0).toLocaleString()

	return (
		<Container breakpoint={null} className={`w-full md:overflow-x-scroll py-1`}>
				<div className="flex justify-between">
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
							placeholder='Busca la fruta en bin...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
					<SubheaderRight>
						<div className="w-full flex items-center justify-around bg-emerald-700 py-2 gap-10 rounded-md px-10">
							<span className="text-xl text-white">Kilos Disponibles: </span>
							<span className="text-xl text-white">{kilos_totales_bodega}</span>
						</div>
					</SubheaderRight>
				</div>
				<Card className='h-full w-full py-0'>
					<CardHeader className="flex items-center flex-wrap">
						<div className='w-full flex gap-5'>
							<div className="w-full flex-col">
								<Label htmlFor="bodega">Bodegas: </Label>
								<SelectReact
									options={[{ value: '', label: 'Selecciona una bodega' }, ...optionsBodegasB]}
									id='bodega'
									placeholder='Seleccione una bodega'
									name='bodega'
									className='py-2'
									onChange={(value: any) => {
										if (value.value === ''){
											setGlobalFilter('')
											setFiltroBodega('')
										} else {
											setFiltroBodega(value.value)
										}
									}}
								/>
							</div>
							<div className="w-full flex-col">
								<Label htmlFor="calle">Variedad: </Label>
								<SelectReact
										options={[{ value: '', label: 'Selecciona una variedad' }, ...optionsVariedad]}
										id='productor'
										placeholder='Variedad'
										name='productor'
										className='w-full h-14 py-2'
										onChange={(selectedOption: any) => {
											if (selectedOption && selectedOption.value === '') {
												setGlobalFilter('')
											} else {
												setGlobalFilter(selectedOption.label);
											}
										}}
									/>
							</div>

							<div className="w-full flex-col">
								<Label htmlFor="calle">Calibre: </Label>
								<SelectReact
									options={[{ value: '', label: 'Selecciona un calibre' }, ...optionsCalibres]}
									id='variedad'
									placeholder='Calibre'
									name='Variedad'
									className='w-full h-14 py-2'
									onChange={(selectedOption: any) => {
										if (selectedOption && selectedOption.value === '') {
											setGlobalFilter('')
										} else {
											setGlobalFilter(selectedOption.label);
										}
									}}
								/>
							</div>

							<div className="w-full flex-col">
								<Label htmlFor="calle">Calidad: </Label>
								<SelectReact
									options={[{ value: '', label: 'Selecciona una calidad' }, ...optionsCalidad]}
									id='variedad'
									placeholder='Calidad'
									name='Variedad'
									className='w-full h-14 py-2'
									onChange={(selectedOption: any) => {
										if (selectedOption && selectedOption.value === '') {
											setGlobalFilter('')
										} else {
											setGlobalFilter(selectedOption.label);
										}
									}}
								/>
							</div>

							{/* <div className="w-full flex-col">
								<Label htmlFor="calle">Calle Bodega: </Label>
								<SelectReact
									options={[{ value: '', label: 'Selecciona una calle' }, ...optionCalleBodega.slice(0,14)]}
									id='variedad'
									placeholder='Calle'
									name='Variedad'
									className='w-full h-14 py-2'
									onChange={(selectedOption: any) => {
										if (selectedOption && selectedOption.value === '') {
											setGlobalFilter('')
										} else {
											setGlobalFilter(selectedOption.label);
										}
									}}
								/>
							</div> */}

						</div>
					</CardHeader>
					{/* <CardHeader>
						<CardHeaderChild>
							<CardTitle>Bodegas</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>
					</CardHeader> */}
					<CardBody className='w-full flex overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
		</Container>
	);
};

export default TablaBodegasUnidas;
