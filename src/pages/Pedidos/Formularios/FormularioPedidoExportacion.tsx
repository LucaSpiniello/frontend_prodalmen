import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import toast from 'react-hot-toast'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useAuth } from '../../../context/authContext'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { fetchCiudades, fetchComunas, fetchPaises, fetchProvincias, fetchRegiones } from '../../../redux/slices/registrosbaseSlice'
import { useSelector } from 'react-redux'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import clientes, { fetchClientes, fetchSucursales } from '../../../redux/slices/clientes'
import { Switch } from 'antd'
import Textarea from '../../../components/form/Textarea'
import { optionTipoVenta, optionsTipoFlete, optionstipoDespacho } from '../../../utils/options.constantes'
import { fetchPedidos } from '../../../redux/slices/pedidoSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Checkbox from '../../../components/form/Checkbox'
import { FaBackward } from 'react-icons/fa'
import { IoMdArrowRoundBack } from 'react-icons/io'

interface IFormComercializadorProps {
  setOpen?: Dispatch<SetStateAction<boolean>>
  tipo_pedido?: string
}

const FormularioPedidoExportacion: FC<IFormComercializadorProps> = ({ setOpen, tipo_pedido }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const [tipoTransporte, setTipoTransporte] = useState<string>('')
  const { verificarToken } = useAuth()


  const cliente_exportacion = useAppSelector((state: RootState) => state.clientes.clientes)
  const sucursales = useAppSelector((state: RootState) => state.clientes.sucursales_cliente)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchClientes({ params: { search: `?tipo_cliente=clienteexportacion` }, token, verificar_token: verificarToken }))
  }, [])


  const formik = useFormik({
    initialValues: {
      cliente: '', // ID del cliente
      cliente_rut: '',
      retira_cliente: false,
      tipo_venta: '',
      empresa_naviera: '',
      buque: '',
      sucursal_destino: '', // ID de la sucursal destino
      puerto_descarga: '',
      fecha_envio: '',
      fecha_entrega: '',
      moneda_venta: '1', // Valor por defecto
      tipo_flete: '', // Valor por defecto
      estado_pedido: '1', // Valor por defecto
      creado_por: '', // ID del usuario creador
      observaciones: '',
      empresa_transporte: '',
      camion: '',
      nombre_chofer: '',
      rut_chofer: '',
      numero_factura: '',
      terrestre: false,
      archivo_oc: null, // Esto es para archivos, puede que necesites manejarlo de manera diferente
      numero_oc: '',
      tipo_despacho: '0', // Valor por defecto
      valor_dolar: 0.0,
    },
    onSubmit: async (values: any) => {
      const token_verificado = await verificarToken(token!) 

      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/pedidos_exportacion/`, {
        ...values,
        creado_por: perfil?.id
      },
      token_verificado)

      if (res.ok){
        toast.success('Se ha creado correctamente el pedido')
        dispatch(fetchPedidos({ params: { search: `?tipo_pedido=${tipo_pedido}` }, token, verificar_token: verificarToken }))
        setOpen!(false)
      } else {
        toast.error('Se produjo un error, vuelve a intentarlo')
      }
    },
  })


  const optionCliente: TSelectOptions = cliente_exportacion
  .filter(cliente => cliente.rut_dni !== formik.values.cliente_rut)
  .map(cliente => ({ value: String(cliente.rut_dni!), label: cliente.nombre_fantasia! }))
  ?? []

  const optionSucursales: TSelectOptions = sucursales.
  filter(sucursal => sucursal.id !== Number(formik.values.sucursal_destino)).
  map(sucursal => ({ value: String(sucursal.id), label: sucursal.nombre }))
  ?? []

  useEffect(() => {
    if (formik.values.cliente_rut){
      dispatch(fetchSucursales({ params: { rut: `${formik.values.cliente_rut}`}, token, verificar_token: verificarToken }))
    }
  }, [formik.values.cliente_rut])
  

  return (
    <Container>
      <Card>
        <CardBody className='flex flex-col w-full gap-5'>
          <Card>
            <CardHeader><CardTitle>Información Cliente</CardTitle></CardHeader>
            <CardBody>
              <article className='flex w-full justify-between gap-2'>
                <div className='w-full'>
                  <Label htmlFor='cliente'>Cliente: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.cliente ? true : undefined}
                    invalidFeedback={formik.errors.cliente ? String(formik.errors.cliente) : undefined}
                  >
                    <FieldWrap>
                      <SelectReact
                        options={optionCliente}
                        id='cliente'
                        placeholder='Selecciona un opción'
                        name='cliente'
                        className='py-[8px]'
                        onChange={(value: any) => {
                          formik.setFieldValue('cliente_rut', value.value)
                          const cliente = cliente_exportacion.find(cliente => cliente.rut_dni === value.value)
                          formik.setFieldValue('cliente', cliente?.id)
                          
                        }}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                <div className='w-full'>
                  <Label htmlFor='sucursal_destino'>Sucursal Destino: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.sucursal_destino ? true : undefined}
                    invalidFeedback={formik.errors.sucursal_destino ? String(formik.errors.sucursal_destino) : undefined}
                  >
                    <FieldWrap>
                      <SelectReact
                        options={optionSucursales}
                        id='sucursal_destino'
                        placeholder='Selecciona un opción'
                        name='sucursal_destino'
                        className='py-[8px]'
                        onChange={(value: any) => {
                          formik.setFieldValue('sucursal_destino', value.value)
                        }}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                

                <div className='w-3/12'>
                  <Label htmlFor='retira_cliente'>Retira Cliente: </Label>
                  <FieldWrap>
                    <Switch
                      className='w-full'
                      onChange={checked => formik.setFieldValue('retira_cliente', checked)}
                      checked={formik.values.retira_cliente}
                    />
                  </FieldWrap>
                </div>
              </article>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Información Orden de Compra</CardTitle></CardHeader>
            <CardBody>
              <article className='flex w-full justify-between gap-2'>
                <div className='w-full'>
                  <Label htmlFor='archivo_oc'>Archivo OC: </Label>
                  <FieldWrap>
                    <Input
                      type='file'
                      name='archivo_oc'
                      onChange={(event) => formik.setFieldValue('archivo_oc', event.currentTarget.files ? event.currentTarget.files[0] : null)}
                      className='py-3'
                    />
                  </FieldWrap>
                </div>

                <div className='w-full'>
                  <Label htmlFor='numero_oc'>Número OC: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.numero_oc ? true : undefined}
                    invalidFeedback={formik.errors.numero_oc ? String(formik.errors.numero_oc) : undefined}
                  >
                    <FieldWrap>
                      <Input
                        type='text'
                        name='numero_oc'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.numero_oc}
                      />
                    </FieldWrap>
                  </Validation>
                </div>
              </article>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Información de Venta</CardTitle></CardHeader>
            <CardBody>
              <article className='flex w-full justify-between gap-2'>
                <div className='w-full'>
                  <Label htmlFor='moneda_venta'>Moneda de Venta: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.moneda_venta ? true : undefined}
                    invalidFeedback={formik.errors.moneda_venta ? String(formik.errors.moneda_venta) : undefined}
                  >
                    <FieldWrap>
                      <SelectReact
                        name='moneda_venta'
                        options={optionTipoVenta}
                        className='py-[8px]'
                        onChange={(value: any) => {
                          formik.setFieldValue('moneda_venta', value.value)
                        }}
                        value={optionTipoVenta.find(tipo => tipo.value === formik.values.moneda_venta)}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                <div className='w-full'>
                  <Label htmlFor='tipo_venta'>Tipo de Venta: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.tipo_venta ? true : undefined}
                    invalidFeedback={formik.errors.tipo_venta ? String(formik.errors.tipo_venta) : undefined}
                  >
                    <FieldWrap>
                      <Input
                        type='text'
                        name='tipo_venta'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.tipo_venta}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                <div className='w-full flex-col items-center'>
                  <Label htmlFor='valor_dolar'>Valor Dólar: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.valor_dolar ? true : undefined}
                    invalidFeedback={formik.errors.valor_dolar ? String(formik.errors.valor_dolar) : undefined}
                  >
                    <FieldWrap>
                      <Input
                        type='number'
                        name='valor_dolar'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.valor_dolar}
                      />
                    </FieldWrap>
                  </Validation>
                </div>
              </article>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Información de Envio</CardTitle></CardHeader>
            <CardBody>
              <article className='flex w-full justify-between gap-2'>
                <div className='w-full'>
                  <Label htmlFor='fecha_envio'>Fecha de Envío: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.fecha_envio ? true : undefined}
                    invalidFeedback={formik.errors.fecha_envio ? String(formik.errors.fecha_envio) : undefined}
                  >
                    <FieldWrap>
                      <Input
                        type='date'
                        name='fecha_envio'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.fecha_envio}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                <div className='w-full'>
                  <Label htmlFor='fecha_entrega'>Fecha de Entrega: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.fecha_entrega ? true : undefined}
                    invalidFeedback={formik.errors.fecha_entrega ? String(formik.errors.fecha_entrega) : undefined}
                  >
                    <FieldWrap>
                      <Input
                        type='date'
                        name='fecha_entrega'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.fecha_entrega}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                <div className='w-full'>
                  <Label htmlFor='tipo_flete'>Tipo de Flete: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.tipo_flete ? true : undefined}
                    invalidFeedback={formik.errors.tipo_flete ? String(formik.errors.tipo_flete) : undefined}
                  >
                    <FieldWrap> 
                      <SelectReact
                        name='tipo_flete'
                        options={[{value: '0', label: 'Sin Seleccionar'}, ...optionsTipoFlete]}
                        className='py-[8px]'
                        onChange={(value: any) => 
                          formik.setFieldValue('tipo_flete', value.value)}
                        value={optionsTipoFlete.find(tipo => tipo.value === formik.values.tipo_flete)}
                      />
                    </FieldWrap>
                  </Validation>
                </div>
              </article>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Transporte</CardTitle>
              {
                tipoTransporte === ''
                  ? null
                  : (
                    <div className='flex items-center cursor-pointer'>
                      <IoMdArrowRoundBack style={{ fontSize: 25 }} onClick={() => setTipoTransporte('')}/> Volver
                    </div>
                  )
              }
            </CardHeader>
            <CardBody>
                {
                  tipoTransporte === 'Maritimo'
                    ? (
                      <article className='flex w-full justify-between gap-2'>
                        <div className='w-full'>
                          <Label htmlFor='empresa_naviera'>Empresa Naviera: </Label>
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.empresa_naviera ? true : undefined}
                            invalidFeedback={formik.errors.empresa_naviera ? String(formik.errors.empresa_naviera) : undefined}
                          >
                            <FieldWrap>
                              <Input
                                type='text'
                                name='empresa_naviera'
                                onChange={formik.handleChange}
                                className='py-3'
                                value={formik.values.empresa_naviera}
                              />
                            </FieldWrap>
                          </Validation>
                        </div>

                        <div className='w-full'>
                          <Label htmlFor='buque'>Buque: </Label>
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.buque ? true : undefined}
                            invalidFeedback={formik.errors.buque ? String(formik.errors.buque) : undefined}
                          >
                            <FieldWrap>
                              <Input
                                type='text'
                                name='buque'
                                onChange={formik.handleChange}
                                className='py-3'
                                value={formik.values.buque}
                              />
                            </FieldWrap>
                          </Validation>
                        </div>

                        <div className='w-full'>
                          <Label htmlFor='puerto_descarga'>Puerto de Descarga: </Label>
                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.puerto_descarga ? true : undefined}
                            invalidFeedback={formik.errors.puerto_descarga ? String(formik.errors.puerto_descarga) : undefined}
                          >
                            <FieldWrap>
                              <Input
                                type='text'
                                name='puerto_descarga'
                                onChange={formik.handleChange}
                                className='py-3'
                                value={formik.values.puerto_descarga}
                              />
                            </FieldWrap>
                          </Validation>
                        </div>
                      </article>
                    )
                    : tipoTransporte === 'Terrestre'
                      ? (
                        <article className='flex w-full justify-between gap-2'>
                          <div className='w-full'>
                            <Label htmlFor='empresa_transporte'>Empresa de Transporte: </Label>
                            <Validation
                              isValid={formik.isValid}
                              isTouched={formik.touched.empresa_transporte ? true : undefined}
                              invalidFeedback={formik.errors.empresa_transporte ? String(formik.errors.empresa_transporte) : undefined}
                            >
                              <FieldWrap>
                                <Input
                                  type='text'
                                  name='empresa_transporte'
                                  onChange={formik.handleChange}
                                  className='py-3'
                                  value={formik.values.empresa_transporte}
                                />
                              </FieldWrap>
                            </Validation>
                          </div>

                          <div className='w-full'>
                            <Label htmlFor='camion'>Camión: </Label>
                            <Validation
                              isValid={formik.isValid}
                              isTouched={formik.touched.camion ? true : undefined}
                              invalidFeedback={formik.errors.camion ? String(formik.errors.camion) : undefined}
                            >
                              <FieldWrap>
                                <Input
                                  type='text'
                                  name='camion'
                                  onChange={formik.handleChange}
                                  className='py-3'
                                  value={formik.values.camion}
                                />
                              </FieldWrap>
                            </Validation>
                          </div>

                          <div className='w-full'>
                            <Label htmlFor='nombre_chofer'>Nombre del Chofer: </Label>
                            <Validation
                              isValid={formik.isValid}
                              isTouched={formik.touched.nombre_chofer ? true : undefined}
                              invalidFeedback={formik.errors.nombre_chofer ? String(formik.errors.nombre_chofer) : undefined}
                            >
                              <FieldWrap>
                                <Input
                                  type='text'
                                  name='nombre_chofer'
                                  onChange={formik.handleChange}
                                  className='py-3'
                                  value={formik.values.nombre_chofer}
                                />
                              </FieldWrap>
                            </Validation>
                          </div>

                          <div className='w-full'>
                            <Label htmlFor='rut_chofer'>RUT del Chofer: </Label>
                            <Validation
                              isValid={formik.isValid}
                              isTouched={formik.touched.rut_chofer ? true : undefined}
                              invalidFeedback={formik.errors.rut_chofer ? String(formik.errors.rut_chofer) : undefined}
                            >
                              <FieldWrap>
                                <Input
                                  type='text'
                                  name='rut_chofer'
                                  onChange={formik.handleChange}
                                  className='py-3'
                                  value={formik.values.rut_chofer}
                                />
                              </FieldWrap>
                            </Validation>
                          </div>
                        </article>
                      )
                      : (
                        <article className='flex w-full justify-between gap-2'>
                          <div className='w-full'>
                            <Label htmlFor='transporte'>Transporte Terrestre: </Label>
                            <Checkbox
                              checked={tipoTransporte === 'Terrestre' ? true : false} 
                              onClick={() => setTipoTransporte('Terrestre')}/>
                          </div>

                          <div className='w-full'>
                            <Label htmlFor='transporte'>Transporte Martitimo: </Label>
                            <Checkbox
                              checked={tipoTransporte === 'Martitimo' ? true : false} 
                              onClick={() => setTipoTransporte('Maritimo')}/>
                          </div>
                        </article>
                      )
                }
            </CardBody>
          </Card>

          <div className='w-full flex justify-end'>
            <Button
              variant='solid'
              color='sky'
              colorIntensity='700'
              size='lg'
              onClick={() => formik.handleSubmit()}
            >
              Registrar Pedido Mercado Interno
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioPedidoExportacion
