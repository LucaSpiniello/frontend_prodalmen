import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchDespacho, fetchFrutaEnPedido, fetchPedidoInterno } from '../../../redux/slices/pedidoSlice'
import TablaFrutaMercadoInterno from './TablaFrutaMercadoInterno'
import { fetchTodosPalletsProductoTerminados } from '../../../redux/slices/embalajeSlice'
import ButtonsPedido, { OPTIONS_PEDIDO, TTabsPedidos } from '../ButtonsDetallePedido'
import DetalleDespacho from '../Despacho/DetalleDespacho'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik'
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { TSelectOptions } from '../../../components/form/SelectReact'
import TablaFrutaPedidoInterno from './TablaFrutaPedidoInterno'
import EditarPedidoMercadoInterno from '../Formularios/EditarPedidoMercadoInterno'


const optionsEstadosPedido: TSelectOptions = [
  { value: '1', label: 'Pedido Creado'},
  { value: '2', label: 'Pedido En Preparacion'},
  { value: '3', label: 'Pedido Completado'},
  { value: '4', label: 'Pedido Entregado y Finalizado'},
  { value: '5', label: 'Pedido Devuelto a Bodega'},
]


const DetallePedidoMercadoInterno = () => {
  const { id } = useParams() 
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const [activeTab, setActiveTab] = useState<TTabsPedidos>(OPTIONS_PEDIDO.FS)
  const [editar, setEditar] = useState<boolean>(false)
  const pedido_interno = useAppSelector((state: RootState) => state.pedidos.pedido_interno)
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho) 

  useEffect(() => {
      if (pedido_interno){
        dispatch(fetchDespacho({ id: pedido_interno.id_pedido_padre, token, verificar_token: verificarToken }))
      }
  }, [pedido_interno])

  const formik = useFormik({
    initialValues: {
      fecha_entrega: '', // Fecha y hora
      archivo_oc: null, // Manejar la carga de archivos adecuadamente
      condicion_pago: '', // Condición de pago
      observaciones: '',
      numero_oc: '',
      numero_factura: '',
      fecha_recepcion: '', // Fecha y hora
      fecha_facturacion: '', // Fecha
      valor_dolar_fact: 0.0,
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/pedidos_mercado_interno/${id}/`, 
      { ...values,
        condicion_pago: values.condicion_pago
      }
      , token_verificado)
      if (res.ok){
        toast.success('Se ha actualizado correctamente el pedido')
        dispatch(fetchPedidoInterno({ id: pedido_interno?.id, token, verificar_token: verificarToken }))
        setEditar(false)
      } else {
        toast.error('Se produjo un error, vuelve a intentarlo')
      }
    },
  })

  useEffect(() => {
    if (pedido_interno){
      formik.setFieldValue('condicion_pago', pedido_interno.condicion_pago)
      formik.setFieldValue('fecha_entrega', pedido_interno.fecha_entrega)
      formik.setFieldValue('numero_factura', pedido_interno.numero_factura)
    }
  }, [pedido_interno])

  useEffect(() => {
    if (pedido_interno?.id_pedido_padre){
      dispatch(fetchDespacho({ id: pedido_interno?.id_pedido_padre, token, verificar_token: verificarToken }))
    }
  }, [pedido_interno?.id_pedido_padre])

  useEffect(() => {
    if (pedido_interno?.id_pedido_padre){
      dispatch(fetchFrutaEnPedido({ id: pedido_interno?.id_pedido_padre, token, verificar_token: verificarToken }))
    }
  }, [pedido_interno?.id_pedido_padre])

  useEffect(() => {
    if (id){
    dispatch(fetchPedidoInterno({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => {
    dispatch(fetchTodosPalletsProductoTerminados({ token, verificar_token: verificarToken }))
  }, [])

  return (
    <PageWrapper>
      <Container breakpoint={null} className='w-full h-full flex flex-col gap-y-5'>
        {/* { pedido_interno && pedido_interno.estado_pedido } */}
        <EditarPedidoMercadoInterno></EditarPedidoMercadoInterno>
        {/* {
          pedido_interno?.retira_cliente
            ? null
            : (
              <Card>
                <CardHeader><CardTitle>Despacho</CardTitle></CardHeader>
                <CardBody>
                  <DetalleDespacho id_pedido={pedido_interno?.id_pedido_padre}
                  //  tipo_pedido='interno' id_original={pedido_interno?.id}
                   />
                </CardBody>
              </Card>
            )
        }

        <Card>
          <CardHeader>
            <ButtonsPedido activeTab={activeTab} setActiveTab={setActiveTab} retira_cliente={pedido_interno?.retira_cliente}/>  
          </CardHeader>

          <CardBody className='p-0'>
            {
              activeTab.text === 'Fruta Solicitada'
                ? <TablaFrutaMercadoInterno fruta_pedido_interno={pedido_interno?.fruta_pedido} pedido_interno={pedido_interno!}/>
                : activeTab.text === 'Fruta En Pedido'
                  ? <TablaFrutaPedidoInterno />
                  : null
            }
          </CardBody>
        </Card> */}
      </Container>
    </PageWrapper>
  )
}

export default DetallePedidoMercadoInterno


              {/* <div className={`${!editar ? 'w-4/12' : 'w-full'}`}>
                <Label htmlFor='estado_pedidos'>Estados Pedidos: </Label>
                <FieldWrap>
                  <SelectReact
                    options={optionsEstadosPedido}
                    id='estado_pedidos'
                    placeholder='Selecciona un opción'
                    name='estado_pedidos'
                    className='py-2'
                    value={optionsEstadosPedido.find(estado => estado?.value === pedido_interno?.estado_pedido)}
                    onChange={(value: any) => {
                      if (value.value === pedido_interno?.estado_pedido) {
                        // No se necesita hacer nada si el estado no ha cambiado
                      } else if (
                        (pedido_interno?.estado_pedido === '1' && value.value === '2') || 
                        (pedido_interno?.estado_pedido === '2' && value.value === '3') ||
                        (pedido_interno?.estado_pedido === '3' && value.value === '4') || 
                        (pedido_interno?.estado_pedido === '3' && value.value === '5') ||
                        (pedido_interno?.estado_pedido === '4' && (value.value === '4' || value.value === '5')) ||
                        (pedido_interno?.estado_pedido === '5' && (value.value === '4' || value.value === '5'))
                      ) {
                        // Si la transición es válida, actualizar el estado
                        dispatch(actualizar_estado_pedido_interno({
                          id: pedido_interno?.id,
                          data: {
                            estado_pedido: value.value
                          },
                          token,
                          verificar_token: verificarToken
                        }));
                      } else {
                        // Transición no permitida
                        console.error('Transición de estado no permitida');
                      }
                    }}
                  />
                </FieldWrap>
                </div>  */}

                {/* <Card>
          <CardHeader>
            <CardTitle>Pedido Mercado Interno N° {id}</CardTitle>
            <div className='w-5/12 flex gap-5 items-center  justify-end'>
              {
                editar
                  ? (
                    <>
                      <Button
                        variant='solid'
                        color='red'
                        colorIntensity='700'
                        className='w-5/12'
                        onClick={() => setEditar(false)}
                        >
                          Cancelar
                      </Button>
                      <Button
                        variant='solid'
                        color='emerald'
                        colorIntensity='700'
                        className='w-5/12'

                        onClick={() => formik.handleSubmit()}
                        >
                          Guardar Cambios
                      </Button>
                    </>
                  )
                  : (
                    <Button
                      variant='solid'
                      color='blue'
                      className='w-3/12'
                      onClick={() => setEditar(true)}
                      >
                        Editar
                    </Button>
                  )
              }

             { despacho && despacho.rut_chofer !== 'Sin registro'
                ? null
                : (
                  <div className='flex items-center justify-center'>
                    <ModalForm
                      variant='solid'
                      color='purple'
                      colorIntensity='700'
                      open={registroDespacho}
                      setOpen={setRegistroDespacho}
                      title='Registro Información Despacho'
                      textButton={`Registro Información Despacho` }
                      >
                        <RegistroInfoDespacho id_pedido={pedido_interno?.id_pedido_padre} setOpen={setRegistroDespacho}/>
                    </ModalForm>
                  </div>
                )
             }
            </div>
          </CardHeader>
          <CardBody>
            <div className='flex flex-col w-full gap-5'>
              <article className='flex w-full gap-2'>
                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Solicitado Por: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_interno?.solicitado_por_label}</span>
                  </div>
                </div>

                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Cliente: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_interno?.cliente_info.nombre}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">{pedido_interno?.retira_cliente ? 'Quién Recibe' : 'Despacho'}</label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_interno?.retira_cliente_info}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="condicion_pago">Condición Pago: </label>
                  {
                    editar
                      ? (
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.condicion_pago}
                          invalidFeedback={formik.errors.condicion_pago ? String(formik.errors.condicion_pago) : undefined}
                        >
                          <FieldWrap>
                            <SelectReact
                              options={optionsCondicionPago}
                              id='condicion_pago'
                              placeholder='Selecciona un opción'
                              name='condicion_pago'
                              className='h-12'
                              value={optionsCondicionPago.find(pago => pago.value === formik.values.condicion_pago)}
                              onChange={(value: any) => {
                                formik.setFieldValue('condicion_pago', value.value)
                              }}
                            />
                          </FieldWrap>
                        </Validation>
                      )
                      : (
                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                          <span>{pedido_interno?.condicion_pago_label}</span>
                        </div>
                      )
                  }
                </div>
              </article>
              
              <article className='flex w-full gap-2'>
                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Estado Pedido: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_interno?.estado_pedido_label}</span>
                  </div>
                </div>

                <div className='w-full flex-col items-center'>
                  <label htmlFor="fecha_facturacion">Fecha Facturación: </label>
                  {
                    editar
                      ? (
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
                                value={formik.values.fecha_facturacion}
                              />
                            </FieldWrap>
                          </Validation>
                        )
                      )
                      : (
                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                          <span>{pedido_interno?.fecha_facturacion ? format(pedido_interno?.fecha_facturacion!, { date: 'full'}, 'es' ) : 'Aun no hay datos'}</span>
                        </div>
                      )
                  }
                  
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Fecha Entrega: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{format(pedido_interno?.fecha_entrega!, { date: 'medium', time: 'short' }, 'es' )}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="fecha_recepcion">Fecha Recepción: </label>
                  {
                    editar
                      ? (
                        <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.fecha_recepcion}
                            invalidFeedback={formik.errors.fecha_recepcion ? String(formik.errors.fecha_recepcion) : undefined}
                          >
                            <FieldWrap>
                              <Input
                                type='date'
                                id='fecha_recepcion'
                                name='fecha_recepcion'
                                onChange={formik.handleChange}
                                value={formik.values.fecha_recepcion}
                              />
                            </FieldWrap>
                          </Validation>
                      )
                      : (
                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                          <span>{pedido_interno?.fecha_recepcion ? format(pedido_interno?.fecha_recepcion!, { date: 'medium', time: 'short' }, 'es' ) : 'Aun no hay datos'}</span>
                        </div>
                      )
                  }
                  
                </div>
              </article>

              <article className='flex w-full gap-2'>
                <div className='w-full flex-col items-center'>
                  <label htmlFor="numero_factura">N° Factura: </label>
                  {
                    editar
                      ? (
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
                              value={formik.values.numero_factura}
                            />
                          </FieldWrap>
                        </Validation>
                      )
                      : (
                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                          <span>{pedido_interno?.numero_factura ? pedido_interno?.numero_factura : 'Aun no registrado'}</span>
                        </div>
                      )
                  }
                </div>

                <div className='w-full flex-col items-center'>
                  <label htmlFor="numero_oc">N° Orden de Compra: </label>
                  {
                    editar
                      ? (
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
                              value={formik.values.numero_oc}
                            />
                          </FieldWrap>
                        </Validation>
                      )
                      : (
                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                          <span>{pedido_interno?.numero_oc}</span>
                        </div>
                      )
                  }
                  
                </div>


                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Moneda: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_interno?.tipo_venta}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                    <label htmlFor="observaciones">Observaciones: </label>
                    {
                      editar
                        ? (
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.observaciones}
                            invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                            >
                              <FieldWrap>
                                <Textarea
                                  id = 'observaciones'
                                  name='observaciones'
                                  value = {formik.values.observaciones}
                                  onChange={formik.handleChange} 
                                  />
                              </FieldWrap>
                            </Validation>
                        )
                        : (
                          <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md h-16`}>
                            <span>{pedido_interno?.observaciones}</span>
                          </div>
                        )
                    }
                </div>
              </article>
            </div>
          </CardBody>
        </Card> */}