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
import { optionsTipoPerdidaProgramaPlantaHarina, optionsTipoProceso, optionsTipoProgramaPlantaHarina, optionsUbicacionProducto } from '../../../../utils/options.constantes'
import Input from '../../../../components/form/Input'
import { registro_programa_planta_harina } from '../../../../redux/slices/plantaHarinaSlice'
import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/ui/Button'
import { registro_proceso_planta_harina } from '../../../../redux/slices/procesoPlantaHarina'

const FormularioRegistroProcesoPlantaHarina = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const navigate = useNavigate()
  const [disabled, setDisabled] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      tipo_proceso: '',
      perdidaprograma: '7'
    },
    onSubmit: (values) => {
      dispatch(registro_proceso_planta_harina({ token, verificar_token: verificarToken, data: {creado_por: perfil?.id,...values}, params: { navigate: navigate, setDisabled: setDisabled}}))
    }
  })

  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardBody>
          <section className='flex flex-col gap-5'>
            <div className='flex gap-3 justify-between items-center'>
              <article className='w-full'>
                <Label htmlFor='tipo_proceso'>Tipo Proceso: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.tipo_proceso ? true : undefined}
                  invalidFeedback={formik.errors.tipo_proceso ? String(formik.errors.tipo_proceso) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionsTipoProceso}
                      id='tipo_proceso'
                      name='tipo_proceso'
                      className='py-3'
                      value={optionsTipoProceso.find(option => option?.value === formik.values.tipo_proceso)}
                      onChange={(value: any) => {
                        formik.setFieldValue('tipo_proceso', value.value)
                      }}         
                      />
                  </FieldWrap>
                </Validation>
              </article>
            </div>

            <div className='flex gap-3 justify-between items-center'>

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
                onClick={() => {setDisabled(true);formik.handleSubmit()}}
                >
                  Registrar Proceso Planta Harina
              </Button>

            </div>
          </section>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioRegistroProcesoPlantaHarina

