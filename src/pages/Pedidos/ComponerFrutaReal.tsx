import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { useAppSelector } from "../../redux/hooks"
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../components/ui/Card"
import TableTemplate, { TableCardFooterTemplate, TableColumn } from "../../templates/common/TableParts.template"
import { useEffect, useState } from "react"
import { fetchContentTypes } from "../../redux/slices/registrosbaseSlice"
import { TFrutaReal } from "../../types/TypesPedidos.types"
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { detallePedidoThunk, listaPPTParaPedido } from "../../redux/slices/pedidoSlice"
import Button from "../../components/ui/Button"
import Modal, { ModalBody, ModalHeader } from "../../components/ui/Modal"
import { listaBinBodegaFiltroThunk } from "../../redux/slices/bodegaSlice"
import { TBinBodega } from "../../types/TypesSeleccion.type"
import Tooltip from "../../components/ui/Tooltip"
import FieldWrap from "../../components/form/FieldWrap"
import Icon from "../../components/icon/Icon"
import Input from "../../components/form/Input"
import { HeroPencil, HeroPlus, HeroXMark } from "../../components/icon/heroicons"
import { fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost } from "../../utils/peticiones.utils"
import toast from "react-hot-toast"
import ModalPPTReal from "./Formularios/ModalPPTReal"
import Label from "../../components/form/Label"
import Validation from "../../components/form/Validation"

const columnHelper = createColumnHelper<TFrutaReal>();
const columnHelperBins = createColumnHelper<TBinBodega>();

function ComponerFrutaReal() {
    const { id } = useParams() 
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const { verificarToken } = useAuth()
    const token = useAppSelector((state) => state.auth.authTokens)
    const { pedido } = useAppSelector((state) => state.pedidos)
    const ct = useAppSelector((state) => state.core.contenttypes)
    const [frutaReal, setFrutaReal] = useState<TFrutaReal[]>([])
    const { bin_bodega } = useAppSelector((state) => state.bodegas)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [sortingBins, setSortingBins] = useState<SortingState>([]);
    const [globalFilterBins, setGlobalFilterBins] = useState<string>('')
    const [modalRegistrarBin, setModalRegistrarBin] = useState<boolean>(false)
    const [ctBin, setCtBin] = useState<number>(0)
    const [ctPPT, setCtPPT] = useState<number>(0)
    const [modalRegistrarPPT, setModalRegistrarPPT] = useState<boolean>(false)

    useEffect(() => {
		if (ct.length < 1){
			dispatch(fetchContentTypes({ token, verificar_token: verificarToken }))	
		} else {
            setCtBin(ct.find(ct => ct.model === 'binbodega')?.id ?? 0)
            setCtPPT(ct.find(ct => ct.model === 'palletproductoterminado')?.id ?? 0)
        }
	}, [ct])

    useEffect(() => {
        if (modalRegistrarPPT) {
            dispatch(listaPPTParaPedido({token, verificar_token: verificarToken}))
        }
    }, [modalRegistrarPPT])

    useEffect(() => {
        if (pedido) {
            setFrutaReal(pedido.frutas)
        } else {
            dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
        }
    }, [pedido])

    useEffect(() => {
        if (modalRegistrarBin) {
            dispatch(listaBinBodegaFiltroThunk({token, verificar_token: verificarToken, filtro: ''}))
        }
    }, [modalRegistrarBin])

    const columns = [
        columnHelper.accessor('codigo_fruta', {
            cell: (info) => (
                <div className='font-bold w-full'>{info.row.original.codigo_fruta}</div>
            ),
            header: 'Codigo'
        }),
        columnHelper.accessor('calidad', {
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.calidad}`}
                </div>
            ),
            header: 'Calidad'
        }),
        columnHelper.accessor('variedad', {
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.variedad}`}
                </div>
            ),
            header: 'Variedad'
        }),
        columnHelper.accessor('calibre', {
            cell: (info) => (
                <div className='font-bold w-full'>{info.row.original.calibre}</div>
            ),
            header: 'Calibre'
        }),
        columnHelper.accessor('tipo_fruta_en_pedido', {
            cell: (info) => (
                <div className='font-bold w-full'>{info.row.original.tipo_fruta_en_pedido}</div>
            ),
            header: 'Formato'
        }),
        columnHelper.accessor('kilos', {
            cell: (info) => (
                <div className='font-bold w-full'>{info.row.original.tipo_fruta_en_pedido === 'Pepa En Bin' ? `${info.row.original.kilos} Kgs` : `${info.row.original.cantidad} Kgs`}</div>
            ),
            header: 'Kilos'
        }),
        columnHelper.display({
            id: 'acciones',
            cell: (info) => {
                const [modalEditarFrutaReal, setModalEditarFrutaReal] = useState<boolean>(false)
                const [peso, setPeso] = useState<number>()
                const [cantidadCajas, setCantidadCajas] = useState<number>(info.row.original.cantidad / (info.row.original.peso_caja ? info.row.original.peso_caja : 1))
                return  (
                    <div className="font-bold flex">
                        { pedido && pedido.estado_pedido === '2' && (
                            <>
                                <Button
                                    variant="solid"
                                    color="red"
                                    onClick={ async () => {
                                        try {
                                            const token_validado = await verificarToken(token)
                                            if (!token_validado) throw new Error('El token no es valido')
                                                const res = await fetchWithTokenDelete(`api/pedidos/${id}/frutas/${info.row.original.id}`, token_validado)
                                            if (res.ok){
                                                toast.success('Fruta Eliminada del Pedido')
                                                dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                                            } else if (res.status === 400) {
                                                toast.error('Error al ingresar PPT')
                                            }
                                        } catch (error: any) {
                                            toast.error('Error al ingresar PPT')
                                        }
                                    }}
                                ><HeroXMark style={{ fontSize: 25 }} /></Button>
                                { info.row.original.tipo_fruta_en_pedido === 'Pallet Producto Terminado' && (
                                    <>
                                        <Button
                                            variant="solid"
                                            color="blue"
                                            className="ml-2"
                                            onClick={() => {setModalEditarFrutaReal(true)}}
                                        ><HeroPencil style={{ fontSize: 25 }} /></Button>
                                        <Modal
                                            isOpen={modalEditarFrutaReal}
                                            setIsOpen={setModalEditarFrutaReal}
                                        >
                                            <ModalHeader>Editar Fruta</ModalHeader>
                                            <ModalBody>
                                                <div className="grid grid-cols-12">
                                                    <div className="w-full col-span-6">
                                                        <Label htmlFor={"cantidad"}>Cantidad de Cajas</Label>
                                                        <Input
                                                            type="number"
                                                            id="cantidad"
                                                            name="cantidad"
                                                            value={cantidadCajas}
                                                            className="mt-1"
                                                            onChange={(e) => {setPeso((Number(e.target.value) * (info.row.original.peso_caja ? info.row.original.peso_caja : -1))); setCantidadCajas(Number(e.target.value))}}
                                                        />
                                                    </div>
                                                    <div className="w-full flex justify-evenly col-span-6 items-center">
                                                        <Button
                                                            variant="solid"
                                                            color="red"
                                                            className="h-1/2"
                                                            onClick={() => {setModalEditarFrutaReal(false)}}
                                                        >Cancelar</Button>
                                                        <Button
                                                            variant="solid"
                                                            color="blue"
                                                            className="h-1/2"
                                                            onClick={ async () => {
                                                                try {
                                                                    const token_validado = await verificarToken(token)
                                                                    if (!token_validado) throw new Error('El token no es valido')
                                                                        const res = await fetchWithTokenPatch(`api/pedidos/${id}/frutas/${info.row.original.id}/`, {cantidad: peso, tipo_fruta: ctPPT, id_fruta: info.row.original.id_fruta} ,token_validado)
                                                                    if (res.ok){
                                                                        toast.success('Fruta Editada del Pedido')
                                                                        dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                                                                    } else if (res.status === 400) {
                                                                        toast.error('Error al editar')
                                                                    }
                                                                } catch (error: any) {
                                                                    toast.error('Error al editar')
                                                                }
                                                            }}
                                                        >Guardar</Button>
                                                    </div>
                                                </div>
                                            </ModalBody>
                                        </Modal>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )
            },
            header: ''
        })
    ]

    const table = useReactTable({
        data: frutaReal,
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
            pagination: { pageSize: 10 },
        },
    })

    const columnsBins = [
        columnHelperBins.accessor('binbodega', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.binbodega}</div>
            ),
            header: 'Codigo'
        }),
        columnHelperBins.accessor('calidad', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.calidad}</div>
            ),
            header: 'Calidad'
        }),
        columnHelperBins.accessor('variedad', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.variedad}</div>
            ),
            header: 'Variedad'
        }),
        columnHelperBins.accessor('calibre', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.calibre}</div>
            ),
            header: 'Calibre'
        }),
        columnHelperBins.accessor('kilos_bin', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.kilos_bin}</div>
            ),
            header: 'Kilos'
        }),
        columnHelperBins.display({
            id: 'acciones',
            cell: (info) => (
                <div className="font-bold">
                    { pedido && pedido.frutas.length > 0 && ctBin > 0 && pedido.frutas.find(fruta => fruta.id_fruta === info.row.original.id && fruta.tipo_fruta === ctBin) ? (
                        <Tooltip text="Bin Ya Agregado">
                            
                        </Tooltip>
                    ) : (
                        <Tooltip text="Agregar">
                            <Button
                                variant="solid"
                                color="blue"
                                onClick={ async () => {
                                    try {
                                        const token_verificado = await verificarToken(token!)
                                        if (!token_verificado) throw new Error('Token no verificado')
                                        const response = await fetchWithTokenPost(`api/pedidos/${id}/frutas/`, {id_fruta: info.row.original.id, cantidad: 1, pedido: id, tipo_fruta: ctBin}, token_verificado)
                                        if (response.ok) {
                                            toast.success("Bin Agregado")
                                            dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                                        } else {
                                            toast.error("Error al agregar el Bin")
                                        }
                                    } catch {
                                        toast.error("Error al agregar el Bin")
                                    }
                                }}
                            ><HeroPlus style={{fontSize: 25}}/></Button>
                        </Tooltip>
                    )
                    }
                </div>
            )
        })
    ]

    const tableBins = useReactTable({
        data: bin_bodega,
        columns: columnsBins,
        state: {
            sorting: sortingBins,
            globalFilter: globalFilterBins,
        },
        onSortingChange: setSortingBins,
        enableGlobalFilter: true,
        onGlobalFilterChange: setGlobalFilterBins,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    return (
        <>
            <Card>
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>Fruta de Bodega del Pedido N° {pedido?.id} de {pedido && (pedido.mercado_interno ? pedido.mercado_interno.cliente_info.nombre : pedido.exportacion ? pedido.exportacion.cliente_info.nombre : pedido.guia_salida ? pedido.guia_salida.cliente_info.nombre : '')}</CardTitle>
                    </CardHeaderChild>
                    <CardHeaderChild>
                        <div className="w-full flex gap-4">
                            { pedido && pedido.estado_pedido === '2' && (
                                <>
                                    <Button variant="solid" color="teal" onClick={() => {setModalRegistrarBin(true)}}>Agregar Bin</Button>  
                                    <Button variant="solid" color="gray" onClick={() => {setModalRegistrarPPT(true)}}>Agregar PPT</Button>
                                </>
                            )}
                        </div>
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-12">
                        <div className="col-span-full overflow-x-auto">
                            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}></TableTemplate>
                            <TableCardFooterTemplate table={table} className="mt-2" />
                        </div>
                    </div>
                </CardBody>
            </Card>
            {/* MODAL REGISTRO BIN */}
            <Modal
                isOpen={modalRegistrarBin}
                setIsOpen={setModalRegistrarBin}
                size="xl"
                isStaticBackdrop={false}
            >
                <ModalHeader>Agregar Bin al Pedido N° {pedido?.id}</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 justify-end flex gap-4">
                            <FieldWrap
                                firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
                                lastSuffix={
                                    globalFilterBins && (
                                        <Icon
                                            icon='HeroXMark'
                                            color='red'
                                            className='mx-2 cursor-pointer'
                                            onClick={() => {
                                                setGlobalFilterBins('');
                                            }}
                                        />
                                    )
                                }>
                                <Input
                                    id='search'
                                    name='search'
                                    placeholder='Buscar'
                                    value={globalFilterBins ?? ''}
                                    onChange={(e) => setGlobalFilterBins(e.target.value)}
                                />
                            </FieldWrap>
                        </div>
                        <div className="col-span-12 mt-2">
                            <div className="w-full overflow-x-auto">
                                <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={tableBins}></TableTemplate>
                                <TableCardFooterTemplate table={tableBins} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            {/* MODAL REGISTRO PPT */}
            <ModalPPTReal ctPPT={ctPPT} modalRegistrarPPT={modalRegistrarPPT} setModalRegistrarPPT={setModalRegistrarPPT} />
        </>
    )
}

export default ComponerFrutaReal