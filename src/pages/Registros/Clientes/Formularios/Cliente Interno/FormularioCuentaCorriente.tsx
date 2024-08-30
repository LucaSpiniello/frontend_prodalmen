import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { fetchCuentasCorrientes } from '../../../../../redux/slices/clientes'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../../components/ui/Card'
import Validation from '../../../../../components/form/Validation'
import FieldWrap from '../../../../../components/form/FieldWrap'
import Input from '../../../../../components/form/Input'
import Button from '../../../../../components/ui/Button'
import SelectReact from '../../../../../components/form/SelectReact'
import { optionsBancos, optionsTipoCuenta } from '../../../../../utils/options.constantes'
import Label from '../../../../../components/form/Label'

const FormularioCuentaCorriente = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)
  
  const { verificarToken } = useAuth()
  
  const formik = useFormik({
    initialValues: {
      tipo_cuenta: '',
      numero_cuenta: '',
      banco: '',
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/clientes_mercado_interno/${cliente?.rut_cliente}/cuentas_corrientes/`, 
      {
        cliente: cliente?.id,
        ...values
      }, token_verificado)

      if (res.ok){
        toast.success('Cuenta Corriente creado al cliente')
        dispatch(fetchCuentasCorrientes({ params: { rut: cliente?.rut_cliente}, token, verificar_token: verificarToken }))
        setOpen(false)
      } else {
        toast.error('No se pudo crear el cliente')
      }
    }
  })

  return (
    <Container>
      <Card>
        <CardBody>
          <section className='flex flex-col md:flex-row lg:flex-row gap-5'>
            <div className='w-full flex-col items-center'>
              <Label htmlFor='numero_cuenta'>Número Cuenta</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.numero_cuenta ? true : undefined}
                invalidFeedback={formik.errors.numero_cuenta ? String(formik.errors.numero_cuenta) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='number'
                    name='numero_cuenta'
                    onChange={formik.handleChange}
                    value={formik.values.numero_cuenta}
                  />  
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='tipo_cuenta'>Tipo Cuenta</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_cuenta ? true : undefined}
                invalidFeedback={formik.errors.tipo_cuenta ? String(formik.errors.tipo_cuenta) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsTipoCuenta}
                    id='tipo_cuenta'
                    placeholder='Selecciona'
                    name='tipo_cuenta'
                    value={optionsTipoCuenta.find(cuenta => cuenta?.value === String(formik.values.tipo_cuenta))}
                    onChange={(value: any) => {
                      formik.setFieldValue('tipo_cuenta', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='banco'>Banco</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.banco ? true : undefined}
                invalidFeedback={formik.errors.banco ? String(formik.errors.banco) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsBancos}
                    id='region'
                    placeholder='Selecciona'
                    name='region'
                    value={optionsBancos.find(banco => banco?.value === String(formik.values.banco))}
                    onChange={(value: any) => {
                      formik.setFieldValue('banco', value.value)
                    }}
                  />  
                </FieldWrap>
              </Validation>
            </div>
          </section>

          <section className='flex justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              onClick={() => formik.handleSubmit()}
              >
                Registrar Cuenta Corriente
            </Button>
          </section>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioCuentaCorriente
