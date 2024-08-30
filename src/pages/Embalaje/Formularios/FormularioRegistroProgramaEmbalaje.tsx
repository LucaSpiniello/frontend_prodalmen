
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import { useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import FieldWrap from '../../../components/form/FieldWrap'
import { useEffect } from 'react'
import Input from '../../../components/form/Input'
import { fetchEtiquetasEmbalaje, fetchTipoEmbalaje } from '../../../redux/slices/embalajeSlice'
import { optionsCalibres, optionsCalidad, optionsNombreProducto, optionsVariedad } from '../../../utils/options.constantes'
import Textarea from '../../../components/form/Textarea'
import Button from '../../../components/ui/Button'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';



const FormularioRegistroProgramaEmbalaje = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const navigate = useNavigate()
  const tipo_embalaje = useAppSelector((state: RootState) => state.embalaje.tipo_embalaje)
  const etiqueta_embalaje = useAppSelector((state: RootState) => state.embalaje.etiquetas)

  const formik = useFormik({
    initialValues: {
      etiquetado: 0, 
      tipo_embalaje: '',
      observaciones: '',
      tipo_producto: '',
      calidad: '',
      calibre: '',
      variedad: '',
      kilos_solicitados: '' 
    },
    onSubmit: async (values: any) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost('api/embalaje/', 
      {
        configurado_por: perfil?.id,
        ...values
      }, token_verificado)
      if (res.ok){
        const data = await res.json()
        toast.success('Programa Embalaje Creado Exitosamente!')
        navigate(`/emb/registro-programa-embalaje/${data?.id}/`, { state: { pathname: '/programas-embalaje/'}, replace: true})
      } else {
        toast.error('No se pudo crear el programa')
      }

    }
  })

  useEffect(() => {
      dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    dispatch(fetchEtiquetasEmbalaje({ token, verificar_token: verificarToken }))
  }, [])


  const optionsTipoEmbalaje: TSelectOptions = tipo_embalaje.
    filter(tipo => tipo?.id !== Number(formik.values.tipo_embalaje)).
    map((tipo) => ({ value: String(tipo.id), label: tipo.nombre}))
    ?? []

    const optionsTipoEtiqueta: TSelectOptions = etiqueta_embalaje.
    filter(tipo => tipo?.id !== Number(formik.values.etiquetado)).
    map((tipo) => ({ value: String(tipo.id), label: tipo.nombre}))
    ?? []

  return (
    <Container>
      <Card>
        <CardBody className='flex flex-col gap-y-5'>
          <article className='flex justify-between gap-5'>
            <div className='w-full'>
              <Label htmlFor='kilos_solicitados'>Kilos Solicitados: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.kilos_solicitados ? true : undefined}
                invalidFeedback={formik.errors.kilos_solicitados ? String(formik.errors.kilos_solicitados) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='number'
                    name='kilos_solicitados'
                    onChange={formik.handleChange}
                    className='py-[10px]'
                    value={formik.values.kilos_solicitados}
                  />
                </FieldWrap>
              </Validation>
            </div>
            
            <div className='w-full'>
              <Label htmlFor='tipo_embalaje'>Tipo Embalaje: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_embalaje ? true : undefined}
                invalidFeedback={formik.errors.tipo_embalaje ? String(formik.errors.tipo_embalaje) : undefined}
                >
                <FieldWrap>
                <SelectReact
                    options={optionsTipoEmbalaje}
                    id='tipo_embalaje'
                    placeholder='Selecciona un opción'
                    name='tipo_embalaje'
                    className='h-14 py-2'
                    onChange={(value: any) => {
                      formik.setFieldValue('tipo_embalaje', value.value)
                    }}
                  />
                
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='etiquetado'>Etiquetado: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.etiquetado ? true : undefined}
                invalidFeedback={formik.errors.etiquetado ? String(formik.errors.etiquetado) : undefined}
                >
                <FieldWrap>
                <SelectReact
                    options={optionsTipoEtiqueta}
                    id='etiquetado'
                    placeholder='Selecciona un opción'
                    name='etiquetado'
                    className='h-14 py-2'
                    onChange={(value: any) => {
                      formik.setFieldValue('etiquetado', value.value)
                    }}
                  />
                
                </FieldWrap>
              </Validation>
            </div>
          </article>
          
          <article className='flex justify-between gap-5'>
           
            <div className='w-full h-32'>
              <Label htmlFor='observaciones'>Observaciones: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.observaciones ? true : undefined}
                invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                >
                <FieldWrap>
                  <Textarea
                    id='observaciones'
                    name='observaciones'
                    className='h-24'
                    onChange={formik.handleChange}
                    value={formik.values.observaciones}
                    />
                
                </FieldWrap>
              </Validation>
            </div>
          </article>

          <div className='w-full flex justify-end'>
            <Button
              color='blue'
              colorIntensity='700'
              variant='solid'
              onClick={() => formik.handleSubmit()}
              className='py-4'
              >
                Registrar Programa Embalaje
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioRegistroProgramaEmbalaje
