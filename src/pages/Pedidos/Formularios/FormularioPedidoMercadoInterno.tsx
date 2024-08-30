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
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { fetchClientes, fetchSucursales } from '../../../redux/slices/clientes'
import { Switch } from 'antd'
import { optionTipoVenta, optionsCondicionPago } from '../../../utils/options.constantes'
import { fetchDespacho, fetchFrutaDespacho, fetchPedidos } from '../../../redux/slices/pedidoSlice'
import Textarea from '../../../components/form/Textarea'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormComercializadorProps {
  setOpen?: Dispatch<SetStateAction<boolean>>
  tipo_cliente?: string
}

const FormularioPedidoMercadoInterno: FC<IFormComercializadorProps> = ({ setOpen, tipo_cliente }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  
  const clientes = useAppSelector((state: RootState) => state.clientes.clientes)
  const sucursales = useAppSelector((state: RootState) => state.clientes.sucursales_cliente)
  const dolar = useAppSelector((state: RootState) => state.pedidos.dolar)
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho)
  const [optionsSucursales, setOptionsSucursales] = useState<TSelectOptions>([])

  useEffect(() => {
    dispatch(fetchClientes({ params: { search: `?tipo_cliente=clientemercadointerno` }, token, verificar_token: verificarToken }))
  }, [])

  const formik = useFormik({
    initialValues: {
      cliente: '', // ID del cliente
      cliente_rut: '',
      retira_cliente: false,
      sucursal: '', // ID de la sucursal
      fecha_entrega: '', // Fecha y hora
      numero_oc: '',
      archivo_oc: null, // Manejar la carga de archivos adecuadamente
      condicion_pago: '', // Condición de pago
      observaciones: '',
      quien_retira: '',
      tipo_venta: '', // Valor por defecto
      valor_dolar_fact: 0.0,
      numero_factura: '',
    },
    onSubmit: async (values) => {
      // Lógica para enviar el formulario
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/pedidos_mercado_interno/`, 
      {
        ...values,
        solicitado_por: perfil?.id
      }
      , token_verificado)
      if (res.ok){
        toast.success('Se ha creado correctamente el pedido')
        //@ts-ignore
        dispatch(fetchPedidos({ params: { search: `?tipo_pedido=${tipo_cliente}` }, token, verificar_token: verificarToken }))

        setOpen!(false)
      } else {
        toast.error('Se produjo un error, vuelve a intentarlo')
      }
    },
  })

  useEffect(() => {
    if (formik.values.tipo_venta === '2'){
      formik.setFieldValue('valor_dolar_fact', 970)
    } else if (formik.values.tipo_venta === '1'){
      formik.setFieldValue('valor_dolar_fact', 0)
    }

  }, [formik.values.tipo_venta, dolar])


  useEffect(() => {
    if (formik.values.cliente_rut){
      dispatch(fetchSucursales({ params: { rut: `${formik.values.cliente_rut}`}, token, verificar_token: verificarToken }))
    }
  }, [formik.values.cliente_rut])

  const optionCliente: TSelectOptions = clientes
    .filter(cliente => cliente.rut_dni !== formik.values.cliente_rut)
    .map(cliente => ({ value: String(cliente.rut_dni!), label: cliente.nombre_fantasia! }))
    ?? []

  useEffect(() => {
    const lista: TSelectOptions = []
    sucursales.forEach((element) => {
      lista.push({value: `${element.id}`, label: element.nombre})
    })
    setOptionsSucursales(lista)
  }, [sucursales])

  return (
    <Container>
      <Card>
        <CardBody className='flex flex-col w-full gap-5'>
          <Card>
            <CardHeader><CardTitle>Información de Cliente</CardTitle></CardHeader>
            <article className='flex justify-between gap-5'>
              <div className='flex w-full flex-col justify-center'>
                <Label htmlFor='cliente'>Cliente:</Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.cliente}
                  invalidFeedback={formik.errors.cliente ? String(formik.errors.cliente) : undefined}
                >
                  <FieldWrap>
                    <SelectReact
                      options={optionCliente}
                      id='cliente'
                      placeholder='Selecciona un opción'
                      name='cliente'
                      className='h-12'
                      onChange={(value: any) => {
                        formik.setFieldValue('cliente_rut', value.value)
                        const cliente = clientes.find(cliente => cliente.rut_dni === value.value)
                        formik.setFieldValue('cliente', cliente?.id)
                      }}
                    />
                  </FieldWrap>
                </Validation>
              </div>

              {
                !formik.values.retira_cliente
                  ? (
                    <div className='flex w-full flex-col justify-center'>
                    <Label htmlFor='sucursal'>Sucursal:</Label>
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
                          value={{value: formik.values.sucursal, label: sucursales.find(suc => `${suc.id}` == formik.values.sucursal)?.nombre ?? ''}}
                          onChange={(value: any) => {
                            formik.setFieldValue('sucursal', value.value)
                          }}
                        />
                      </FieldWrap>
                    </Validation>
                  </div>
                  )
                  : (
                    <div className='flex w-full flex-col justify-center'>
                      <Label htmlFor='quien_retira'>Quién Recibe:</Label>
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.quien_retira}
                        invalidFeedback={formik.errors.quien_retira ? String(formik.errors.quien_retira) : undefined}
                      >
                        <FieldWrap>
                          <Input
                            type='text'
                            name='quien_retira'
                            className='py-2.5'
                            onChange={formik.handleChange}
                            value={formik.values.quien_retira}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>
                  )
              }

              <div className='flex w-full flex-col justify-center'>
                <Label htmlFor='condicion_pago'>Condición de Pago:</Label>
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
                      onChange={(value: any) => {
                        formik.setFieldValue('condicion_pago', value.value)
                      }}
                    />
                  </FieldWrap>
                </Validation>
              </div>


              <div className='flex w-6/12 flex-col items-center justify-center gap-5'>
                <div className='w-full flex items-center justify-between'>
                  <span>Despacho</span>
                  <span>Retira</span>
                </div>
                <Switch
                  className='w-full'
                  onChange={checked => {formik.setFieldValue('retira_cliente', checked); ; if (checked) { formik.setFieldValue('sucursal', '')}}}
                  checked={formik.values.retira_cliente}
                />
              </div>
            </article>
          </Card>

          <Card>
            <CardHeader><CardTitle>Información Orden de Compra</CardTitle></CardHeader>
            <CardBody>
              <article className='flex justify-between gap-2'>
                <div className='flex w-full flex-col justify-center'>
                  <Label htmlFor='archivo_oc'>Archivo OC:</Label>
                  <FieldWrap>
                    <div className='border rounded-md border-zinc-700'>
                      <input
                        type='file'
                        id='archivo_oc'
                        name='archivo_oc'
                        className='hidden'
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          if (file) {
                            formik.setFieldValue('archivo_oc', file);
                          }
                        }}
                      />
                      
                      {formik.values.archivo_oc 
                        ?
                          (
                          <div className='relative'>
                            <Button
                              className='absolute -right-2 -top-2 w-8 h-8 rounded-full'
                              variant='solid'
                              color='red'
                              onChange={() => formik.setFieldValue('archivo_oc', '')}
                              >
                              X
                            </Button>
                            <span className='mt-2 text-center'>
                              {formik.values.archivo_oc}
                            </span>
                          </div>
                          )
                        : (
                          <Button
                            className='h-16 w-full flex items-center justify-center border rounded cursor-pointer'
                            onClick={() => document?.getElementById('archivo_oc')!.click()}
                          >
                            Seleccionar archivo
                          </Button>
                        )
                      }
                    </div>
                  </FieldWrap>
                </div>

                <div className='flex w-full flex-col justify-center'>
                  <Label htmlFor='numero_oc'>Número OC:</Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.numero_oc}
                    invalidFeedback={formik.errors.numero_oc ? String(formik.errors.numero_oc) : undefined}
                  >
                    <FieldWrap>
                      <Input
                        type='text'
                        className='py-2.5'
                        name='numero_oc'
                        onChange={formik.handleChange}
                        value={formik.values.numero_oc}
                      />
                    </FieldWrap>
                  </Validation>
                </div>

                <div className='flex w-full flex-col justify-center'>
                  <Label htmlFor='tipo_venta'>Tipo de Venta:</Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.tipo_venta}
                    invalidFeedback={formik.errors.tipo_venta ? String(formik.errors.tipo_venta) : undefined}
                  >
                    <FieldWrap>
                      <SelectReact
                        options={optionTipoVenta}
                        id='tipo_venta'
                        placeholder='Selecciona un opción'
                        name='tipo_venta'
                        className='h-12'
                        onChange={(value: any) => {
                          formik.setFieldValue('tipo_venta', value.value)
                        }}
                      />
                    </FieldWrap>
                  </Validation>
                </div>
              </article>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className='flex w-full flex-col justify-center mb-2'>
                <Label htmlFor='fecha_entrega'>Fecha Entrega:</Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.fecha_entrega}
                  invalidFeedback={formik.errors.fecha_entrega ? String(formik.errors.fecha_entrega) : undefined}
                >
                  <FieldWrap>
                    <Input
                      type='date'
                      name='fecha_entrega'
                      onChange={formik.handleChange}
                      value={formik.values.fecha_entrega}
                    />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='flex w-full flex-col justify-center'>
                <Label htmlFor='observaciones'>Observaciones:</Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.observaciones}
                  invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                >
                  <FieldWrap>
                    <Textarea
                      cols={9}
                      name='observaciones'
                      onChange={formik.handleChange}
                      value={formik.values.observaciones}
                    />
                  </FieldWrap>
                </Validation>
              </div>
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

export default FormularioPedidoMercadoInterno  
