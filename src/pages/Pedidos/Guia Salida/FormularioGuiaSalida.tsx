import { useFormik } from 'formik'
import React, { useEffect, FC }from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { Switch } from 'antd'
import { optionTipoCliente, optionsTipoSalida } from '../../../utils/options.constantes'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchContentTypes } from '../../../redux/slices/registrosbaseSlice'
import { fetchTipoClientes } from '../../../redux/slices/guiaSalidaSlice'
import Button from '../../../components/ui/Button'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import { TGuiaSalida } from '../../../types/TypesGuiaSalida.type'
import toast from 'react-hot-toast'
import Input from '../../../components/form/Input'
interface IFormGuiaSalida {
  comercializador?: string
}


const FormularioGuiaSalida : FC<IFormGuiaSalida>= ({comercializador}) => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const contenttypes = useAppSelector((state: RootState) => state.core.contenttypes)
  const clientes = useAppSelector((state: RootState) => state.guia_salida.tipo_cliente)
  const navigate = useNavigate()



  const formik = useFormik({ 
    initialValues: {
      tipo_cliente: 0,
      tipo_salida: 0,
      retira_cliente: false,
      id_cliente: 0,
      fecha_entrega: '',
      observaciones: '',
      comercializador: comercializador
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost('api/guias-salida/', {
        ...values,
        solicitado_por: perfil?.id
      }, token_verificado)
      if (res.ok){
        const data: TGuiaSalida = await res.json()
        toast.success('Guía registrada exitosamente')
        navigate(`/ventas/pedidos/guia/guia-salida/${data.id}/`)
      } else {
        toast.error('Volver a intentar')
      }
    }
  })

  useEffect(() => {
    dispatch(fetchContentTypes({ token, verificar_token: verificarToken  }))
  }, [])

    
  useEffect(() => {
    if (formik.values.tipo_cliente){
      const tipo_cliente = contenttypes.find(type => type.id === Number(formik.values.tipo_cliente))?.model
      dispatch(fetchTipoClientes({ params: { tipo_cliente: tipo_cliente }, token, verificar_token: verificarToken  }))
    }
  }, [formik.values.tipo_cliente])

  const optionsClientes: TSelectOptions = clientes.map((cliente: any) => ({
    value: String(cliente.id),
    label: cliente.nombre || cliente.first_name || cliente.nombre_fantasia
  }))

  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardBody>
          <div className='flex gap-5 '>
            <div className='w-full'>
              <Label htmlFor='tipo_salida'>Tipo Guia Salida: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_salida ? true : undefined}
                invalidFeedback={formik.errors.tipo_salida ? String(formik.errors.tipo_salida) : undefined}
              >
                <FieldWrap>
                  <SelectReact
                    options={[...optionsTipoSalida]}
                    id='tipo_salida'
                    placeholder='Selecciona un opción'
                    name='tipo_salida'
                    value={optionsTipoSalida.find(tipo => tipo?.value === String(formik.values.tipo_salida))}
                    className='py-[8px]'
                    onChange={(value: any) => {
                      formik.setFieldValue('tipo_salida', parseInt(value.value))
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='tipo_cliente'>Tipo Cliente: </Label>
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
                      const id_contenttype = contenttypes.find(type => type.model === value.value)
                      formik.setFieldValue('tipo_cliente', id_contenttype?.id)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className={'w-3/12'}>
              <Label htmlFor='retira_cliente'>Retira Cliente: </Label>

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

            </div>
          </div>

          <div className='flex flex-col md:flex-row lg:flex-row gap-5'>
            <div className='w-full'>
              <Label htmlFor='cliente'>Cliente: </Label>
              
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.id_cliente ? true : undefined}
                invalidFeedback={formik.errors.id_cliente ? String(formik.errors.id_cliente) : undefined}
              >
                <FieldWrap>
                  <SelectReact
                    options={optionsClientes}
                    id='id_cliente'
                    placeholder='Selecciona un opción'
                    name='id_cliente'
                    className='py-[8px]'
                    value={optionsClientes.find(cliente => cliente?.value === String(formik.values.id_cliente))}
                    onChange={(value: any) => {
                      formik.setFieldValue('id_cliente', parseInt(value.value))
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='fecha_entrega'>Fecha Entrega: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.fecha_entrega ? true : undefined}
                invalidFeedback={formik.errors.fecha_entrega ? String(formik.errors.fecha_entrega) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='date' 
                    id='fecha_entrega'
                    name='fecha_entrega'
                    className='py-2'
                    onChange={formik.handleChange}
                    value={formik.values.fecha_entrega}
                    />  
                </FieldWrap>
              </Validation>
            </div>
          </div>

          <div className='flex justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              onClick={() => formik.handleSubmit()}
              >
                Registrar Guía Salida
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioGuiaSalida
