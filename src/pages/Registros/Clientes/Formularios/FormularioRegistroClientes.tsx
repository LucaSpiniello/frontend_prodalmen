import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import toast from 'react-hot-toast'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { useAuth } from '../../../../context/authContext'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import Button from '../../../../components/ui/Button'
import { fetchCiudades, fetchComunas, fetchPaises, fetchProvincias, fetchRegiones } from '../../../../redux/slices/registrosbaseSlice'
import { useSelector } from 'react-redux'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import { fetchClientes } from '../../../../redux/slices/clientes'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormComercializadorProps {
  setOpen: Dispatch<SetStateAction<boolean>>
  tipo_cliente: string
}

const FormularioRegistroClientes: FC<IFormComercializadorProps> = ({ setOpen, tipo_cliente }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const { paises, ciudades, regiones, provincias, comunas, loading, error } = useSelector((state: RootState) => state.core);

  const optionsPaises: TSelectOptions = paises.map((pais) => ({
    value: String(pais.id),
    label: pais.name
  })) ?? []

  const optionsCiudades: TSelectOptions = ciudades.map((ciudad) => ({
    value: String(ciudad.id),
    label: ciudad.name
  })) ?? []

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
      dni_cliente: "",
      rut_cliente: "",
      razon_social: "",
      nombre_fantasia: "",
      telefono: "",
      region: "",
      provincia: "",
      comuna: "",
      direccion_1: "",
      direccion_2: "",
      ciudad: "",
      pais: "",
      codigo_postal: "",
      movil: "",
      email_cliente: "",
      pagina_web: "", 
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
    
      if (!token_verificado) throw new Error('Token no verificado')

      if (tipo_cliente === 'clientemercadointerno'){
        const res = await fetchWithTokenPost(`api/clientes_mercado_interno/`, {
          rut_cliente: values.rut_cliente,
          razon_social: values.razon_social,
          telefono: values.telefono,
          region: values.region,
          nombre_fantasia: values.nombre_fantasia,
          provincia: values.provincia,
          comuna: values.comuna,
          direccion: values.direccion_1,
          email_cliente: values.email_cliente,
          creado_por: perfil?.id
        },
        token_verificado
      )

        if (res.ok){
          toast.success('Se ha registrado exitosamente')
          dispatch(fetchClientes({ params: { search: `?tipo_cliente=clientemercadointerno` }, token, verificar_token: verificarToken }))
          setOpen(false)
        } else {
          toast.error('No se ha podido registrar')
        }
      } else if (tipo_cliente === 'clienteexportacion'){
        const res_v = await fetchWithTokenPost(`api/clientes_exportacion/`, {
          dni_cliente: values.dni_cliente,
          razon_social: values.razon_social,
          telefono: values.telefono,
          nombre_fantasia: values.nombre_fantasia,
          pais: values.pais,
          ciudad: values.ciudad,
          direccion_1: values.direccion_1,
          direccion_2: values.direccion_1,
          codigo_postal: values.codigo_postal,
          email_cliente: values.email_cliente,
          pagina_web: values.pagina_web,
          creado_por: perfil?.id
        },
        token_verificado
      )

        if (res_v.ok){
          toast.success('Se ha registrado exitosamente')
          //@ts-ignores
          dispatch(fetchClientes({ params: { search: `?tipo_cliente=clienteexportacion` }, token, verificar_token: verificarToken }))
          setOpen(false)
        } else {
          toast.error('No se ha podido registrar')
        }
      }
    }
  })



  //MERCADO INTERNO
  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno') {
      // @ts-ignore
      dispatch(fetchRegiones({ token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, tipo_cliente]);

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno' && formik.values.region) {
      // @ts-ignore
      dispatch(fetchProvincias({ params: { id_region: formik.values.region }, token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, tipo_cliente, formik.values.region]);

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno' && formik.values.provincia) {
      // @ts-ignore
      dispatch(fetchComunas({ params: { id_provincia: formik.values.provincia }, token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, tipo_cliente, formik.values.provincia]);


  // MERCADO EXTERIOR

  useEffect(() => {
    if (tipo_cliente === 'clienteexportacion') {
      // @ts-ignore
      dispatch(fetchPaises({ token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente]);

  
  useEffect(() => {
    if (formik.values.pais && tipo_cliente) {
      // @ts-ignore
      dispatch(fetchCiudades({ params: { id_pais: formik.values.pais }, token, verificar_token: verificarToken }));
    }
  }, [formik.values.pais, tipo_cliente]);


  return (
    <Container>
      <Card>
        <CardBody className='flex flex-col w-full gap-5'>
          <article className='flex w-full justify-between gap-2 '>
            {
              tipo_cliente === 'clientemercadointerno'
                ? (
                    <div className='w-full flex-col items-center'>
                      <Label htmlFor='rut_cliente'>RUT: </Label>

                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.rut_cliente ? true : undefined}
                        invalidFeedback={formik.errors.rut_cliente ? String(formik.errors.rut_cliente) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='rut_cliente'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.rut_cliente}
                        />
                        </FieldWrap>
                      </Validation>
                      
                    </div>
                  )
                : tipo_cliente === 'clienteexportacion'
                  ? (
                    <div className='w-full flex-col items-center'>
                      <Label htmlFor='dni_rut'>DNI / RUT: </Label>

                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.dni_cliente ? true : undefined}
                        invalidFeedback={formik.errors.dni_cliente ? String(formik.errors.dni_cliente) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='dni_cliente'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.dni_cliente}
                        />
                        </FieldWrap>
                      </Validation>
                  
                    </div>
                    )
                  : null
            }

            <div className='w-full flex-col items-center'>
              <Label htmlFor='razon_social'>Razón Social: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.razon_social ? true : undefined}
                invalidFeedback={formik.errors.razon_social ? String(formik.errors.razon_social) : undefined}
                >
                <FieldWrap>
                <Input
                  type='text'
                  name='razon_social'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.razon_social}
                />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='email_cliente'>Email Cliente:  </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.email_cliente ? true : undefined}
                invalidFeedback={formik.errors.email_cliente ? String(formik.errors.email_cliente) : undefined}
                >
                <FieldWrap>
                <Input
                  type='text'
                  name='email_cliente'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.email_cliente}
                />
                </FieldWrap>
              </Validation>
            </div>

            
          </article>

          <div className='flex w-full justify-between gap-2'>
            <div className='w-full flex-col items-center'>
              <Label htmlFor='nombre_fantasia'>Nombre Fantasía:  </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.nombre_fantasia ? true : undefined}
                invalidFeedback={formik.errors.nombre_fantasia ? String(formik.errors.nombre_fantasia) : undefined}
                >
                <FieldWrap>
                <Input
                  type='text'
                  name='nombre_fantasia'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.nombre_fantasia}
                />  
                </FieldWrap>
              </Validation>
            </div>

            {
              tipo_cliente === 'clientemercadointerno'
                ? (
                  <>
                    <div className=' w-full flex-col items-center'>
                      <Label htmlFor='region'>Región: </Label>

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
                            className='h-12'
                            onChange={(value: any) => {
                              formik.setFieldValue('region', value.value)
                            }}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>

                    <div className=' w-full flex-col items-center'>
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
                            className='h-12'
                            onChange={(value: any) => {
                              formik.setFieldValue('provincia', value.value)
                            }}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>

                    <div className=' w-full flex-col items-center'>
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
                            className='h-12'
                            onChange={(value: any) => {
                              formik.setFieldValue('comuna', value.value)
                            }}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>
                  
                  </>
                  )
                : tipo_cliente === 'clienteexportacion'
                  ? (
                    <>
                      <div className='w-full flex-col items-center'>
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
                              placeholder='Selecciona un opción'
                              name='pais'
                              className='h-12'
                              onChange={(value: any) => {
                                formik.setFieldValue('pais', value.value)
                              }}
                            />
                          </FieldWrap>
                        </Validation>
                      </div>

                      <div className='w-full flex-col items-center'>
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
                              className='h-12'
                              onChange={(value: any) => {
                                formik.setFieldValue('ciudad', value.value)
                              }}
                            />
                          </FieldWrap>
                        </Validation>
                      </div>
                    </>
                    )
                  : null
            }
            
          </div>

          <article className='flex w-full justify-between gap-2'>
              {
                tipo_cliente === 'clientemercadointerno'
                  ? (
                    <div className='w-full flex-col items-center'>
                      <Label htmlFor='movil'>Móvil: </Label>

                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.movil ? true : undefined}
                        invalidFeedback={formik.errors.movil ? String(formik.errors.movil) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='movil'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.movil}
                        />
                        </FieldWrap>
                      </Validation>

                    </div>
                    )
                  : null
              }
              {
                tipo_cliente === 'clientemercadointerno'
                  ? (
                    <>
                      <div className='w-full flex-col items-center'>
                        <Label htmlFor='direccion_1'>Dirección: </Label>

                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.direccion_1 ? true : undefined}
                          invalidFeedback={formik.errors.direccion_1 ? String(formik.errors.direccion_1) : undefined}
                          >
                          <FieldWrap>
                          <Input
                            type='text'
                            name='direccion_1'
                            onChange={formik.handleChange}
                            className='py-3'
                            value={formik.values.direccion_1}
                          />
                          </FieldWrap>
                        </Validation>
                      </div>

                      <div className='w-full flex-col items-center'>
                        <Label htmlFor='telefono'>Telefono: </Label>

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
                            className='py-3'
                            value={formik.values.telefono}
                          />
                          </FieldWrap>
                        </Validation>

                      </div>
                    </>
                    )
                  : tipo_cliente === 'clienteexportacion'
                    ? (
                      <>
                        <div className='w-full flex-col items-center'>
                          <Label htmlFor='direccion_1'>Dirección 1: </Label>

                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.direccion_1 ? true : undefined}
                            invalidFeedback={formik.errors.direccion_1 ? String(formik.errors.direccion_1) : undefined}
                            >
                            <FieldWrap>
                            <Input
                              type='text'
                              name='direccion_1'
                              onChange={formik.handleChange}
                              className='py-3'
                              value={formik.values.direccion_1}
                            />
                            </FieldWrap>
                          </Validation>
                        </div>

                        <div className='w-full flex-col items-center'>
                          <Label htmlFor='direccion_2'>Dirección 2: </Label>

                          <Validation
                            isValid={formik.isValid}
                            isTouched={formik.touched.direccion_2 ? true : undefined}
                            invalidFeedback={formik.errors.direccion_2 ? String(formik.errors.direccion_2) : undefined}
                            >
                            <FieldWrap>
                            <Input
                              type='text'
                              name='direccion_2'
                              onChange={formik.handleChange}
                              className='py-3'
                              value={formik.values.direccion_2}
                            />
                            </FieldWrap>
                          </Validation>
                        </div>

                        <div className='w-full flex-col items-center'>
                          <Label htmlFor='telefono'>Telefono: </Label>

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
                              className='py-3'
                              value={formik.values.telefono}
                            />
                            </FieldWrap>
                          </Validation>

                        </div>
                      </>
                    )
                  : null
              }
          </article>

          

          
          

          

          <div className='flex justify-between gap-2'>
            {
              tipo_cliente === 'clienteexportacion'
                ? (
                  <>
                    <div className='w-full flex-col items-center'>
                      <Label htmlFor='codigo_postal'>Código Postal (Zip Code):  </Label>

                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.codigo_postal ? true : undefined}
                        invalidFeedback={formik.errors.codigo_postal ? String(formik.errors.codigo_postal) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='codigo_postal'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.codigo_postal}
                        />
                        </FieldWrap>
                      </Validation>
                    </div>

                    <div className='w-full flex-col items-center'>
                      <Label htmlFor='movil'>Móvil: </Label>

                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.movil ? true : undefined}
                        invalidFeedback={formik.errors.movil ? String(formik.errors.movil) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='movil'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.movil}
                        />
                        </FieldWrap>
                      </Validation>

                    </div>
                    
                  </>
                )
                : (
                  <>
                    <div className='w-full flex-col items-center'>
                      <Label htmlFor='codigo_postal'>Código Postal (Zip Code):  </Label>

                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.codigo_postal ? true : undefined}
                        invalidFeedback={formik.errors.codigo_postal ? String(formik.errors.codigo_postal) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='codigo_postal'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.codigo_postal}
                        />
                        </FieldWrap>
                      </Validation>
                    </div>
                  </>
                )
            }
          </div>

          <div className='w-full flex justify-end'>
            <Button
              variant='solid'
              color='sky'
              colorIntensity='700'
              size='lg'
              onClick={() => formik.handleSubmit()}
              >
                {
                  tipo_cliente === 'clientemercadointerno'
                    ? 'Registrar Cliente Mercado Interno'
                    : tipo_cliente === 'clienteexportacion'
                      ? 'Registrar Cliente Exportación'
                      : null
                }
            </Button>
          </div>

        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioRegistroClientes  
