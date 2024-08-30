import { useFormik } from 'formik'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../../utils/peticiones.utils'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchClienteSeleccionado, fetchSucursales } from '../../../../../redux/slices/clientes'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../../components/ui/Card'
import Label from '../../../../../components/form/Label'
import Validation from '../../../../../components/form/Validation'
import FieldWrap from '../../../../../components/form/FieldWrap'
import Input from '../../../../../components/form/Input'
import Button from '../../../../../components/ui/Button'
import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact'
import { fetchComunas, fetchProvincias, fetchRegiones } from '../../../../../redux/slices/registrosbaseSlice'

const FormularioSucursalesClientesMercadoInterno = ({ setOpen, setEditar, tipo_cliente }: { setOpen: Dispatch<SetStateAction<boolean>>, setEditar: Dispatch<SetStateAction<boolean>>, tipo_cliente: string | undefined }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { regiones, provincias, comunas } = useAppSelector((state: RootState) => state.core)
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)

  console.log(cliente)



  const optionsRegion: TSelectOptions = regiones.map((region) => ({
    value: String(region.region_id),
    label: region.region_nombre
  })) ?? []

  const optionsProvincia: TSelectOptions = provincias.map((provincias) => ({
    value: String(provincias.provincia_id),
    label: provincias.provincia_nombre
  }))

  const optionsComunas: TSelectOptions = comunas.map((comuna) => ({
    value: String(comuna.comuna_id),
    label: comuna.comuna_nombre
  }))




  
  const formik = useFormik({ 
    initialValues: {
      nombre: '',
      region: '',
      provincia: '',
      comuna: '',
      direccion: '',
      telefono: '',
      email_sucursal: ''
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/clientes_mercado_interno/${id}/sucursales/`, {cliente: cliente?.id, ...values},
      token_verificado)
      if (res.ok){
        toast.success('Sucursal agregada exitosamente')
        setOpen(false)
        setEditar(false)
        dispatch(fetchSucursales({ params: { rut: `${cliente?.rut_cliente}`}, token, verificar_token: verificarToken }))
      }
    }
  })

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno') {
      // @ts-ignore
      dispatch(fetchRegiones({ token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente]);

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno' && formik.values.region) {
      // @ts-ignore
      dispatch(fetchProvincias({ params: { id_region: formik.values.region }, token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, formik.values.region]);

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno' && formik.values.provincia) {
      // @ts-ignore
      dispatch(fetchComunas({ params: { id_provincia: formik.values.provincia }, token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, formik.values.provincia]);


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
              <Label htmlFor='region'>Region: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.region ? true : undefined}
                invalidFeedback={formik.errors.region ? String(formik.errors.region) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsRegion}
                    id='region'
                    placeholder='Selecciona un opción'
                    name='region'
                    value={optionsRegion.find(region => region?.value === formik.values.region)}
                    onChange={(value: any) => {
                      formik.setFieldValue('region', value.value)
                    }}
                  />   
                </FieldWrap>
              </Validation>
            </article>

            <article className='w-full'>
              <Label htmlFor='provincia'>Provincia: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.provincia ? true : undefined}
                invalidFeedback={formik.errors.provincia ? String(formik.errors.provincia) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsProvincia}
                    id='provincia'
                    placeholder='Selecciona un opción'
                    name='provincia'
                    value={optionsProvincia.find(provincia => provincia?.value === formik.values.provincia)}
                    onChange={(value: any) => {
                      formik.setFieldValue('provincia', value.value)
                    }}
                  />    
                </FieldWrap>
              </Validation>
            </article>

            <article className='w-full'>
              <Label htmlFor='comuna'>Comuna: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.comuna ? true : undefined}
                invalidFeedback={formik.errors.comuna ? String(formik.errors.comuna) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsComunas}
                    id='comuna'
                    placeholder='Selecciona un opción'
                    name='comuna'
                    value={optionsComunas.find(comuna => comuna?.value === formik.values.comuna)}
                    onChange={(value: any) => {
                      formik.setFieldValue('comuna', value.value)
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

export default FormularioSucursalesClientesMercadoInterno
