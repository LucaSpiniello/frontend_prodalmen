import { ThunkDispatch } from "@reduxjs/toolkit"
import Container from "../../../components/layouts/Container/Container"
import { useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { useDispatch } from "react-redux"
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../components/ui/Card"
import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import Validation from "../../../components/form/Validation"
import FieldWrap from "../../../components/form/FieldWrap"
import SelectReact, { TSelectOptions } from "../../../components/form/SelectReact"
import { fetchWithTokenPatch } from "../../../utils/peticiones.utils"
import { useFormik } from "formik"
import { useAuth } from "../../../context/authContext"
import { fetchPedidoInterno } from "../../../redux/slices/pedidoSlice"
import toast from "react-hot-toast"
import { CONDICION_PAGO_NOTAPEDIDO, TIPO_VENTA } from "../../../utils/constante"
import Input from "../../../components/form/Input"
import { format } from "@formkit/tempo"
import Textarea from "../../../components/form/Textarea"
import { fetchClientes, fetchSucursales } from "../../../redux/slices/clientes"
import Checkbox from "../../../components/form/Checkbox"
import Tooltip from "../../../components/ui/Tooltip"
import Modal, { ModalBody, ModalHeader } from "../../../components/ui/Modal"
import DetalleDespacho from "../Despacho/DetalleDespacho"
import { useParams } from "react-router-dom"

function EditarPedidoMercadoInterno() {
    const { id } = useParams()
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const pedido_interno = useAppSelector((state: RootState) => state.pedidos.pedido_interno)
    const pedido = useAppSelector((state) => state.pedidos.pedido)
    const clientes = useAppSelector((state: RootState) => state.clientes.clientes)
    const sucursales = useAppSelector((state: RootState) => state.clientes.sucursales_cliente)
    const [editando, setEditando] = useState<boolean>()
    const { verificarToken } = useAuth()
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    const [optionsClientes, setOptionsClientes] = useState<TSelectOptions>([])
    const [esRetiroCliente, setEsRetiroCliente] = useState<boolean>()
    const [optionsSucursales, setOptionsSucursales] = useState<TSelectOptions>([])
    const [modalDetalleDespacho, setModalDetalleDespacho] = useState<boolean>(false)
    const [editandoFactura, setEditandoFactura] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchClientes({ params: { search: `?tipo_cliente=clientemercadointerno` }, token, verificar_token: verificarToken }))
    }, [editando])

    useEffect(() => {
        if (pedido && pedido.mercado_interno){
            dispatch(fetchPedidoInterno({ id: pedido.mercado_interno.id, token, verificar_token: verificarToken }))
        }
    }, [pedido])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            cliente: pedido_interno && pedido_interno.cliente,
            cliente_rut: pedido_interno && pedido_interno.cliente_info.rut,
            sucursal: `${(pedido_interno && pedido_interno.sucursal) ?? 0}`,
            retira_cliente: pedido_interno && pedido_interno.retira_cliente ? pedido_interno.retira_cliente : false,
            quien_retira: pedido_interno?.quien_retira, 
            fecha_entrega: pedido_interno ? pedido_interno.fecha_entrega : '', // Fecha
            archivo_oc: null, // Manejar la carga de archivos adecuadamente
            condicion_pago: pedido_interno && pedido_interno.condicion_pago, // Condición de pago
            observaciones: pedido_interno && pedido_interno.observaciones,
            numero_oc: pedido_interno && pedido_interno.numero_oc,
            numero_factura: pedido_interno && pedido_interno.numero_factura,
            // fecha_recepcion_cliente: pedido_interno && pedido_interno.fecha_recepcion_cliente, // Fecha y hora
            fecha_facturacion: pedido_interno && pedido_interno.fecha_facturacion, // Fecha
            valor_dolar_fact: 0.0,
            tipo_venta: pedido_interno && pedido_interno.tipo_venta,
        },
        onSubmit: async (values) => {
            const token_verificado = await verificarToken(token!)
            if (!token_verificado) throw new Error('Token no verificado')
            const res = await fetchWithTokenPatch(`api/pedidos_mercado_interno/${pedido_interno?.id}/`,
                { ...values,
                    condicion_pago: values.condicion_pago
                }
                , token_verificado)
            if (res.ok){
                toast.success('Se ha actualizado correctamente el pedido')
                dispatch(fetchPedidoInterno({ id: pedido_interno?.id, token, verificar_token: verificarToken }))
                setEditando(false)
            } else {
                toast.error('Se produjo un error, vuelve a intentarlo')
            }
        },
    })

    useEffect(() => {
        const lista: TSelectOptions = []
        clientes.forEach((element) => {
            lista.push({value: element.rut_dni, label: `${element.nombre_fantasia}`})
        })
        setOptionsClientes(lista)
    }, [clientes])

    useEffect(() => {
        const lista: TSelectOptions = []
        sucursales.forEach((element) => {
          lista.push({value: `${element.id}`, label: element.nombre})
        })
        setOptionsSucursales(lista)
    }, [sucursales])

    useEffect(() => {
        if (formik.values.cliente_rut){
            dispatch(fetchSucursales({ params: { rut: `${formik.values.cliente_rut}`}, token, verificar_token: verificarToken }))
        }
    }, [formik.values.cliente_rut])

    useEffect(() => {
        if (pedido_interno) {
            setEsRetiroCliente(pedido_interno.retira_cliente)
            dispatch(fetchSucursales({ params: { rut: `${pedido_interno.cliente_info.rut}`}, token, verificar_token: verificarToken }))
        }
    }, [pedido_interno])

    return (
        <Container className="w-full h-full">
            <Card>
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>Pedido Mercado Interno N° {pedido_interno?.id}</CardTitle>
                    </CardHeaderChild>
                    <CardHeaderChild>
                        <div className="flex w-full gap-4"></div>
                        { pedido && (pedido.estado_pedido == '1' || pedido.estado_pedido == '0') && (
                            editando ?
                            <>
                                <Button
                                    variant='solid'
                                    color='red'
                                    colorIntensity='700'
                                    // className='w-5/12'
                                    onClick={() => setEditando(false)}
                                    >
                                    Cancelar
                                </Button>
                                <Button
                                    variant='solid'
                                    color='emerald'
                                    colorIntensity='700'
                                    // className='w-5/12'
                                    onClick={() => formik.handleSubmit()}
                                    >
                                    Guardar Cambios
                                </Button>
                                </> 
                            :
                                <Button
                                    variant='solid'
                                    color='blue'
                                    // className='w-3/12'
                                    onClick={() => setEditando(true)}
                                >
                                    Editar
                                </Button>
                        )}
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className='grid grid-cols-12 w-full gap-4'>
                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            { !editando &&
                                <div className='w-full flex-col items-center'>
                                    <label>Estado Pedido: </label>
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{pedido_interno?.estado_pedido_label}</span>
                                    </div>
                                </div>
                            }

                            { !editando && (
                                <div className='w-full flex-col  items-center'>
                                    <label>Solicitado Por: </label>
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{pedido_interno?.solicitado_por_label}</span>
                                    </div>
                                </div>
                            )}
                        </article>

                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            <div className='w-full h-full flex-col items-center'>
                                <label>Fecha Entrega: </label>
                                { editando ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.fecha_entrega}
                                        invalidFeedback={formik.errors.fecha_entrega ? String(formik.errors.fecha_entrega) : undefined}
                                    >
                                        <FieldWrap>
                                            <Input
                                                type='date'
                                                id='fecha_entrega'
                                                name='fecha_entrega'
                                                onChange={formik.handleChange}
                                                value={formik.values.fecha_entrega}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) :
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                                        <span>{format(pedido_interno?.fecha_entrega!, { date: 'medium' }, 'es' )}</span>
                                    </div>
                                }
                            </div>

                            <div className='w-full h-full flex-col items-center'>
                                <label htmlFor="condicion_pago">Condición Pago: </label>
                                { editando ? (
                                    <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.condicion_pago}
                                    invalidFeedback={formik.errors.condicion_pago ? String(formik.errors.condicion_pago) : undefined}
                                    >
                                        <FieldWrap>
                                            <SelectReact
                                                options={CONDICION_PAGO_NOTAPEDIDO}
                                                id='condicion_pago'
                                                placeholder='Selecciona una opción'
                                                name='condicion_pago'
                                                className='h-12'
                                                value={CONDICION_PAGO_NOTAPEDIDO.find(pago => pago.value === formik.values.condicion_pago)}
                                                onChange={(value: any) => {
                                                    formik.setFieldValue('condicion_pago', value.value)
                                                }}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                                        <span>{pedido_interno?.condicion_pago_label}</span>
                                    </div>
                                )}
                            </div>
                        </article>
                        
                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            <div className='w-full flex-col items-center'>
                                <label>Cliente: </label>
                                { editando ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.cliente}
                                        invalidFeedback={formik.errors.cliente ? String(formik.errors.cliente) : undefined}
                                    >
                                        <FieldWrap>
                                            <SelectReact
                                            options={optionsClientes}
                                            id='cliente'
                                            placeholder='Selecciona una opción'
                                            name='cliente'
                                            className='h-12'
                                            value={{value: formik.values.cliente_rut ?? '', label: clientes.find(cliente => cliente.rut_dni === formik.values.cliente_rut)?.nombre_fantasia ?? ''}}
                                            onChange={(value: any) => {
                                                formik.setFieldValue('cliente_rut', value.value)
                                                const cliente = clientes.find(cliente => cliente.rut_dni === value.value)
                                                formik.setFieldValue('cliente', cliente?.id)
                                            }}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{pedido_interno?.cliente_info.nombre}</span>
                                    </div>
                                )}
                            </div>
                        </article>

                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            <div className='w-full flex-col items-center'>
                                <label htmlFor="numero_oc">N° Orden de Compra: </label>
                                { editando ? (
                                    <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.numero_oc}
                                    invalidFeedback={formik.errors.numero_oc ? String(formik.errors.numero_oc) : undefined}
                                    >
                                        <FieldWrap>
                                            <Input 
                                            type='text'
                                            id='numero_oc'
                                            name='numero_oc'
                                            onChange={formik.handleChange}
                                            value={formik.values.numero_oc ?? ''}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{pedido_interno?.numero_oc}</span>
                                    </div>
                                )}
                            </div>

                            <div className='w-full h-full flex-col items-center'>
                                <label>Moneda: </label>
                                { editando ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.tipo_venta}
                                        invalidFeedback={formik.errors.tipo_venta ? String(formik.errors.tipo_venta) : undefined}
                                        >
                                        <FieldWrap>
                                            <SelectReact
                                                options={TIPO_VENTA}
                                                id='tipo_venta'
                                                placeholder='Selecciona una opción'
                                                name='tipo_venta'
                                                className='h-12'
                                                value={{value: formik.values.tipo_venta ?? '', label: TIPO_VENTA.find(venta => venta.value === formik.values.tipo_venta)?.label ?? ''}}
                                                onChange={(value: any) => {
                                                    formik.setFieldValue('tipo_venta', value.value)
                                                }}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                                        <span>{pedido_interno?.tipo_venta_label}</span>
                                    </div>
                                )}
                            </div>
                        </article>

                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            <div className='w-full h-full flex-col items-center'>
                                <label htmlFor="observaciones">Observaciones: </label>
                                { editando ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.observaciones}
                                        invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                                    >
                                        <FieldWrap>
                                            <Textarea
                                            id = 'observaciones'
                                            name='observaciones'
                                            value={formik.values.observaciones ?? ''}
                                            onChange={formik.handleChange} 
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md h-16`}>
                                        <span>{pedido_interno?.observaciones}</span>
                                    </div>
                                )}
                            </div>
                        </article>

                    </div>
                </CardBody>
            </Card>
            {/* DETALLE DESPACHO / RETIRO FRUTA */}
            <Card className="mt-4">
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>Detalles {pedido_interno?.retira_cliente ? 'Retira Cliente' : 'Despacho'}</CardTitle>
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="sm:col-span-6 col-span-full">
                            {/* Seleccion tipo de retiro fruta */}
                            <div className='w-full h-full flex-col items-center'>
                                {/* <label>{pedido_interno?.retira_cliente ? 'Quién Recibe' : 'Despacho'}</label> */}
                                <label>Tipo</label>
                                {
                                    editando ? (
                                        <>
                                            <Checkbox
                                                label={esRetiroCliente ? 'Retira Cliente' : 'Despacho'}
                                                variant="switch"
                                                name="retira_cliente"
                                                onChange={(e) => {formik.handleChange(e); setEsRetiroCliente(e.target.checked); if (e.target.checked) { formik.setFieldValue('sucursal', '')}}}
                                                checked={formik.values.retira_cliente}
                                            ></Checkbox>
                                        </>
                                    ) : (
                                        pedido_interno?.retira_cliente ? 
                                            <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                                <span>Retira Cliente</span>
                                            </div>
                                        : 
                                            <Tooltip text="Detalle Despacho" >
                                                <Button className="ml-2" variant="solid" onClick={() => {setModalDetalleDespacho(true)}}>Despacho</Button>
                                            </Tooltip>
                                    )
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6 col-span-full">
                            { editando ? 
                                !esRetiroCliente ? (
                                    // DESPACHO
                                    <div className='w-full h-full flex-col items-center'>
                                        <label>Sucursal</label>
                                        <Validation
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.sucursal}
                                            invalidFeedback={formik.errors.sucursal ? String(formik.errors.sucursal) : undefined}
                                        >
                                            <FieldWrap>
                                                <SelectReact
                                                options={optionsSucursales}
                                                id='sucursal'
                                                placeholder='Selecciona un opción'
                                                name='sucursal'
                                                className='h-12'
                                                value={{value: formik.values.sucursal ?? '', label: sucursales.find(suc => `${suc.id}` === formik.values.sucursal)?.nombre ?? ''}}
                                                onChange={(value: any) => {
                                                    formik.setFieldValue('sucursal', value.value)
                                                    formik.setFieldValue('quien_retira', '')
                                                    formik.setFieldValue('fecha_recepcion_cliente', '')
                                                }}
                                                />
                                            </FieldWrap>
                                        </Validation>
                                    </div>
                                ) : (
                                    // RETIRO CLIENTE
                                    <>
                                        <div className='w-full flex-col items-center'>
                                            {/* <label>{pedido_interno?.retira_cliente ? 'Quién Recibe' : 'Despacho'}</label> */}
                                            <label>Quien Retira</label>
                                            <Validation
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.sucursal}
                                                invalidFeedback={formik.errors.sucursal ? String(formik.errors.sucursal) : undefined}
                                            >
                                                <FieldWrap>
                                                    <Input
                                                        type="text"
                                                        name="quien_retira"
                                                        value={formik.values.quien_retira ?? ''}
                                                        onChange={formik.handleChange}
                                                    />
                                                </FieldWrap>
                                            </Validation>
                                        </div>
                                    </>
                                )
                            : 
                                !pedido_interno?.retira_cliente ? (
                                    // DESPACHO
                                    <>
                                        <label>Sucursal</label>
                                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                            <span>{pedido_interno?.cliente_info.sucursal}</span>
                                        </div>
                                    </>
                                )
                                : (
                                    // RETIRO CLIENTE
                                    <>
                                        <label>Quien Retira</label>
                                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                            <span>{pedido_interno.quien_retira}</span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </CardBody>
            </Card>
            
            {/* DETALLE FACTURACION */}
            <Card className="mt-4">
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>Detalles Facturación</CardTitle>
                    </CardHeaderChild>
                    <CardHeaderChild>
                        { pedido && pedido.estado_pedido === '3' && (
                            <Button
                                variant="solid"
                                color="blue"
                                onClick={() => {setEditandoFactura(true)}}
                            >Editar Detalles Facturación</Button>
                        )}
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-12 w-full gap-4">
                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            <div className='w-full flex-col items-center'>
                                <label htmlFor="fecha_facturacion">Fecha Facturación: </label>
                                { pedido && pedido.estado_pedido === '3' && editandoFactura ? (
                                    (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.fecha_facturacion}
                                        invalidFeedback={formik.errors.fecha_facturacion ? String(formik.errors.fecha_facturacion) : undefined}
                                    >
                                        <FieldWrap>
                                        <Input
                                            type='date'
                                            id='fecha_facturacion'
                                            name='fecha_facturacion'
                                            onChange={formik.handleChange}
                                            value={formik.values.fecha_facturacion ?? ''}
                                        />
                                        </FieldWrap>
                                    </Validation>
                                    )
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{pedido_interno?.fecha_facturacion ? format(pedido_interno?.fecha_facturacion!, { date: 'full'}, 'es' ) : 'Aun no hay datos'}</span>
                                    </div>
                                )}
                            </div>

                            <div className='w-full flex-col items-center'>
                                <label htmlFor="numero_factura">N° Factura: </label>
                                { pedido && pedido.estado_pedido === '3' && editandoFactura ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.numero_factura}
                                        invalidFeedback={formik.errors.numero_factura ? String(formik.errors.numero_factura) : undefined}
                                    >
                                        <FieldWrap>
                                            <Input
                                                type='text'
                                                id='numero_factura'
                                                name='numero_factura'
                                                onChange={formik.handleChange}
                                                value={formik.values.numero_factura ?? ''}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                )
                                : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{pedido_interno?.numero_factura ? pedido_interno?.numero_factura : 'Aun no registrado'}</span>
                                    </div>
                                )}
                            </div>
                        </article>
                    </div>
                </CardBody>
            </Card>
            <Modal
                isOpen={modalDetalleDespacho}
                setIsOpen={setModalDetalleDespacho}
                isStaticBackdrop={true}
            >
                <ModalHeader>Despacho</ModalHeader>
                <ModalBody>
                    <DetalleDespacho id_pedido={pedido_interno?.id_pedido_padre} />
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default EditarPedidoMercadoInterno