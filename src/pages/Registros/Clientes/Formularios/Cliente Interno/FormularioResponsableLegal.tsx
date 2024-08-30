import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { fetchCuentasCorrientes, fetchRepresentantes } from '../../../../../redux/slices/clientes'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../../components/ui/Card'
import Validation from '../../../../../components/form/Validation'
import FieldWrap from '../../../../../components/form/FieldWrap'
import Input from '../../../../../components/form/Input'
import Button from '../../../../../components/ui/Button'
import SelectReact from '../../../../../components/form/SelectReact'
import { optionsBancos, optionsTipoCuenta } from '../../../../../utils/options.constantes'
import Label from '../../../../../components/form/Label'


const FormularioResponsableLegal = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)
  
  const { verificarToken } = useAuth()


  const formik = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      telefono: '',
      direccion: '',
      email: '',
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/clientes_mercado_interno/${cliente?.rut_cliente}/representantes/`, 
      {
        cliente: cliente?.id,
        ...values
      }, token_verificado)

      if (res.ok){
        toast.success('Representante creado al cliente')
        dispatch(fetchRepresentantes({ params: { rut: cliente?.rut_cliente}, token, verificar_token: verificarToken }))
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
              <Label htmlFor='nombres'>Nombres</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.nombres ? true : undefined}
                invalidFeedback={formik.errors.nombres ? String(formik.errors.nombres) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='nombres'
                    onChange={formik.handleChange}
                    value={formik.values.nombres}
                  />  
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='apellidos'>Apellidos</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.apellidos ? true : undefined}
                invalidFeedback={formik.errors.apellidos ? String(formik.errors.apellidos) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='apellidos'
                    onChange={formik.handleChange}
                    value={formik.values.apellidos}
                  /> 
                </FieldWrap>
              </Validation>
            </div>

          </section>

          <section className='flex flex-col md:flex-row lg:flex-row gap-5'>
            <div className='w-full flex-col items-center'>
              <Label htmlFor='telefono'>telefono</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.telefono ? true : undefined}
                invalidFeedback={formik.errors.telefono ? String(formik.errors.telefono) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='telefono'
                    onChange={formik.handleChange}
                    value={formik.values.telefono}
                  />  
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='direccion'>Dirección</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.direccion ? true : undefined}
                invalidFeedback={formik.errors.direccion ? String(formik.errors.direccion) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='direccion'
                    onChange={formik.handleChange}
                    value={formik.values.direccion}
                  /> 
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='email'>Email</Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.email ? true : undefined}
                invalidFeedback={formik.errors.email ? String(formik.errors.email) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='email'
                    onChange={formik.handleChange}
                    value={formik.values.email}
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

export default FormularioResponsableLegal
