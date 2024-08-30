import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import Textarea from '../../../components/form/Textarea'
import Button from '../../../components/ui/Button'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { actualizar_guia_salida, fetchGuiaDeSalida, fetchTipoClientes } from '../../../redux/slices/guiaSalidaSlice'
import ButtonsGuiaSalida, { OPTIONS_PEDIDO, TTabsPedidos } from './ButtonsGuiaSalida'
import { optionTipoCliente, optionsTipoSalida } from '../../../utils/options.constantes'
import { fetchContentTypes } from '../../../redux/slices/registrosbaseSlice'
import TablaFrutaSolicitadaGuiaSalida from './TablaFrutaSolicitadaGuiaSalida'
import { fetchDespacho, fetchFrutaEnPedido } from '../../../redux/slices/pedidoSlice'
import TablaFrutaEnPedidoGuiaSalida from './TablaFrutaEnPedidoGuiaSalida'
import DetalleDespacho from '../Despacho/DetalleDespacho'
import { Switch } from 'antd'

const optionsEstadosPedido: TSelectOptions = [
  { value: '0', label: 'Creado'},
  { value: '1', label: 'Aprobación Solicitada'},
  { value: '2', label: 'Aprobada'},
  { value: '3', label: 'Completada y entregada'},
  { value: '4', label: 'Guía Rechazada'},
]

const DetalleGuiaSalida = () => {
  const { id } = useParams()
  const [editar, setEditar] = useState<boolean>(false)
  const guia_salida = useAppSelector((state: RootState) => state.guia_salida.guia_de_salida)
  const contenttypes = useAppSelector((state: RootState) => state.core.contenttypes)
  const clientes = useAppSelector((state: RootState) => state.guia_salida.tipo_cliente)
	const [activeTab, setActiveTab] = useState<TTabsPedidos>(OPTIONS_PEDIDO.FS)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const fruta_ficticia = useAppSelector((state: RootState) => state.guia_salida.frutas_solicitadas)
  const fruta_en_pedido = useAppSelector((state: RootState) => state.pedidos.fruta_en_pedido)


  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);


  useEffect(() => {
      dispatch(fetchContentTypes({ token, verificar_token: verificarToken  }))
  }, [])


  useEffect(() => {
    if (id){
      dispatch(fetchGuiaDeSalida({ id: parseInt(id), token, verificar_token: verificarToken  }))
    }
  }, [id])

  useEffect(() => {
    if (guia_salida?.id_pedido_padre){
      dispatch(fetchDespacho({ id: guia_salida?.id_pedido_padre, token, verificar_token: verificarToken }))
    }
  }, [guia_salida?.id_pedido_padre])
  

  useEffect(() => {
    if (guia_salida?.id_pedido_padre){
      dispatch(fetchFrutaEnPedido({ id: guia_salida.id_pedido_padre, token, verificar_token: verificarToken  }))
    }
  }, [guia_salida?.id_pedido_padre])



  const formik = useFormik({
    initialValues: {
      tipo_cliente: '',
      tipo_salida: '',
      retira_cliente: false,
      cliente: '',
      observaciones: '',
    },
    onSubmit: async (values) => {
      dispatch(actualizar_guia_salida({ id: parseInt(id!), data: { ...values, id_cliente: values.cliente }, token, verificar_token: verificarToken, action: setEditar }))
    }
  })
  
  useEffect(() => {
    if (formik.values.tipo_cliente){
      const tipo_cliente = contenttypes.find(type => type.id === Number(formik.values.tipo_cliente))?.model
      dispatch(fetchTipoClientes({ params: { tipo_cliente: tipo_cliente }, token, verificar_token: verificarToken  }))
    }
  }, [formik.values.tipo_cliente])


  useEffect(() => {
    if (guia_salida){
      formik.setFieldValue('tipo_cliente', guia_salida.tipo_cliente)
      formik.setFieldValue('tipo_salida', guia_salida.tipo_salida)
      formik.setFieldValue('cliente', guia_salida.id_cliente)
      formik.setFieldValue('observaciones', guia_salida.observaciones)
    }
  }, [guia_salida])

  const optionsClientes: TSelectOptions = clientes.map((cliente: any) => ({
    value: String(cliente.id),
    label: cliente.nombre || cliente.first_name || cliente.nombre_fantasia
  }))


  return (
    <Container breakpoint={null} className='w-full h-full flex-col gap-5'>
      <Card>
        <CardHeader>
          <CardTitle>Detalle Guia Salida</CardTitle>
          <div className='w-5/12 flex gap-5 items-center justify-end'>
            {
              editar
                ? (
                  <div className='flex gap-5'>
                    <Button
                      variant='solid'
                      color='red'
                      colorIntensity='700'
                      className='w-5/12 mt-8'
                      onClick={() => setEditar(false)}
                      >
                        Cancelar
                    </Button>

                    <Button
                      variant='solid'
                      color='emerald'
                      className='w-11/12 mt-8'
                      colorIntensity='700'
                      onClick={() => formik.handleSubmit()}
                      >
                        Guardar Cambios
                    </Button>
                  </div>
                  )
                : (
                  <Button
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    className='w-3/12 mt-8'
                    onClick={() => setEditar(true)}
                    >
                      Editar
                  </Button>
                )
            }

            {
              ['3', '4'].includes(guia_salida?.estado_guia_salida!)
                ? null
                : (
                  <div className={`${!editar ? 'w-5/12' : 'w-5/12'}`}>
                    <Label htmlFor='estado_pedidos'>Estados Pedidos: </Label>
                    <FieldWrap>
                      <SelectReact
                        options={optionsEstadosPedido}
                        id='estado_pedidos'
                        placeholder='Selecciona un opción'
                        name='estado_pedidos'
                        className='py-2'
                        value={optionsEstadosPedido.find(estado => estado?.value === guia_salida?.estado_guia_salida)}
                        onChange={(value: any) => {
                          if (guia_salida) {
                            const { estado_guia_salida } = guia_salida;
                        
                            // Verificar condiciones para permitir o evitar cambios de estado
                            if ((estado_guia_salida === '0' && value.value === '1') || 
                                (estado_guia_salida === '1' && value.value === '2') ||
                                (estado_guia_salida === '2' && ['0', '1'].includes(value.value)) ||
                                (['3', '4'].includes(estado_guia_salida))) {
                              // No hacer nada si se intenta un cambio de estado inválido
                            } else {
                              dispatch(actualizar_guia_salida({ 
                                id: guia_salida.id, 
                                data: { estado_guia_salida: value.value }, 
                                token, 
                                verificar_token: verificarToken 
                              }));
                            }
                          }
                        
                        }}
                      />
                    </FieldWrap>
                  </div> 
                )
            }
          </div>
          
        </CardHeader>

        <CardBody className='flex flex-col'>
          <section className='flex gap-5'>
            <div className='w-10/12 flex flex-col gap-5 h-full'>
              <div className='flex gap-5 '>

                <div className='w-full'>
                  <Label htmlFor='tipo_salida'>Tipo Guia Salida: </Label>
                  {
                    editar 
                      ? (
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.tipo_salida ? true : undefined}
                            invalidFeedback={formik.errors.tipo_salida ? String(formik.errors.tipo_salida) : undefined}
                          >
                            <FieldWrap>
                              <SelectReact
                                options={[{ value: '', label: 'Seleccione una opción'}, ...optionsTipoSalida]}
                                id='tipo_salida'
                                placeholder='Selecciona un opción'
                                name='tipo_salida'
                                value={optionsTipoSalida.find(tipo => tipo?.value === formik.values.tipo_salida)}
                                className='py-[8px]'
                                onChange={(value: any) => {
                                  formik.setFieldValue('tipo_salida', value.value)
                                }}
                              />
                            </FieldWrap>
                          </Validation>
                        
                      )
                      : (
                        <div className={`p-2 flex items-center h-12 rounded-md dark:bg-zinc-800`}>
                          <span>{guia_salida?.tipo_salida_label}</span>
                        </div>
                      )
                  }
                </div>

                {/* P */}
                <div className='w-full'>
                  <Label htmlFor='tipo_cliente'>Tipo Cliente: </Label>
                  {
                    editar 
                      ? (
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.tipo_cliente ? true : undefined}
                            invalidFeedback={formik.errors.tipo_cliente ? String(formik.errors.tipo_cliente) : undefined}
                          >
                            <FieldWrap>
                              <SelectReact
                                options={optionTipoCliente}
                                id='tipo_cliente'
                                placeholder='Selecciona un opción'
                                name='tipo_cliente'
                                className='py-[8px]'
                                value={optionTipoCliente.find(tipo => tipo?.label === contenttypes.find(type => type.id === Number(formik.values.tipo_cliente))?.model)}
                                onChange={(value: any) => {
                                  const id_contenttype = contenttypes.find(type => type.model === value.label)
                                  formik.setFieldValue('tipo_cliente', id_contenttype?.id)
                                }}
                              />
                            </FieldWrap>
                          </Validation>
                        
                      )
                      : (
                        <div className={`p-2 flex items-center h-12 rounded-md dark:bg-zinc-800`}>
                          <span>{guia_salida?.tipo_cliente_label}</span>
                        </div>

                      )
                  }
                </div>

                <div className={editar ? 'w-3/12' : 'w-full'}>
                  <Label htmlFor='retira_cliente'>Retira Cliente: </Label>
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
                        <div className={`p-2 flex items-center h-12 rounded-md dark:bg-zinc-800`}>
                          <span>{guia_salida?.retira_cliente ? 'Retira Cliente' : 'Despacho'}</span>
                        </div>

                      )
                  }
                </div>
              </div>

              <div className='flex gap-5'>

                {/* G */}
                <div className='w-full'>
                  <Label htmlFor='cliente'>Cliente: </Label>
                    {
                      editar 
                        ? (
                            <Validation
                              isValid={formik.isValid}
                              isTouched={formik.touched.cliente ? true : undefined}
                              invalidFeedback={formik.errors.cliente ? String(formik.errors.cliente) : undefined}
                            >
                              <FieldWrap>
                                <SelectReact
                                  options={optionsClientes}
                                  id='cliente'
                                  placeholder='Selecciona un opción'
                                  name='cliente'
                                  className='py-[8px]'
                                  value={optionsClientes.find(cliente => cliente?.value === String(formik.values.cliente))}
                                  onChange={(value: any) => {
                                    formik.setFieldValue('cliente', value.value)
                                  }}
                                />
                              </FieldWrap>
                            </Validation>
                          
                        )
                        : (
                          <div className={`p-2 flex items-center h-12 rounded-md dark:bg-zinc-800`}>
                            <span>{guia_salida?.nombre_cliente}</span>
                          </div>

                        )
                    }

                  
                </div>

                {/* P */}
                <div className='w-full'>
                  <Label htmlFor='para'>Estado Guía Salida: </Label>
                  <div className={`p-2 flex items-center h-12 rounded-md dark:bg-zinc-800`}>
                    <span>{guia_salida?.estado_guia_salida_label}</span>
                  </div>
                </div>
              </div>
              
            </div>

            <div className='w-5/12 h-full'>
              <div className='w-full h-full'>
                <Label htmlFor='observaciones'>Observaciones: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.observaciones ? true : undefined}
                  invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                >
                  <FieldWrap>
                    <Textarea 
                      id= 'observaciones'
                      name= 'observaciones'
                      className='h-36'
                      onChange={formik.handleChange}
                      value={formik.values.observaciones}
                      disabled={editar ? false : true}
                      />
                  </FieldWrap>
                </Validation>
              
              </div>
            </div>
          </section>
          {
            hasGroup(['recepcion-mp']) && guia_salida?.estado_guia_salida! < '2' && fruta_ficticia.length >= 1 && fruta_en_pedido.length >= 1
            ? (
              <div className='w-full flex justify-end mt-5 '>
                <Button
                  variant='solid'
                  color='emerald'
                  colorIntensity='700'
                  className='w-2/12'
                  onClick={() => {
                    dispatch(actualizar_guia_salida({ id: guia_salida?.id, data:{ estado_guia_salida: '2' }, token, verificar_token: verificarToken }))
                  }}
                  >
                    Aprobar Guía
                </Button>
              </div>
            )
            : null
          }
        </CardBody>
      </Card>

      {/* <Card className='mt-5'>
          <CardHeader><CardTitle>Despacho</CardTitle></CardHeader>
          <CardBody>
            <DetalleDespacho id_pedido={guia_salida?.id_pedido_padre}
            //  tipo_pedido='guiasalida' id_original={guia_salida?.id} 
             />
          </CardBody>
        </Card> */}


      {/* <Card className='mt-5'>
          <CardHeader>
            <ButtonsGuiaSalida activeTab={activeTab} setActiveTab={setActiveTab} retira_cliente={guia_salida?.retira_cliente}/>  
          </CardHeader>

          <CardBody className='p-0'>
            {
              activeTab.text === 'Fruta Solicitada'
                ? <TablaFrutaSolicitadaGuiaSalida />
                : activeTab.text === 'Fruta En Pedido'
                  ? <TablaFrutaEnPedidoGuiaSalida />
                  : null
            }
          </CardBody>
        </Card> */}

    </Container>
  )
}

export default DetalleGuiaSalida
