import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { actualizar_estado_pedido_exportacion, fetchDespacho, fetchFrutaEnPedido, fetchPedidoExportacion, fetchPedidoInterno } from '../../../redux/slices/pedidoSlice'
import { format } from '@formkit/tempo'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button'
import { useFormik } from 'formik'
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import Label from '../../../components/form/Label'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import Input from '../../../components/form/Input'
import Validation from '../../../components/form/Validation'
import ButtonsPedido, { OPTIONS_PEDIDO, TTabsPedidos } from '../ButtonsDetallePedido'
import DetalleDespacho from '../Despacho/DetalleDespacho'
import { Switch } from 'antd'

const optionsEstadosPedido: TSelectOptions = [
  { value: '1', label: 'Creado'},
  { value: '2', label: 'En Preparacion'},
  { value: '3', label: 'Completado'},
  { value: '4', label: 'Pedido Entregado y Finalizado'},
  { value: '5', label: 'Pedido Solicitado'},
  { value: '6', label: 'Pedido Cancelado'},
  { value: '7', label: 'Pedido Devuelto'},
]

interface EditarExportacionProps {
    id: string;  // Define id como un prop
}

const EditarExportacion: React.FC<EditarExportacionProps> = ({ id }) => {

  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const pedido_exportacion = useAppSelector((state: RootState) => state.pedidos.pedido_exportacion)

  useEffect(() => {
    if (id){
    dispatch(fetchPedidoExportacion({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => {
    if (pedido_exportacion?.id_pedido_padre){
      dispatch(fetchFrutaEnPedido({ id: pedido_exportacion?.id_pedido_padre, token, verificar_token: verificarToken }))
    }
  }, [pedido_exportacion?.id_pedido_padre])

  useEffect(() => {
    if (pedido_exportacion?.id_pedido_padre){
      dispatch(fetchDespacho({ id: pedido_exportacion?.id_pedido_padre, token, verificar_token: verificarToken }))
    }
  }, [pedido_exportacion?.id_pedido_padre])


  const formik = useFormik({
    initialValues: {
      archivo_oc: null, // Manejar la carga de archivos adecuadamente
      observaciones: '',
      numero_factura: '',
      retira_cliente: false,
      numero_oc: 'No hay Número Orden de Compra',
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/pedidos_exportacion/${id}/`, 
      { ...values}
      , token_verificado)
      if (res.ok){
        toast.success('Se ha actualizado correctamente el pedido')
        dispatch(fetchPedidoExportacion({ id: pedido_exportacion?.id, token, verificar_token: verificarToken }))
        setEditar(false)
      } else {
        toast.error('Se produjo un error, vuelve a intentarlo')
      }
    },
  })

  useEffect(() => {
    if (pedido_exportacion){
      formik.setFieldValue('archivo_oc', pedido_exportacion.archivo_oc )
      formik.setFieldValue('observaciones', pedido_exportacion.observaciones )
      formik.setFieldValue('numero_factura', pedido_exportacion.numero_factura )
      formik.setFieldValue('numero_oc', pedido_exportacion.numero_oc )
    }
  }, [pedido_exportacion])


  return (
    <PageWrapper>
      <Container breakpoint={null} className='w-full h-full flex flex-col gap-y-5'>
        <Card>
        <CardHeader>
            <CardTitle>Pedido Exportación N° {id}</CardTitle>
            <div className='w-5/12 flex gap-5 items-center justify-end'>
                 
              {
                editar
                  ? (
                    <>
                      <Button
                        variant='solid'
                        color='red'
                        className='w-5/12 mt-8'
                        onClick={() => setEditar(false)}
                        >
                          Cancelar
                      </Button>

                      <Button
                        variant='solid'
                        color='emerald'
                        className='w-11/12 mt-8'

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
                      className='w-3/12 mt-8'
                      onClick={() => setEditar(true)}
                      >
                        Editar
                    </Button>
                  )
              }

              <div className={`${!editar ? 'w-4/12' : 'w-full'}`}>
                <Label htmlFor='estado_pedidos'>Estados Pedidos: </Label>
                <FieldWrap>
                  <SelectReact
                    options={optionsEstadosPedido}
                    id='estado_pedidos'
                    placeholder='Selecciona un opción'
                    name='estado_pedidos'
                    className='py-2'
                    value={optionsEstadosPedido.find(estado => estado?.value === pedido_exportacion?.estado_pedido)}
                    onChange={(value: any) => {
                      if (pedido_exportacion) {
                        const { estado_pedido } = pedido_exportacion;
                    
                        // Verificar condiciones para permitir o evitar cambios de estado
                        if (
                          (estado_pedido === '0' && value.value === '1') || // De 0 a 1
                          (estado_pedido === '1' && value.value === '2') || // De 1 a 2
                          (estado_pedido === '2' && value.value === '3') || // De 2 a 3
                          (estado_pedido === '3' && ['4', '6'].includes(value.value)) || // De 3 a 4 o 6
                          (['4', '6'].includes(estado_pedido)) // Si está en 4 o 6, no cambiar
                        ) {
                          dispatch(actualizar_estado_pedido_exportacion({
                            id: pedido_exportacion.id,
                            data: { estado_pedido: value.value },
                            token,
                            verificar_token: verificarToken
                          }));
                        }
                      }
                    }}
                  />
                </FieldWrap>
              </div> 
            </div>
          </CardHeader>
          <CardBody>
            <div className='flex flex-col w-full gap-5'>
              {/* 1 */}

              <article className='flex w-full gap-2'>
                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Solicitado Por: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_exportacion?.solicitado_por_label}</span>
                  </div>
                </div>

                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Cliente: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_exportacion?.cliente_info.nombre}</span>
                  </div>
                </div>


                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Tipo Despacho: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_exportacion?.tipo_despacho_label}</span>
                  </div>
                </div>

                <div className={editar ? 'w-3/12' : 'w-full'}>
                  <label htmlFor='retira_cliente'>{pedido_exportacion?.retira_cliente ? 'Retira Cliente' : 'Despacho'}</label>
                  {
                    editar 
                      ? (
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.retira_cliente ? true : undefined}
                            invalidFeedback={formik.errors.retira_cliente ? String(formik.errors.retira_cliente) : undefined}
                          >
                            <FieldWrap>
                              <Switch
                                className='w-full mt-2'
                                onChange={checked => formik.setFieldValue('retira_cliente', checked)}
                                checked={formik.values.retira_cliente}
                                
                              />
                            </FieldWrap>
                          </Validation>
                        
                      )
                      : (
                        <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                          <span>{pedido_exportacion?.retira_cliente ? 'Retira Cliente' : 'Despacho'}</span>
                        </div>

                      )
                  }
                </div>
              </article>

              {/* 2 */}

              
              <article className='flex w-full gap-2'>
                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Estado Pedido: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_exportacion?.estado_pedido_label}</span>
                  </div>
                </div>

                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Fecha Facturación: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_exportacion?.fecha_facturacion ? format(pedido_exportacion?.fecha_facturacion!, { date: 'full'}, 'es' ) : 'No hay registro'}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Fecha Recepción: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                  <span>{format(pedido_exportacion?.fecha_envio!, { date: 'medium', time: 'short' }, 'es' )}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Fecha Entrega: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{format(pedido_exportacion?.fecha_entrega!, { date: 'medium', time: 'short' }, 'es' )}</span>
                  </div>
                </div>

                
              </article>

              {/* 3 */}

              <article className='flex w-full gap-2'>
                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Estado Pedido: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_exportacion?.empresa_naviera}</span>
                  </div>
                </div>

                <div className='w-full flex-col items-center'>
                  <label htmlFor="rut_productor">Empresa Transporte: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                    <span>{pedido_exportacion?.empresa_transporte}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Buque: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_exportacion?.buque}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Puerto Descarga: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_exportacion?.puerto_descarga}</span>
                  </div>
                </div>
              </article>

              {/* 4 */}


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
                          <span>{pedido_exportacion?.numero_factura}</span>
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
                                id='numero_oc' 
                                name='numero_oc'
                                onChange={formik.handleChange}
                                value={formik.values.numero_oc}
                                defaultValue={formik.values.numero_oc}
                                
                                />
                            </FieldWrap>
                          </Validation>
                        )
                        : (
                          <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                            <span>{pedido_exportacion?.numero_oc}</span>
                          </div>
                        )
                    }
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Tipo Flete: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_exportacion?.tipo_flete_label}</span>
                  </div>
                </div>

                <div className='w-full h-full flex-col items-center'>
                  <label htmlFor="rut_productor">Moneda: </label>
                  <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                    <span>{pedido_exportacion?.moneda_venta_label}</span>
                  </div>
                </div>
              </article>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Despacho</CardTitle></CardHeader>
          <CardBody>
            <DetalleDespacho id_pedido={pedido_exportacion?.id_pedido_padre} 
            // tipo_pedido='exportacion' id_original={pedido_exportacion?.id} 
            />
          </CardBody>
        </Card>

        {/* <Card>
          <CardHeader>
            <ButtonsPedido activeTab={activeTab} setActiveTab={setActiveTab} retira_cliente={pedido_exportacion?.retira_cliente}/>  
          </CardHeader>

          <CardBody className='p-0'>
            {
              activeTab.text === 'Fruta Solicitada'
                ? <TablaFrutaPedidoExportacion />
                : activeTab.text === 'Fruta En Pedido'
                  ? <TablaPedidoExportacion />
                  : null
            }
          </CardBody>
        </Card> */}
      </Container>
    </PageWrapper>
  )
}

export default EditarExportacion