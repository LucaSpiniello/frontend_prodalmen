import { useParams } from "react-router-dom"
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../components/ui/Card"
import TableTemplate, { TableCardFooterTemplate } from "../../templates/common/TableParts.template"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useAuth } from "../../context/authContext"
import { useAppSelector } from "../../redux/hooks"
import { useFormik } from "formik"
import Modal, { ModalBody, ModalHeader } from "../../components/ui/Modal"
import Validation from "../../components/form/Validation"
import FieldWrap from "../../components/form/FieldWrap"
import Input from "../../components/form/Input"
import { useEffect, useState } from "react"
import { CALIBRES, CALIBRES_FRUTA_FICTICIA, CALIDAD_FRUTA, CALIDAD_FRUTA_FICTICIA, NOMBRE_PRODUCTO, VARIEDAD_FRUTA_FICTICIA, VARIEDADES_MP } from "../../utils/constante"
import SelectReact from "../../components/form/SelectReact"
import Label from "../../components/form/Label"
import Button from "../../components/ui/Button"
import { fetchTipoEmbalaje } from "../../redux/slices/embalajeSlice"
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { TFrutaFictia } from "../../types/TypesPedidos.types"
import toast from "react-hot-toast"
import { fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost } from "../../utils/peticiones.utils"
import { detallePedidoThunk, patchPedidoThunk } from "../../redux/slices/pedidoSlice"
import { fetchContentTypes } from "../../redux/slices/registrosbaseSlice"
import Checkbox from "../../components/form/Checkbox"
import Tooltip from "../../components/ui/Tooltip"
import { HeroPencil, HeroXMark } from "../../components/icon/heroicons"

const calidades = [
    {value: 'SN', label: 'Sin Calidad'},
    {value: 'EXT', label: 'Extra N°1'},
    {value: 'SUP', label: 'Supreme'},
    {value: 'W&B', label: 'Whole & Broken'},
    {value: 'har_cn_piel', label: 'Harina Con Piel'},
    {value: 'har_sn_piel', label: 'Harina Sin Piel'},
    {value: 'gra_cn_piel', label: 'Granillo Con Piel'},
    {value: 'gra_sn_piel', label: 'Granillo Sin Piel'},
    {value: 'gra_tos_s_pl', label: 'Granillo Tostado Sin Piel'},
    {value: 'gra_tos_c_pl', label: 'Granillo Tostado Con Piel'},
    {value: 'alm_tostada', label: 'Almendras Tostadas'},
    {value: 'alm_repelada', label: 'Almendras Repeladas'},
    {value: 'vana', label: 'Vana'},
    {value: 'goma', label: 'Goma'},
    {value: 'insect', label: 'Insecto'},
    {value: 'hongo', label: 'Hongo'},
    {value: 'des_sea', label: 'Descarte Sea'},
    {value: 'polvillo', label: 'Polvillo'},
    {value: 'pepasuelo', label: 'Pepa Suelo'},
    {value: 'preca', label: 'Precalibre'},
]

const calibres = [
    { value: '0', label: 'Sin Calibre' },
    { value: '1', label: 'PreCalibre' },
    { value: '2', label: '18/20' },
    { value: '3', label: '20/22' },
    { value: '4', label: '23/25' },
    { value: '5', label: '25/27' },
    { value: '6', label: '27/30' },
    { value: '7', label: '30/32' },
    { value: '8', label: '32/34' },
    { value: '9', label: '34/36' },
    { value: '10', label: '36/40' },
    { value: '11', label: '40+' },
    { value: '12', label: '3x5mm' },
    { value: '13', label: '2x4mm' },
    { value: '14', label: '4x6mm' },
    { value: '15', label: '3x5mm' },
    { value: '16', label: '2x4mm' },
    { value: '17', label: '4x6mm' },
    { value: '18', label: '+2mm' },
    { value: '19', label: '-2mm' },
    { value: '20', label: '+2mm' },
    { value: '21', label: '-2mm' },
]

const columnHelper = createColumnHelper<TFrutaFictia>();


function ComponerFrutaFicticia() {
    const { id } = useParams() 
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const { verificarToken } = useAuth()
    const { pedido } = useAppSelector((state) => state.pedidos)
    const token = useAppSelector((state) => state.auth.authTokens)
    const ct = useAppSelector((state) => state.core.contenttypes)
    const [registroModal, setRegistroModal] = useState<boolean>(false)
    const tipoEmbalaje = useAppSelector((state) => state.embalaje.tipo_embalaje)
    const [optionsEmbalaje, setOptionsEmbalaje] = useState<{value: string, label: string}[]>([])
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [frutaFicticia, setFrutaFicticia] = useState<TFrutaFictia[]>([])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre_producto: '',
            calidad: '',
            variedad: '',
            calibre: '',
            kilos_solicitados: 0,
            precio_kilo_neto: 0,
            formato: '',
            fruta_en_bin: false,
        },
        onSubmit: async (values) => {
            // console.log(pedido && (pedido.mercado_interno ? ct.find(ct => ct.model === 'pedidomercadointerno')?.id ?? '' : pedido.exportacion ? ct.find(ct => ct.model === 'pedidoexportacion')?.id ?? '' : pedido.guia_salida ? ct.find(ct => ct.model === 'guiasalidafruta')?.id ?? '' : ''))
            // console.log(values.fruta_en_bin)
            try {
                const token_validado = await verificarToken(token)
                if (!token_validado) throw new Error('El token no es valido')
                  const res = await fetchWithTokenPost(`api/fruta-ficticia/`, {...values, id_pedido: id, tipo_pedido: pedido && (pedido.mercado_interno ? ct.find(ct => ct.model === 'pedidomercadointerno')?.id ?? '' : pedido.exportacion ? ct.find(ct => ct.model === 'pedidoexportacion')?.id ?? '' : pedido.guia_salida ? ct.find(ct => ct.model === 'guiasalidafruta')?.id ?? '' : '')},   token_validado)
                if (res.ok){
                    const data = await res.json()
                    const token_verificado = await verificarToken(token!)
                    if (!token_verificado) throw new Error('Token no verificado')
                    if (pedido) {
                        if (pedido.mercado_interno) {
                            const response = await fetchWithTokenPatch(`api/pedidos_mercado_interno/${pedido.mercado_interno.id}/`,{fruta_pedido: pedido.mercado_interno.fruta_pedido.concat(data.id)}, token_verificado)
                            if (response.ok) {
                                dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                                toast.success('Fruta Registrada al Pedido Mercado Interno')
                            }
                        }
                        if (pedido.exportacion) {

                        }
                        if (pedido.guia_salida) {
                            const response = await fetchWithTokenPatch(`api/guias-salida/${pedido.guia_salida.id}/`,{fruta_pedido: pedido.guia_salida.fruta_pedido.concat(data.id)}, token_verificado)
                            if (response.ok) {
                                dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                                toast.success('Fruta Registrada a la Guia Salida')
                            }
                        }
                    }
                    // dispatch(patchPedidoThunk({id_pedido: id, data: {fruta_pedido: data.id}, token, verificar_token: verificarToken}))
                    toast.success('Fruta Registrada')
                } else {
                  toast.error('Error al registrar fruta')
                }
            } catch (error: any) {
                toast.error('error')
            }
        }
    })

    useEffect(() => {
		if (ct.length < 1){
			dispatch(fetchContentTypes({ token, verificar_token: verificarToken }))	
		}
	}, [ct])

    useEffect(() => {
        dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
    }, [])

    useEffect(() => {
        if (tipoEmbalaje && tipoEmbalaje.length > 0) {
            const lista: {value: string, label: string}[] = []
            tipoEmbalaje.forEach((element) => {
                lista.push({value: element.id.toString(), label: element.nombre})
            })
            setOptionsEmbalaje(lista)
        }
    }, [tipoEmbalaje])

    useEffect(() => {
        if (pedido) {
            if (pedido.mercado_interno) {
                setFrutaFicticia(pedido.mercado_interno.fruta_ficticia)
            }
            if (pedido.exportacion) {
                // setFrutaFicticia(pedido.exportacion.)
            }
            if (pedido.guia_salida) {
                setFrutaFicticia(pedido.guia_salida.fruta_ficticia)
            }
        } else {
            dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
        }
    }, [pedido])

    const columns = [
        columnHelper.accessor('nombre_producto', {
            id: 'nombre_producto',
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.nombre_producto_label}`}
                </div>
            ),
            header: 'Producto'
        }),
        columnHelper.accessor('calidad_label', {
            id: 'calidad_label',
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.calidad_label}`}
                </div>
            ),
            header: 'Calidad'
        }),
        columnHelper.accessor('variedad', {
            id: 'variedad',
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.variedad_label}`}
                </div>
            ),
            header: 'Variedad'
        }),
        columnHelper.accessor('calibre', {
            id: 'calibre',
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.calibre_label}`}
                </div>
            ),
            header: 'Calibre'
        }),
        columnHelper.accessor('formato', {
            id: 'formato',
            cell: (info) => (
                <div className='font-bold w-full'>
                {`${info.row.original.formato_label}`}
                </div>
            ),
            header: 'Formato'
        }),
        columnHelper.accessor('precio_kilo_neto', {
            id: 'precio_kilo_neto',
            cell: (info) => (
                <div className='font-bold w-full'>$ {`${info.row.original.precio_kilo_neto}`}</div>
            ),
            header: 'Precio Kilos Neto'
        }),
        columnHelper.accessor('kilos_solicitados', {
            cell: (info) => (
                <div className='font-bold w-full'>{`${info.row.original.kilos_solicitados}`} Kgs</div>
            ),
            header: 'Kilos Solicitados'
        }),
        columnHelper.display({
            id: 'subtotal_neto',
            cell: (info) => (
                <div className='font-bold w-full'>$ {(info.row.original.precio_kilo_neto * info.row.original.kilos_solicitados).toLocaleString('es-ES')}</div>
            ),
            header: 'Subtotal Neto'
        }),
        columnHelper.display({
            id: 'acciones',
            cell: (info) => {
                const [editarModal, setEditarModal] = useState<boolean>(false)
                const [frutaEditando, setFrutaEditando] = useState<TFrutaFictia>()
                const formikEditar = useFormik({
                    enableReinitialize: true,
                    initialValues: {
                        nombre_producto: (frutaEditando && frutaEditando.nombre_producto) ?? '',
                        calidad: (frutaEditando && frutaEditando.calidad) ?? '',
                        variedad: (frutaEditando && frutaEditando.variedad) ?? '',
                        calibre: (frutaEditando && frutaEditando.calibre) ?? '',
                        kilos_solicitados: (frutaEditando && frutaEditando.kilos_solicitados) ?? 0,
                        precio_kilo_neto: (frutaEditando && frutaEditando.precio_kilo_neto) ?? 0,
                        formato: frutaEditando && frutaEditando.formato ? frutaEditando.formato.toString() : '',
                        fruta_en_bin: (frutaEditando && frutaEditando.fruta_en_bin) ?? false,
                    },
                    onSubmit: async (values) => {
                        try {
                            const token_validado = await verificarToken(token)
                            if (!token_validado) throw new Error('El token no es valido')
                              const res = await fetchWithTokenPatch(`api/fruta-ficticia/${info.row.original.id}/`, {...values}, token_validado)
                            if (res.ok){
                                toast.success('Editada')
                                dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                            } else if (res.status === 400) {
                              toast.error('error')
                            }
                          } catch (error: any) {
                            toast.error('error')
                          }
                    }
                })

                return (
                    <div className="font-bold gap-2">
                        {pedido && (pedido.estado_pedido == '1' || pedido.estado_pedido == '0') && (
                            <>
                                <Tooltip text="Eliminar Fruta">
                                    <Button
                                        variant="solid"
                                        color="red"
                                        onClick={ async () => {
                                            try {
                                                const token_validado = await verificarToken(token)
                                                if (!token_validado) throw new Error('El token no es valido')
                                                const res = await fetchWithTokenDelete(`api/fruta-ficticia/${info.row.original.id}/`, token_validado)
                                                if (res.ok){
                                                    const token_verificado = await verificarToken(token!)
                                                    if (!token_verificado) throw new Error('Token no verificado')
                                                    if (pedido) {
                                                        dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                                                        // if (pedido.mercado_interno) {
                                                        //     const response = await fetchWithTokenPatch(`api/pedidos_mercado_interno/${pedido.mercado_interno.id}/`,{fruta_pedido: pedido.mercado_interno.fruta_pedido.concat(data.id)}, token_verificado)
                                                        //     if (response.ok) {
                                                        //         toast.success('Fruta Registrada al Pedido Mercado Interno')
                                                        //     }
                                                        // }
                                                        // if (pedido.exportacion) {
                                
                                                        // }
                                                        // if (pedido.guia_salida) {
                                
                                                        // }
                                                    }
                                                    toast.success('Fruta Eliminada')
                                                } else {
                                                toast.error('Error al eliminar fruta')
                                                }
                                            } catch (error: any) {
                                                toast.error('error')
                                            }
                                        }}
                                    ><HeroXMark style={{fontSize: 20}}/></Button>
                                </Tooltip>
                                <Tooltip text="Editar Fruta">
                                    <Button
                                        className="mt-2"
                                        variant="solid"
                                        color="blue"
                                        onClick={() => {setFrutaEditando(info.row.original);setEditarModal(true)}}
                                    ><HeroPencil style={{fontSize: 20}} /></Button>
                                </Tooltip>
                                <Modal
                                    isOpen={editarModal}
                                    setIsOpen={setEditarModal}
                                    isStaticBackdrop={true}
                                >
                                    <ModalHeader>Editar Fruta</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="nombre_producto">Nombre Producto</Label>
                                                <Validation
                                                    isValid={formikEditar.isValid}
                                                    isTouched={formikEditar.touched.nombre_producto}
                                                    invalidFeedback={formikEditar.errors.nombre_producto ? String(formikEditar.errors.nombre_producto) : undefined}
                                                >
                                                    <FieldWrap>
                                                        <SelectReact
                                                            options={NOMBRE_PRODUCTO}
                                                            id='nombre_producto'
                                                            name='nombre_producto'
                                                            onChange={(e: any) => {formikEditar.setFieldValue('nombre_producto', e.value)}}
                                                            value={{value: formikEditar.values.nombre_producto, label: NOMBRE_PRODUCTO.find(nombre => nombre.value === formikEditar.values.nombre_producto)?.label ?? ''}}
                                                        />
                                                    </FieldWrap>
                                                </Validation>
                                            </div>
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="variedad">Variedad</Label>
                                                <Validation
                                                    isValid={formikEditar.isValid}
                                                    isTouched={formikEditar.touched.variedad}
                                                    invalidFeedback={formikEditar.errors.variedad ? String(formikEditar.errors.variedad) : undefined}
                                                >
                                                    <FieldWrap>
                                                        <SelectReact
                                                            options={VARIEDAD_FRUTA_FICTICIA}
                                                            id='variedad'
                                                            name='variedad'
                                                            onChange={(e: any) => {formikEditar.setFieldValue('variedad', e.value)}}
                                                            value={{value: formikEditar.values.variedad, label: VARIEDAD_FRUTA_FICTICIA.find(vari => vari.value === formikEditar.values.variedad)?.label ?? ''}}
                                                        />
                                                    </FieldWrap>
                                                </Validation>
                                            </div>
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="calibre">Calibre</Label>
                                                <Validation
                                                    isValid={formikEditar.isValid}
                                                    isTouched={formikEditar.touched.calibre}
                                                    invalidFeedback={formikEditar.errors.calibre ? String(formikEditar.errors.calibre) : undefined}
                                                >
                                                    <FieldWrap>
                                                        <SelectReact
                                                            options={CALIBRES_FRUTA_FICTICIA}
                                                            id='calibre'
                                                            name='calibre'
                                                            onChange={(e: any) => {formikEditar.setFieldValue('calibre', e.value)}}
                                                            value={{value: formikEditar.values.calibre, label: calibres.find(cal => cal.value === formikEditar.values.calibre)?.label ?? ''}}
                                                        />
                                                    </FieldWrap>
                                                </Validation>
                                            </div>
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="calidad">Calidad</Label>
                                                <Validation
                                                    isValid={formikEditar.isValid}
                                                    isTouched={formikEditar.touched.calidad}
                                                    invalidFeedback={formikEditar.errors.calidad ? String(formikEditar.errors.calidad) : undefined}
                                                >
                                                    <FieldWrap>
                                                        <SelectReact
                                                            options={CALIDAD_FRUTA_FICTICIA}
                                                            id='calidad'
                                                            name='calidad'
                                                            onChange={(e: any) => {formikEditar.setFieldValue('calidad', e.value)}}
                                                            value={{value: formikEditar.values.calidad, label: calidades.find(cali => cali.value === formikEditar.values.calidad)?.label ?? ''}}
                                                        />
                                                    </FieldWrap>
                                                </Validation>
                                            </div>
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="kilos_solicitados">Kilos</Label>
                                                <Validation
                                                    isValid={formikEditar.isValid}
                                                    isTouched={formikEditar.touched.kilos_solicitados}
                                                    invalidFeedback={formikEditar.errors.kilos_solicitados ? String(formikEditar.errors.kilos_solicitados) : undefined}
                                                >
                                                    <FieldWrap>
                                                        <Input
                                                            type="number"
                                                            id='kilos_solicitados'
                                                            name='kilos_solicitados'
                                                            onChange={formikEditar.handleChange}
                                                            value={formikEditar.values.kilos_solicitados}
                                                        />
                                                    </FieldWrap>
                                                </Validation>
                                            </div>
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="precio_kilo_neto">Precio por Kilo Neto</Label>
                                                <Validation
                                                    isValid={formikEditar.isValid}
                                                    isTouched={formikEditar.touched.precio_kilo_neto}
                                                    invalidFeedback={formikEditar.errors.precio_kilo_neto ? String(formikEditar.errors.precio_kilo_neto) : undefined}
                                                >
                                                    <FieldWrap>
                                                        <Input
                                                            type="number"
                                                            id='precio_kilo_neto'
                                                            name='precio_kilo_neto'
                                                            onChange={formikEditar.handleChange}
                                                            value={formikEditar.values.precio_kilo_neto}
                                                        />
                                                    </FieldWrap>
                                                </Validation>
                                            </div>
                                            <div className="col-span-full md:col-span-3">
                                                <Label htmlFor="fruta_en_bin">Fruta en Bin</Label>
                                                <Checkbox
                                                    id="fruta_en_bin"
                                                    name="fruta_en_bin"
                                                    checked={formikEditar.values.fruta_en_bin}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            formikEditar.setFieldValue('formato', '')
                                                        }
                                                        formikEditar.setFieldValue('fruta_en_bin', e.target.checked)
                                                    }}
                                                />
                                            </div>
                                            { !formikEditar.values.fruta_en_bin && (
                                                <div className="col-span-full md:col-span-3">
                                                    <Label htmlFor="formato">Formato Embalaje</Label>
                                                    <Validation
                                                        isValid={formikEditar.isValid}
                                                        isTouched={formikEditar.touched.formato}
                                                        invalidFeedback={formikEditar.errors.formato ? String(formikEditar.errors.formato) : undefined}
                                                    >
                                                        <FieldWrap>
                                                            <SelectReact
                                                                options={optionsEmbalaje}
                                                                id='formato'
                                                                name='formato'
                                                                onChange={(e: any) => {formikEditar.setFieldValue('formato', e.value)}}
                                                                value={{value: formikEditar.values.formato, label: optionsEmbalaje.find((element) => element.value === formikEditar.values.formato)?.label ?? ''}}
                                                            />
                                                        </FieldWrap>
                                                    </Validation>
                                                </div>
                                            )}
                                            <div className="col-span-full flex justify-between">
                                                <Button variant="solid" color="red" onClick={() => {setRegistroModal(false)}}>Cancelar</Button>
                                                <Button variant="solid" color="blue" onClick={() => {formikEditar.handleSubmit()}}>Registrar</Button>
                                            </div>
                                        </div>
                                    </ModalBody>
                                </Modal>
                            </>
                        )}
                    </div>
                )
            }
        })
    ]
    
    const table = useReactTable({
        data: frutaFicticia,
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

    return (
        <>
            <Modal
                isOpen={registroModal}
                setIsOpen={setRegistroModal}
            >
                <ModalHeader>Registrar Fruta</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="nombre_producto">Nombre Producto</Label>
                            <Validation
                                isValid={formik.isValid}
                                isTouched={formik.touched.nombre_producto}
                                invalidFeedback={formik.errors.nombre_producto ? String(formik.errors.nombre_producto) : undefined}
                            >
                                <FieldWrap>
                                    <SelectReact
                                        options={NOMBRE_PRODUCTO}
                                        id='nombre_producto'
                                        name='nombre_producto'
                                        onChange={(e: any) => {formik.setFieldValue('nombre_producto', e.value)}}
                                        value={{value: formik.values.nombre_producto, label: NOMBRE_PRODUCTO.find(nombre => nombre.value === formik.values.nombre_producto)?.label ?? ''}}
                                    />
                                </FieldWrap>
                            </Validation>
                        </div>
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="variedad">Variedad</Label>
                            <Validation
                                isValid={formik.isValid}
                                isTouched={formik.touched.variedad}
                                invalidFeedback={formik.errors.variedad ? String(formik.errors.variedad) : undefined}
                            >
                                <FieldWrap>
                                    <SelectReact
                                        options={VARIEDAD_FRUTA_FICTICIA}
                                        id='variedad'
                                        name='variedad'
                                        onChange={(e: any) => {formik.setFieldValue('variedad', e.value)}}
                                        value={{value: formik.values.variedad, label: VARIEDAD_FRUTA_FICTICIA.find(vari => vari.value === formik.values.variedad)?.label ?? ''}}
                                    />
                                </FieldWrap>
                            </Validation>
                        </div>
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="calibre">Calibre</Label>
                            <Validation
                                isValid={formik.isValid}
                                isTouched={formik.touched.calibre}
                                invalidFeedback={formik.errors.calibre ? String(formik.errors.calibre) : undefined}
                            >
                                <FieldWrap>
                                    <SelectReact
                                        options={CALIBRES_FRUTA_FICTICIA}
                                        id='calibre'
                                        name='calibre'
                                        onChange={(e: any) => {formik.setFieldValue('calibre', e.value)}}
                                        value={{value: formik.values.calibre, label: calibres.find(cal => cal.value === formik.values.calibre)?.label ?? ''}}
                                    />
                                </FieldWrap>
                            </Validation>
                        </div>
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="calidad">Calidad</Label>
                            <Validation
                                isValid={formik.isValid}
                                isTouched={formik.touched.calidad}
                                invalidFeedback={formik.errors.calidad ? String(formik.errors.calidad) : undefined}
                            >
                                <FieldWrap>
                                    <SelectReact
                                        options={CALIDAD_FRUTA_FICTICIA}
                                        id='calidad'
                                        name='calidad'
                                        onChange={(e: any) => {formik.setFieldValue('calidad', e.value)}}
                                        value={{value: formik.values.calidad, label: calidades.find(cali => cali.value === formik.values.calidad)?.label ?? ''}}
                                    />
                                </FieldWrap>
                            </Validation>
                        </div>
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="kilos_solicitados">Kilos</Label>
                            <Validation
                                isValid={formik.isValid}
                                isTouched={formik.touched.kilos_solicitados}
                                invalidFeedback={formik.errors.kilos_solicitados ? String(formik.errors.kilos_solicitados) : undefined}
                            >
                                <FieldWrap>
                                    <Input
                                        type="number"
                                        id='kilos_solicitados'
                                        name='kilos_solicitados'
                                        onChange={formik.handleChange}
                                        value={formik.values.kilos_solicitados}
                                    />
                                </FieldWrap>
                            </Validation>
                        </div>
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="precio_kilo_neto">Precio por Kilo Neto</Label>
                            <Validation
                                isValid={formik.isValid}
                                isTouched={formik.touched.precio_kilo_neto}
                                invalidFeedback={formik.errors.precio_kilo_neto ? String(formik.errors.precio_kilo_neto) : undefined}
                            >
                                <FieldWrap>
                                    <Input
                                        type="number"
                                        id='precio_kilo_neto'
                                        name='precio_kilo_neto'
                                        onChange={formik.handleChange}
                                        value={formik.values.precio_kilo_neto}
                                    />
                                </FieldWrap>
                            </Validation>
                        </div>
                        <div className="col-span-full md:col-span-3">
                            <Label htmlFor="fruta_en_bin">Fruta en Bin</Label>
                            <Checkbox
                                id="fruta_en_bin"
                                name="fruta_en_bin"
                                checked={formik.values.fruta_en_bin}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        formik.setFieldValue('formato', '')
                                    }
                                    formik.setFieldValue('fruta_en_bin', e.target.checked)
                                }}
                            />
                        </div>
                        { !formik.values.fruta_en_bin && (
                            <div className="col-span-full md:col-span-3">
                                <Label htmlFor="formato">Formato Embalaje</Label>
                                <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.formato}
                                    invalidFeedback={formik.errors.formato ? String(formik.errors.formato) : undefined}
                                >
                                    <FieldWrap>
                                        <SelectReact
                                            options={optionsEmbalaje}
                                            id='formato'
                                            name='formato'
                                            onChange={(e: any) => {formik.setFieldValue('formato', e.value)}}
                                            value={{value: formik.values.formato, label: optionsEmbalaje.find((element) => element.value === formik.values.formato)?.label ?? ''}}
                                        />
                                    </FieldWrap>
                                </Validation>
                            </div>
                        )}
                        <div className="col-span-full flex justify-between">
                            <Button variant="solid" color="red" onClick={() => {setRegistroModal(false)}}>Cancelar</Button>
                            <Button variant="solid" color="blue" onClick={() => {formik.handleSubmit()}}>Registrar</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Card>
                <CardHeader>
                    <CardHeaderChild className="">
                        <CardTitle>Fruta Solicitada del Pedido N° {pedido?.id} de {pedido && (pedido.mercado_interno ? pedido.mercado_interno.cliente_info.nombre : pedido.exportacion ? pedido.exportacion.cliente_info.nombre : pedido.guia_salida ? pedido.guia_salida.cliente_info.nombre : '')}</CardTitle>
                    </CardHeaderChild>
                    <CardHeaderChild>
                        { pedido && (pedido.estado_pedido == '1' || pedido.estado_pedido == '0') && (
                            <Button variant="solid" color="emerald" onClick={() => {setRegistroModal(true)}}>Registrar Fruta</Button>
                        )}
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-12">
                        <div className="col-span-full overflow-x-auto">
                            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}></TableTemplate>
                            <div className="w-full flex flex-col">
                                <div className="w-full text-end"><span className="mr-28">SubTotal <span className="font-bold">$ {table.getRowModel().rows.reduce((acc, row) => (row.original.kilos_solicitados * row.original.precio_kilo_neto) + acc, 0).toLocaleString('es-ES')}</span></span></div>
                                <div className="w-full text-end"><span className="mr-28">IVA <span className="font-bold">$ {(table.getRowModel().rows.reduce((acc, row) => (row.original.kilos_solicitados * row.original.precio_kilo_neto) + acc, 0) * 0.19).toLocaleString('es-ES')}</span></span></div>
                                <div className="w-full text-end"><span className="mr-28">Total <span className="font-bold">$ {(table.getRowModel().rows.reduce((acc, row) => (row.original.kilos_solicitados * row.original.precio_kilo_neto) + acc, 0) + (table.getRowModel().rows.reduce((acc, row) => (row.original.kilos_solicitados * row.original.precio_kilo_neto) + acc, 0) * 0.19)).toLocaleString('es-ES')}</span></span></div>
                            </div>
                            <TableCardFooterTemplate table={table} className="mt-2" />
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default ComponerFrutaFicticia