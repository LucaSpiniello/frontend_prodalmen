import React, { Dispatch, SetStateAction, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { useFormik } from 'formik'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import SelectReact from '../../../../components/form/SelectReact'
import { optionsTipoPerdidaProgramaPlantaHarina, optionsTipoProgramaPlantaHarina, optionsUbicacionProducto } from '../../../../utils/options.constantes'
import Input from '../../../../components/form/Input'
import { registro_programa_planta_harina } from '../../../../redux/slices/plantaHarinaSlice'
import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/ui/Button'

const FormularioRegistroProgramaPlantaHarina = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const navigate = useNavigate()
  const [disabled, setDisabled] = useState<boolean>()

  const formik = useFormik({
    initialValues: {
      tipo_programa: '',
      ubicacion_produc: '',
      perdidaprograma: '7'
    },
    onSubmit: (values) => {
      dispatch(registro_programa_planta_harina({ token, verificar_token: verificarToken, data: {creado_por: perfil?.id,...values}, params: { navigate: navigate, setDisabled: setDisabled}}))
    }
  })

  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardBody>
          <section className='flex flex-col gap-5'>
            <div className='flex gap-3 justify-between items-center'>
              <article className='w-full'>
                <Label htmlFor='tipo_programa'>Tipo Programa: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.tipo_programa ? true : undefined}
                  invalidFeedback={formik.errors.tipo_programa ? String(formik.errors.tipo_programa) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionsTipoProgramaPlantaHarina}
                      id='tipo_programa'
                      name='tipo_programa'
                      className='py-3'
                      value={optionsTipoProgramaPlantaHarina.find(option => option?.value === formik.values.tipo_programa)}
                      onChange={(value: any) => {
                        formik.setFieldValue('tipo_programa', value.value)
                      }}         
                      />
                  </FieldWrap>
                </Validation>
              </article>

              <article className='w-full'>
                <Label htmlFor='ubicacion_produc'>Ubicación Producto: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.ubicacion_produc ? true : undefined}
                  invalidFeedback={formik.errors.ubicacion_produc ? String(formik.errors.ubicacion_produc) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionsUbicacionProducto}
                      id='ubicacion_produc'
                      name='ubicacion_produc'
                      className='py-3'
                      value={optionsUbicacionProducto.find(option => option?.value === formik.values.ubicacion_produc)}
                      onChange={(value: any) => {
                        formik.setFieldValue('ubicacion_produc', value.value)
                      }}         
                      />
                  </FieldWrap>
                </Validation>
              </article>

              <article className='w-full'>
                <Label htmlFor='perdidaprograma'>Perdida Programa: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.perdidaprograma ? true : undefined}
                  invalidFeedback={formik.errors.perdidaprograma ? String(formik.errors.perdidaprograma) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionsTipoPerdidaProgramaPlantaHarina}
                      id='perdidaprograma'
                      name='perdidaprograma'
                      className='py-3'
                      value={optionsTipoPerdidaProgramaPlantaHarina.find(option => option?.value === formik.values.perdidaprograma)}
                      onChange={(value: any) => {
                        formik.setFieldValue('perdidaprograma', value.value)
                      }}         
                      />
                  </FieldWrap>
                </Validation>
              </article>
            </div>

            <div className='flex w-full justify-end'>
              <Button
                variant='solid'
                color='blue'
                colorIntensity='700'
                isDisable={disabled}
                onClick={() => {setDisabled(true); formik.handleSubmit()}}
                >
                  Registrar Programa Planta Harina
              </Button>

            </div>
          </section>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioRegistroProgramaPlantaHarina

