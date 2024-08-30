import { useDispatch } from "react-redux"
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../components/ui/Card"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useAppSelector } from "../../../redux/hooks"
import { useAuth } from "../../../context/authContext"
import { useEffect, useState } from "react"
import Button from "../../../components/ui/Button"
import { useFormik } from "formik"
import { fetchGuiaDeSalida, listaClientesParaGuiaThunk } from "../../../redux/slices/guiaSalidaSlice"
import Validation from "../../../components/form/Validation"
import FieldWrap from "../../../components/form/FieldWrap"
import Input from "../../../components/form/Input"
import { format } from "@formkit/tempo"
import SelectReact, { TSelectOptions } from "../../../components/form/SelectReact"
import Checkbox from "../../../components/form/Checkbox"
import { detallePedidoThunk } from "../../../redux/slices/pedidoSlice"
import { useParams } from "react-router-dom"
import Tooltip from "../../../components/ui/Tooltip"
import Select from 'react-select'
import Textarea from "../../../components/form/Textarea"
import toast from "react-hot-toast"
import { fetchWithTokenPatch } from "../../../utils/peticiones.utils"

const TIPO_GUIA = [
    {value: '0', label: 'Retiro Fruta Productor'},
    {value: '1', label: 'Regalo Fruta'},
    {value: '2', label: 'Fruta para Muestras'},
    {value: '3', label: 'Retiro de Fruta Usuario particular'},
]

function EditarGuiaSalida() {
    const { id } = useParams()
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const { verificarToken } = useAuth()
    const token = useAppSelector((state) => state.auth.authTokens)
    const pedido = useAppSelector((state) => state.pedidos.pedido)
    const [editando, setEditando] = useState<boolean>()
    const { guia_de_salida, lista_clientes } = useAppSelector((state) => state.guia_salida)
    const [esRetiroCliente, setEsRetiroCliente] = useState<boolean>()
    const [optionsClientes, setOptionsClientes] = useState<{value: number, label: string, tipo_cliente: number}[]>([])

    useEffect(() => {
        if (pedido) {
            dispatch(fetchGuiaDeSalida({token, verificar_token: verificarToken, id: pedido.guia_salida ? pedido.guia_salida.id : undefined }))
        } else {
            dispatch(detallePedidoThunk({token, verificar_token: verificarToken, id_pedido: id}))
        }
    }, [pedido])

    useEffect(() => {
        if (guia_de_salida) {
            setEsRetiroCliente(guia_de_salida.retira_cliente)
            dispatch(listaClientesParaGuiaThunk({token, verificar_token: verificarToken}))
        }
    }, [guia_de_salida])

    useEffect(() => {
        const lista: {value: number, label: string, tipo_cliente: number}[] = []
        lista_clientes.forEach((element) => {
            lista.push({value: element.id_cliente, label: `${element.nombre}`, tipo_cliente: element.content_type_id})
        })
        setOptionsClientes(lista)
    }, [lista_clientes])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fecha_entrega: guia_de_salida ? guia_de_salida.fecha_entrega : '',
            retira_cliente: guia_de_salida ? guia_de_salida.retira_cliente : true,
            observaciones: guia_de_salida ? guia_de_salida.observaciones : '',
            quien_retira: guia_de_salida ? guia_de_salida.quien_retira : '',
            tipo_salida: guia_de_salida ? guia_de_salida.tipo_salida : '',
            id_cliente: guia_de_salida ? guia_de_salida.id_cliente: 0,
            tipo_cliente: guia_de_salida ? guia_de_salida.tipo_cliente: 0,
        },
        onSubmit: async (values) => {
            try {
                const token_validado = await verificarToken(token)
                if (!token_validado) throw new Error('El token no es valido')
                    const res = await fetchWithTokenPatch(`api/guias-salida/${guia_de_salida?.id}/`, {...values},token_validado)
                if (res.ok){
                    toast.success('Actualización realizada exitosamente')
                    setEditando(false)
                    // dispatch(fetchGuiaDeSalida({ id: guia_de_salida?.id, token, verificar_token: verificarToken }))
                    dispatch(detallePedidoThunk({ id_pedido: id, token, verificar_token: verificarToken}))
                } else if (res.status === 400) {
                    toast.error('No se pudo realizar, vuelve a intentarlo')
                }
            } catch (error: any) {
                toast.error('No se pudo realizar, vuelve a intentarlo')
            }
        }
    })

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>Guia Salida N° {guia_de_salida?.id}</CardTitle>
                    </CardHeaderChild>
                    <CardHeaderChild>
                        { pedido && (pedido.estado_pedido == '1' || pedido.estado_pedido == '0') && (
                            editando ?
                            <>
                                <Button
                                    variant='solid'
                                    color='red'
                                    colorIntensity='700'
                                    onClick={() => {setEditando(false); formik.resetForm()}}
                                    >
                                    Cancelar
                                </Button>
                                <Button
                                    variant='solid'
                                    color='emerald'
                                    colorIntensity='700'
                                    onClick={() => formik.handleSubmit()}
                                    >
                                    Guardar Cambios
                                </Button>
                                </> 
                            :
                                <Button
                                    variant='solid'
                                    color='blue'
                                    onClick={() => setEditando(true)}
                                >
                                    Editar
                                </Button>
                        )}
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-12 gap-4 w-full">
                        <article className='col-span-12 flex sm:flex-row flex-col w-full gap-2'>
                            <div className='w-full flex-col items-center'>
                                <label>Solicitado Por: </label>
                                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                    <span>{guia_de_salida?.solicitado_por_label}</span>
                                </div>
                            </div>

                            <div className='w-full flex-col items-center'>
                                <label>Cliente: </label>
                                {/* SELECT DE TODOS LOS CLIENTES */}
                                { editando ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.id_cliente}
                                        invalidFeedback={formik.errors.id_cliente ? String(formik.errors.id_cliente) : undefined}
                                    >
                                        <FieldWrap>
                                            <Select
                                                options={optionsClientes}
                                                id='id_cliente'
                                                placeholder='Selecciona una opción'
                                                name='id_cliente'
                                                className='h-12'
                                                value={{value: formik.values.id_cliente ?? '', label: lista_clientes.find(cliente => cliente.id_cliente === formik.values.id_cliente && cliente.content_type_id === formik.values.tipo_cliente)?.nombre ?? ''}}
                                                onChange={(value: any) => {
                                                    formik.setFieldValue('id_cliente', value.value)
                                                    // const cliente = clientes.find(cliente => cliente.rut_dni === value.value)
                                                    formik.setFieldValue('tipo_cliente', value.tipo_cliente)
                                                }}
                                                noOptionsMessage={(obj) => (<div className="font-bold">No hay Coincidencias con {obj.inputValue}</div>)}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                        <span>{guia_de_salida?.cliente_info.nombre}</span>
                                    </div>
                                )}
                            </div>
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
                                        <span>{format(guia_de_salida?.fecha_entrega!, { date: 'medium' }, 'es' )}</span>
                                    </div>
                                }
                            </div>

                            <div className='w-full h-full flex-col items-center'>
                                <label htmlFor="tipo_salida">Tipo: </label>
                                { editando ? (
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.tipo_salida}
                                        invalidFeedback={formik.errors.tipo_salida ? String(formik.errors.tipo_salida) : undefined}
                                    >
                                        <FieldWrap>
                                            <SelectReact
                                                options={TIPO_GUIA}
                                                id='tipo_salida'
                                                name='tipo_salida'
                                                className='h-12'
                                                value={{value: formik.values.tipo_salida, label: TIPO_GUIA.find(element => element.value === formik.values.tipo_salida)?.label ?? ''}}
                                                onChange={(e : any) => {formik.setFieldValue('tipo_salida', e.value)}}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                ) : (
                                    <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                                        <span>{guia_de_salida?.tipo_salida_label}</span>
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
                                        <span>{guia_de_salida?.observaciones}</span>
                                    </div>
                                )}
                            </div>
                        </article>
                    </div>
                </CardBody>
            </Card>
            <Card className="mt-4">
                <CardHeader>
                    <CardHeaderChild>
                        <CardTitle>Detalles {guia_de_salida?.retira_cliente ? 'Retira Cliente' : 'Despacho'}</CardTitle>
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="sm:col-span-6 col-span-full">
                            {/* Seleccion tipo de retiro fruta */}
                            <div className='w-full h-full flex-col items-center'>
                                <label>Tipo</label>
                                {
                                    editando ? (
                                        <>
                                            <Checkbox
                                                label={esRetiroCliente ? 'Retira Cliente' : 'Despacho'}
                                                variant="switch"
                                                name="retira_cliente"
                                                onChange={(e) => {formik.handleChange(e); setEsRetiroCliente(e.target.checked)}}
                                                checked={formik.values.retira_cliente}
                                            ></Checkbox>
                                        </>
                                    ) : (
                                        guia_de_salida?.retira_cliente ? 
                                            <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                                <span>Retira Cliente</span>
                                            </div>
                                        : 
                                            <Tooltip text="Detalle Despacho">
                                                <Button className="ml-2" variant="solid" onClick={() => {}}>Despacho</Button>
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
                                        <label>Despacho</label>
                                    </div>
                                )
                                : (
                                    // RETIRO CLIENTE
                                    <>
                                        <div className='w-full flex-col items-center'>
                                            <label>Quien Retira</label>
                                            <Validation
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.quien_retira}
                                                invalidFeedback={formik.errors.quien_retira ? String(formik.errors.quien_retira) : undefined}
                                            >
                                                <FieldWrap>
                                                    <Input
                                                        type="text"
                                                        name="quien_retira"
                                                        value={formik.values.quien_retira ?? ''}
                                                        onChange={formik.handleChange}
                                                    ></Input>
                                                </FieldWrap>
                                            </Validation>
                                        </div>
                                    </>
                                )
                            : 
                                !guia_de_salida?.retira_cliente ? (
                                    // DESPACHO
                                    <>
                                        <label>Despacho</label>
                                    </>
                                )
                                : (
                                    // RETIRO CLIENTE
                                    <>
                                        <label>Quien Retira</label>
                                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                                            <span>{guia_de_salida.quien_retira}</span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default EditarGuiaSalida