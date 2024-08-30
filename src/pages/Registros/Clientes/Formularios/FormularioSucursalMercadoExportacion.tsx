import { Dispatch, SetStateAction, useEffect } from 'react'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import Input from '../../../../components/form/Input'
import Button from '../../../../components/ui/Button'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { fetchCiudades, fetchComunas, fetchPaises, fetchProvincias, fetchRegiones } from '../../../../redux/slices/registrosbaseSlice'
import { useAppSelector } from '../../../../redux/hooks'
import { useFormik } from 'formik'
import { fetchSucursales } from '../../../../redux/slices/clientes'

const FormularioSucursalMercadoExportacion = ({ setOpen, setEditar, tipo_cliente }: { setOpen: Dispatch<SetStateAction<boolean>>, setEditar: Dispatch<SetStateAction<boolean>>, tipo_cliente: string | undefined }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { paises, ciudades } = useAppSelector((state: RootState) => state.core)
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)

  console.log(cliente)


  const optionsPaises: TSelectOptions = paises.map((pais) => ({
    value: String(pais.id),
    label: pais.name
  })) ?? []

  const optionsCiudades: TSelectOptions = ciudades.map((ciudad) => ({
    value: String(ciudad.id),
    label: ciudad.name
  })) ?? []



  const formik = useFormik({ 
    initialValues: {
      nombre: '',
      pais: '',
      ciudad: '',
      direccion: '',
      email_sucursal: ''
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/clientes_exportacion/${cliente?.id}/sucursales/`, {cliente: cliente?.id, ...values},
      token_verificado)
      if (res.ok){
        toast.success('Sucursal agregada exitosamente')
        setOpen(false)
        setEditar(false)
        dispatch(fetchSucursales({ params: { rut: `${cliente?.dni_cliente}`}, token, verificar_token: verificarToken }))
      }
    }
  })

  useEffect(() => {
    if (tipo_cliente === 'clienteexportacion') {
      dispatch(fetchPaises({ token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente]);

  
  useEffect(() => {
    if (formik.values.pais && tipo_cliente) {
      dispatch(fetchCiudades({ params: { id_pais: formik.values.pais }, token, verificar_token: verificarToken }));
    }
  }, [formik.values.pais, tipo_cliente]);

  return (
<Container>
      <Card>
        <CardBody>
          <section className='flex flex-col md:flex-row lg:flex-row gap-5'>
            <article className='w-full'>
              <Label htmlFor=''>Nombre: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.nombre ? true : undefined}
                invalidFeedback={formik.errors.nombre ? String(formik.errors.nombre) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='nombre'
                    onChange={formik.handleChange}
                    value={formik.values.nombre}
                  />  
                </FieldWrap>
              </Validation>
            </article>

            <article className='w-full'>
              <Label htmlFor='direccion'>Dirección: </Label>
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
            </article>

            <article className='w-full'>
              <Label htmlFor='email_sucursal'>Email: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.email_sucursal ? true : undefined}
                invalidFeedback={formik.errors.email_sucursal ? String(formik.errors.email_sucursal) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='text'
                    name='email_sucursal'
                    onChange={formik.handleChange}
                    value={formik.values.email_sucursal}
                  />  
                </FieldWrap>
              </Validation>
            </article>
          </section>

          <section className='flex flex-col md:flex-row lg:flex-row gap-5 mt-5'>
            <article className='w-full'>
              <Label htmlFor='pais'>País: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.pais ? true : undefined}
                invalidFeedback={formik.errors.pais ? String(formik.errors.pais) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsPaises}
                    id='pais'
                    placeholder='Selecciona'
                    name='pais'
                    value={optionsPaises.find(pais => pais?.value === formik.values.pais)}
                    onChange={(value: any) => {
                      formik.setFieldValue('pais', value.value)
                    }}
                  />   
                </FieldWrap>
              </Validation>
            </article>

            <article className='w-full'>
              <Label htmlFor='ciudad'>Ciudad: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.ciudad ? true : undefined}
                invalidFeedback={formik.errors.ciudad ? String(formik.errors.ciudad) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsCiudades}
                    id='ciudad'
                    placeholder='Selecciona un opción'
                    name='ciudad'
                    value={optionsCiudades.find(ciudad => ciudad?.value === formik.values.ciudad)}
                    onChange={(value: any) => {
                      formik.setFieldValue('ciudad', value.value)
                    }}
                  />    
                </FieldWrap>
              </Validation>
            </article>
          </section>
          
          <section className='w-full flex flex-col md:flex-row lg:flex-row gap-5 justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              className='hover:scale-105'
              onClick={() => formik.handleSubmit()}
              >
                Agregar Sucursal
            </Button>
          </section>

        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioSucursalMercadoExportacion
