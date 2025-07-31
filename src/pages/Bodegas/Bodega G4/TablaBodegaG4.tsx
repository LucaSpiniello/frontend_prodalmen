import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import useDarkMode from "../../../hooks/useDarkMode";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchWithTokenPatch, fetchWithTokenPut, fetchWithTokenPost , fetchWithTokenDelete, fetchWithTokenDeleteAction} from "../../../utils/peticiones.utils";
import { Row, SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { RootState } from "../../../redux/store";
import { useAuth } from "../../../context/authContext";
import toast from "react-hot-toast";
import ModalForm from "../../../components/ModalForm.modal";
import { optionCalleBodega, optionsCalibres, optionsCalidad, optionsVariedad } from "../../../utils/options.constantes";
import SelectReact from "../../../components/form/SelectReact";
import Label from "../../../components/form/Label";
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../components/layouts/Subheader/Subheader";
import FieldWrap from "../../../components/form/FieldWrap";
import Icon from "../../../components/icon/Icon";
import Input from "../../../components/form/Input";
import Container from "../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import TableTemplate, { TableCardFooterTemplate, TableColumn } from "../../../templates/common/TableParts.template";
import { fetchBinBodega, fetchPDFBodegas } from "../../../redux/slices/bodegaSlice";
import { TBinBodega } from "../../../types/TypesSeleccion.type";
import Tooltip from "../../../components/ui/Tooltip";
import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from 'xlsx'
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { set } from "lodash";

interface IBodegaG4Props {
	data: TBinBodega[] | []
	refresco: boolean
	setRefresco: Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<TBinBodega>();

const TablaBodegaG4: FC<IBodegaG4Props> = ({ data, refresco, setRefresco }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<any>({
		variedad: '',
		calibre: '',
		calidad: '',
		calle: '',
		codigo_tarja: ''
	})
	const [codigoTarjaInput, setCodigoTarjaInput] = useState('')
	const [filteredData, setFilteredData] = useState<TBinBodega[]>(data)

	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()

	// Actualizar filteredData cuando cambie data
	useEffect(() => {
		setFilteredData(data)
	}, [data])

	const exportToExcel = (data: Row<TBinBodega>[]) => {
		const filteredInfomation = data.map(({ original }) => ({
			"Código Tarja": original.binbodega,
			"Programa": original.programa,
			"¿Calibrado?": original.calibrado,
			"¿Fumigado?": original.fumigado,
			"Kilos Fruta": original.kilos_bin,
			"Calidad": original.calidad,
			"Variedad": original.variedad,
			"Calibre": original.calibre,
			"Calle": original.calle,
			"Comercializador ": original.comercializador,
		}))

		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(filteredInfomation)
		XLSX.utils.book_append_sheet(wb, ws, 'Bodega G4')
		XLSX.writeFile(wb, 'bodega_g4.xlsx')

	}
	

	const actualizacionCalle = async (codigo_tarja: string, value: string, tipo_binbodega_id: number, id_tarja?: number) => {
		try {
			const token_verificado = await verificarToken(token!)
		
			if (!token_verificado) throw new Error('Token no verificado')
			
			const response = await fetchWithTokenPatch(`api/bin-bodega/bodegas_update/`,
				{
					id_tarja: id_tarja,
					codigo_tarja: codigo_tarja,
					tipo_bodega: tipo_binbodega_id, 
					calle: value
				},
				token_verificado
			)
			
			if (response.ok){
				toast.success(`Calle cambiada correctamente!`)
				//@ts-ignore
				// dispatch(fetchBinBodega({ params: { search: 'g4' }, token, verificar_token: verificarToken }))
				setRefresco(!refresco)
			} else if (response.status === 400) {
				const errorData = await response.json()
				toast.error(`${Object.entries(errorData)}`)
			}
		} catch (error) {
			console.log('Error al cambiar la calle')
		}
	}

	const eliminarTarja = async (seleccion: string, codigo_tarja: string) => {
		try {
			const token_verificado = await verificarToken(token!)
		
			if (!token_verificado) throw new Error('Token no verificado')
			// Extract number from "Programa Selección N° X" format
			const seleccionNumber = seleccion.match(/\d+/)?.[0]
			if (!seleccionNumber) {
				throw new Error('No se pudo extraer el número del programa de selección')
			}
			seleccion = seleccionNumber
			
			const response = await fetchWithTokenDeleteAction(`api/seleccion/${seleccion}/tarjaseleccionada/eliminar_tarja_completa`, {codigo_tarja: codigo_tarja}, token_verificado)
			if (response.ok){
				toast.success(`Tarja eliminada correctamente!`)
				setRefresco(!refresco)
			} else if (response.status === 400) {
				const errorData = await response.json()
				toast.error(`${Object.entries(errorData)}`)
			} else {
				toast.error('Error al eliminar la tarja')
			}
		} catch (error) {
			console.log('Error al eliminar la tarja')
			toast.error('Error al eliminar la tarja')
		}
	} 
 
 


	const columns : any = [
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
				// <Tooltip text={info.row.original.tipo_bodega} className="bg-black text-white text-xl">
					<div className='font-bold '>
						{`${info.row.original.programa_produccion}`}
						</div>
				// </Tooltip>
			),
			header: 'Resultante del Proceso',
		}),
		columnHelper.accessor('programa', {
			cell: (info) => (
				// <Tooltip text={info.row.original.tipo_bodega} className="bg-black text-white text-xl">
					<div className='font-bold '>
						{`${info.row.original.programa}`}
						</div>
				// </Tooltip>
			),
			header: 'Resultante del Proceso',
		}),
		columnHelper.accessor('comercializador', {
			cell: (info) => (
				// <Tooltip text={info.row.original.tipo_bodega} className="bg-black text-white text-xl">
					<div className='font-bold '>
						{`${info.row.original.comercializador}`}
						</div>
				// </Tooltip>
			),
			header: 'Comercializador',
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
		columnHelper.display({
			id: 'fumigado',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.fumigado}`}
				</div>

			),
			header: '¿Fumigado?',
		}),
		columnHelper.accessor('kilos_bin', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.kilos_bin}`}
				</div>

			),
			header: 'Fruta Neta',
		}),
		columnHelper.accessor('variedad', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.variedad}`}
				</div>

			),
			header: 'Variedad',
		}),
		columnHelper.accessor(
			'calibre',
			{
				cell: (info) => (
					<div className='font-bold'>
						{`${info.row.original.calibre}`}
					</div>
				),
				header: 'Calibre',
			}
			),
		columnHelper.accessor('calidad', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.calidad}`}
				</div>

			),
			header: 'Calidad',
		}
		),
		columnHelper.accessor('tipo_producto', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.tipo_producto}`}
				</div>

			),
			header: 'Producto',
		}),
		columnHelper.accessor('calle', {
			cell: (info) => {
			const [calleModal, setCalleModal] = useState(false)

				return(
					<div className='w-full'>
						<ModalForm
							title={`Cambio de Calle Tarja ${info.row.original.id}`}
							variant="solid"
							open={calleModal}
							setOpen={setCalleModal}
							width="w-full"
							textButton={optionCalleBodega.find(calle => calle?.label === info.row.original.calle)?.label}
							>
							<div className="w-full flex flex-col items-center">
								<Label htmlFor="calle">Calle Bodega: </Label>
								<div className="w-full">
									<SelectReact
										options={optionCalleBodega}
										id='calle_bodega'
										placeholder='Calle'
										name='calle_bodega'
										className='w-full h-14 py-2'
										value={optionCalleBodega.find(calle => calle?.label === info.row.original.calle)}
										onChange={(value: any) => {
											actualizacionCalle(info.row.original.binbodega, value.value, info.row.original.tipo_binbodega_id, info.row.original.id_binbodega)
										}}
									/>
								</div>
							</div>
						</ModalForm>
					</div>
			)},
			header: 'Calle Bodega',
		}),
		columnHelper.display({
			id: 'acciones',
			cell: (info) => {
				const [deleteModal, setDeleteModal] = useState(false)

				return (
					<div className='w-full flex justify-center'>
						<ModalForm
							title="Confirmar Eliminación"
							variant="solid"
							open={deleteModal}
							setOpen={setDeleteModal}
							width="w-96"
							textButton="Eliminar"
							color="red"
							colorIntensity="600"
						>
							<div className="w-full flex flex-col items-center gap-4">
								<div className="text-center">
									<p className="text-lg font-semibold mb-2">¿Está seguro que desea eliminar esta tarja?</p>
									<p className="text-gray-600">Código: <span className="font-bold">{info.row.original.binbodega}</span></p>
									<p className="text-gray-600">Esta acción no se puede deshacer.</p>
								</div>
								<div className="flex gap-3">
									<Button
										variant="outline"
										onClick={() => setDeleteModal(false)}
										className="border-gray-300 hover:bg-gray-50"
									>
										Cancelar
									</Button>
									<Button
										variant="solid"
										onClick={() => {
											eliminarTarja(info.row.original.programa, info.row.original.binbodega)
											setDeleteModal(false)
										}}
										className="bg-red-600 hover:bg-red-500 border border-red-600 hover:border-red-500"
									>
										Confirmar Eliminación
									</Button>
								</div>
							</div>
						</ModalForm>
					</div>
				)
			},
			header: 'Acciones',
		}),
	];


// 	const columnas: TableColumn[] = [
//     { id: 'codigo_tarja', header: '', className: 'w-24 lg:w-32 text-center' },
//     { id: 'seleccion', header: '', className: 'lg:w-56 text-center ' },
//     { id: 'fumigado', header: '', className: 'lg:w-40 text-center ' },
//     { id: 'cc_tarja', header: '', className: 'lg:w-40 text-center ' },
//     { id: 'kilos_fruta', header: '', className: 'lg:w-48 text-center' },
//     { id: 'calibre', header: '', className: 'lg:w-48 text-center' },
// 	{ id: 'variedad', header: '',className: 'lg:w-48 text-center'},
// 	{id: 'tipo_producto', header: '', className: 'w-48 text-center'},
// 	{id: 'calle', header: '', className: 'w-40 text-center'},
// 		// { id: 'rendimientos', header: '',className: 'w-56 md:w-48 lg:w-auto'},
// 		// { id: 'controles', header: '',className: 'md:w-28 lg:w-40'},
//   ]

// filtered data by the filed estado_binbodega 

const table = useReactTable({
	data: filteredData,
  	columns,
  	state: {
    globalFilter,
  	},
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: { pageSize: 5 },
  },
  globalFilterFn: (row, filterValue : any) => {
    // Desestructuramos los filtros de globalFilter
    const { productor, variedad, calibre, calidad, calle, codigo_tarja } = filterValue;

    // Aplicamos los filtros solo si tienen valor
    return (
      (!calle || row.original.calle === calle) &&
      (!variedad || row.original.variedad === variedad) &&
      (!calibre || row.original.calibre === calibre) &&
      (!calidad || row.original.calidad === calidad) &&
      (!codigo_tarja || row.original.binbodega.toLowerCase().includes(codigo_tarja.toLowerCase()))
    );
  },
});


	const kilos_totales_bodega = (table.getFilteredRowModel().rows.reduce((acc, bodega) => bodega.original.kilos_bin + acc, 0) ?? 0).toLocaleString()


	// const pdf_bodegag4 = useAppSelector((state: RootState) => state.bodegas.pdf_bodegas)

	// useEffect(() => {
	// 	//@ts-ignore
	// 	dispatch(fetchPDFBodegas({ params: { search: 'g4'} ,token, verificar_token: verificarToken }))
	// }, [])


	return (
		<PageWrapper name='Lista Bodega G4' isProtectedRoute={true}>
			<Subheader>
				{/* <SubheaderLeft>
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
							onChange={(e) => setGlobalFilter((prev : any) => {
								return { ...prev, productor: e.target.value }
							})}
						/>
					</FieldWrap>
				</SubheaderLeft> */}
				<SubheaderRight>
					<div className="w-full flex items-center justify-around bg-emerald-700 py-2 gap-10 rounded-md px-10">
						<span className="text-xl text-white">Kilos Disponibles: </span>
						<span className="text-xl text-white">{kilos_totales_bodega}</span>
					</div>
				</SubheaderRight>
				
			</Subheader>
			<Container breakpoint={null} className={`w-full md:overflow-x-scroll py-1`}>
				<Card className='h-full w-full py-0'>
				<CardHeader className="flex items-center flex-wrap">
						<div className='w-full flex gap-8'>
                
                <div className="flex-shrink-0 flex-col" style={{minWidth: '400px', width: '400px'}}>
                  <Label htmlFor="codigo_tarja">Código Tarja: </Label>
                  <div className="flex gap-2">
                    <Input
                      id='codigo_tarja'
                      name='codigo_tarja'
                      placeholder='Ingrese código de tarja...'
                      value={codigoTarjaInput}
                      onChange={(e) => setCodigoTarjaInput(e.target.value)}
                      className='flex-1 h-14 py-2'
                      style={{minWidth: '250px'}}
                    />
                    <Button
                      variant="solid"
                      onClick={() => {
                        if (codigoTarjaInput.trim() === '') {
                          setFilteredData(data)
                        } else {
                          const filtered = data.filter((item: TBinBodega) => 
                            item.binbodega.toLowerCase().includes(codigoTarjaInput.toLowerCase())
                          )
                          setFilteredData(filtered)
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-500 border border-blue-600 hover:border-blue-500 hover:scale-105 h-14 px-4 whitespace-nowrap flex-shrink-0"
                    >
                      Filtrar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCodigoTarjaInput('')
                        setFilteredData(data)
                      }}
                      className="border-gray-300 hover:bg-gray-50 h-14 px-4 whitespace-nowrap flex-shrink-0"
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>

                <div className="w-full flex-col">
                  <Label htmlFor="calle">Variedad: </Label>
                  <SelectReact
                      options={[{ value: '', label: 'Selecciona una variedad' }, ...optionsVariedad]}
                      id='variedad'                      
					  placeholder='Variedad'
                      name='variedad'
                      className='w-full h-14 py-2'
                      onChange={(selectedOption: any) => {
                        setGlobalFilter((prev : any) => (
							{
								...prev,
								variedad: selectedOption?.label != "Selecciona una variedad" ? selectedOption?.label : ''
							}
						))
                      }}
                    />
                </div>

                <div className="w-full flex-col">
                  <Label htmlFor="calle">Calibre: </Label>
                  <SelectReact
                    options={[{ value: '', label: 'Selecciona un calibre' }, ...optionsCalibres]}
                    id='calibre'
                    placeholder='Calibre'
                    name='calibre'
                    className='w-full h-14 py-2'
                    onChange={(selectedOption: any) => {
						setGlobalFilter((prev : any) => (
							{
								...prev,
								calibre: selectedOption?.label != "Selecciona un calibre" ? selectedOption?.label : ''
							}
						)
						)
                    }}
                  />
                </div>

								<div className="w-full flex-col">
                  <Label htmlFor="calle">Calidad: </Label>
                  <SelectReact
                    options={[{ value: '', label: 'Selecciona una calidad' }, ...optionsCalidad]}
                    id='calidad'
                    placeholder='Calidad'
                    name='calidad'
                    className='w-full h-14 py-2'
                    onChange={(selectedOption: any) => {
						setGlobalFilter((prev : any) => (
							{
								...prev,
								calidad: selectedOption?.label != "Selecciona una calidad" ? selectedOption?.label : ''
							}
						)
						)
                    }}
                  />
                </div>



						</div>
					</CardHeader>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Bodega G4</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>
						<CardHeaderChild>
							<div className="w-full flex gap-5">
								<Button
										variant="solid"
										onClick={() => exportToExcel(table.getFilteredRowModel().rows)}
										className="bg-green-600 hover:bg-green-500 border border-green-600 hover:border-green-500 hover:scale-105"
										>
										<FaFileExcel style={{ fontSize: 20, color: 'white'}}/>
										Exportar archivo CSV
								</Button>
									{/* <Link to='/pdf-bodegas' state={{ pdf: pdf_bodegag4, pathname: '/bodega-g4' }}>
										<Button
											variant="solid" 
											className='flex items-center gap-1.5 bg-red-700 hover:bg-red-600 border border-red-700 hover:border-red-600 hover:scale-105'>
											<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
											<span className='text-md font-semibold'>Generar PDF resumido</span>
										</Button>
									</Link> */}
							</div>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='h-full  overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaBodegaG4;
