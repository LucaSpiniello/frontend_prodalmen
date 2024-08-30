import { useFormik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { registro_tipo_rechazo_planta_harina } from '../../../../redux/slices/plantaHarinaSlice'
import { useParams } from 'react-router-dom'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import SelectReact from '../../../../components/form/SelectReact'
import { optionTipoRechazoPlantaHarina } from '../../../../utils/options.constantes'
import Input from '../../../../components/form/Input'
import Button from '../../../../components/ui/Button'
import Textarea from '../../../../components/form/Textarea'
import { registro_tipo_rechazo_proceso_planta_harina } from '../../../../redux/slices/procesoPlantaHarina'

const FormularioTipoRechazoPlantaHarina = ({ setOpen}: {setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { id } = useParams()


  const formik = useFormik({
    initialValues: {
      tipo_rechazo: '',
      observaciones: '',
      kilos_fruta: 0
    },
    onSubmit: (values) => {
      dispatch(registro_tipo_rechazo_proceso_planta_harina({ id: parseInt(id!), data: { registrado_por: perfil?.id, proceso: id, ...values}, token, verificar_token: verificarToken, action: setOpen }))
    }
  })

  return (
    <Container breakpoint={null} className='w-full'>
      <Card>
        <CardBody>
          <div className='flex items-center gap-2 justify-between'>
          <div className='w-full'>
              <Label htmlFor='tipo_rechazo'>Tipo Rechazo: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.tipo_rechazo ? true : undefined}
                  invalidFeedback={formik.errors.tipo_rechazo ? String(formik.errors.tipo_rechazo) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionTipoRechazoPlantaHarina}
                      id='tipo_rechazo'
                      name='tipo_rechazo'
                      className='py-3'
                      value={optionTipoRechazoPlantaHarina.find(option => option?.value === formik.values.tipo_rechazo)}
                      onChange={(value: any) => {
                        formik.setFieldValue('tipo_rechazo', value.value)
                      }}         
                       />
                  </FieldWrap>
                </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='kilos_fruta'>Kilos: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.kilos_fruta ? true : undefined}
                invalidFeedback={formik.errors.kilos_fruta ? String(formik.errors.kilos_fruta) : undefined}>
                <FieldWrap>
                  <Input
                    type='number'
                    name='kilos_fruta'
                    onChange={formik.handleChange}
                    className='py-3'
                    value={formik.values.kilos_fruta}
                  />
                </FieldWrap>
              </Validation>
            </div>
          </div>

          <div className='w-full mt-5'>
              <Label htmlFor='observaciones'>Observaciones: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.observaciones ? true : undefined}
                invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}>
                <FieldWrap>
                  <Textarea
                    cols={12}
                    name='observaciones'
                    id=''
                    className='h-20'
                    onChange={formik.handleChange}
                    value={formik.values.observaciones}
                  />
                </FieldWrap>
              </Validation>
            </div>

          <div className='w-full flex justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              onClick={() => formik.handleSubmit()}
              >
              Agregar Rechazo Planta Harina
            </Button>
          </div>
        </CardBody>
      </Card>

    </Container>
  )
}

export default FormularioTipoRechazoPlantaHarina
