import { useFormik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import SelectReact from '../../../../components/form/SelectReact'
import Input from '../../../../components/form/Input'
import Button from '../../../../components/ui/Button'
import { optionCalleBodega, optionTipoPatineta } from '../../../../utils/options.constantes'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { registrar_bin_resultante_planta_harina, registro_cc_bin_resultante_planta_harina } from '../../../../redux/slices/plantaHarinaSlice'
import { useLocation, useParams } from 'react-router-dom'
import Textarea from '../../../../components/form/Textarea'


const FormularioCCBinResultantePlantaHarina = ({ setOpen, id_bin }: { id_bin?: number, setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const { pathname } = useLocation()
  const { id } = useParams()


  const formik = useFormik({
    initialValues: {
      humedad: 0,
      piel_aderida: 0,
      observaciones: ''
    },
    onSubmit: (values) => {
      dispatch(registro_cc_bin_resultante_planta_harina({
        id: id_bin,
        data: {
          bin_resultante:id_bin,
          realizado_por: perfil?.id,
          ...values
        },
        
        token,
        params: {
          setOpen: setOpen,
          pathname: pathname,
          id_programa: id
        },
        verificar_token: verificarToken
      }))
    }
  })


  return (
    <Container className='!p-0'>
      <Card>
        <CardBody>
        <section className='flex flex-col gap-5'>
            <div className='flex gap-3 justify-between items-center'>

              <article className='w-full'>
                <Label htmlFor='humedad'>Humedad: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.humedad ? true : undefined}
                  invalidFeedback={formik.errors.humedad ? String(formik.errors.humedad) : undefined}>
                  <FieldWrap>
                    <Input
                      type='number'
                      name='humedad'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.humedad}
                    />
                  </FieldWrap>
                </Validation>
              </article>

              <article className='w-full'>
                <Label htmlFor='piel_aderida'>Piel Aderida: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.piel_aderida ? true : undefined}
                  invalidFeedback={formik.errors.piel_aderida ? String(formik.errors.piel_aderida) : undefined}>
                  <FieldWrap>
                    <Input
                      type='number'
                      name='piel_aderida'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.piel_aderida}
                    />
                  </FieldWrap>
                </Validation>
              </article>
            </div>

            <div className='w-full'>
              <article className='w-full'>
                <Label htmlFor='observaciones'>Observaciones: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.observaciones ? true : undefined}
                  invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}>
                  <FieldWrap>
                    <Textarea
                        id='observaciones'
                        name='observaciones'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.observaciones}
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
                onClick={() => formik.handleSubmit()}
                >
                  Registrar Control Calidad Bin Resultante Planta Harina
              </Button>

            </div>
          </section>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioCCBinResultantePlantaHarina
