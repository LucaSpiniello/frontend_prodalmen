import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useFormik } from 'formik'
import { useAuth } from '../../../../context/authContext'
import { useParams } from 'react-router-dom'
import { actualizar_variables_planta_harina } from '../../../../redux/slices/plantaHarinaSlice'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import Input from '../../../../components/form/Input'
import Button from '../../../../components/ui/Button'
import { actualizar_variables_proceso_planta_harina } from '../../../../redux/slices/procesoPlantaHarina'

const FormularioVariablesProcesoPlantaHarina = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const variable_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.variable_proceso_planta_harina)
  const proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina )
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { id } = useParams()


  const formik = useFormik({
    initialValues: {
      lectura_gas_inicio: 0, 
      lectura_luz_inicio: 0,
      lectura_gas_termino: 0,
      lectura_luz_termino: 0
    },
    onSubmit: (values) => {
      dispatch(actualizar_variables_proceso_planta_harina({ id: parseInt(id!), token, data: {...values}, verificar_token: verificarToken, action: setOpen }))
    }
  })

  useEffect(() => {
    if (variable_proceso_planta_harina){
      formik.setFieldValue('lectura_gas_inicio', variable_proceso_planta_harina.lectura_gas_inicio)
      formik.setFieldValue('lectura_luz_inicio', variable_proceso_planta_harina.lectura_luz_inicio)
      formik.setFieldValue('lectura_gas_termino', variable_proceso_planta_harina.lectura_gas_termino)
      formik.setFieldValue('lectura_luz_termino', variable_proceso_planta_harina.lectura_luz_termino)
    }
  }, [variable_proceso_planta_harina])


  return (
    <Container>
      <Card>
        <CardBody>
          {
            proceso_planta_harina?.estado_proceso !== '5' && !(variable_proceso_planta_harina?.lectura_gas_inicio && variable_proceso_planta_harina.lectura_luz_inicio)
              ? (
                <section className='flex w-full gap-5'>
                  
                  <div className='w-full'>
                    <Label htmlFor='lectura_luz_inicio'>Lectura Luz Inicio: </Label>
                    <Validation
                      isValid={formik.isValid}
                      isTouched={formik.touched.lectura_luz_inicio ? true : undefined}
                      invalidFeedback={formik.errors.lectura_luz_inicio ? String(formik.errors.lectura_luz_inicio) : undefined}>
                      <FieldWrap>
                        <Input
                          type='number'
                          name='lectura_luz_inicio'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.lectura_luz_inicio}
                        />
                      </FieldWrap>
                    </Validation>
                  </div>

                  <div className='w-full'>
                    <Label htmlFor='lectura_gas_inicio'>Lectura Gas Inicio: </Label>
                    <Validation
                      isValid={formik.isValid}
                      isTouched={formik.touched.lectura_gas_inicio ? true : undefined}
                      invalidFeedback={formik.errors.lectura_gas_inicio ? String(formik.errors.lectura_gas_inicio) : undefined}>
                      <FieldWrap>
                        <Input
                          type='number'
                          name='lectura_gas_inicio'
                          onChange={formik.handleChange}
                          className='py-3'
                          value={formik.values.lectura_gas_inicio}
                        />
                      </FieldWrap>
                    </Validation>
                  </div>
                </section>
              )
              : !(variable_proceso_planta_harina?.lectura_gas_termino && variable_proceso_planta_harina.lectura_luz_termino)
                ?
                  (
                  <section className='flex w-full gap-5'>
                    
                    <div className='w-full'>
                      <Label htmlFor='lectura_luz_termino'>Lectura Luz Termino: </Label>
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.lectura_luz_termino ? true : undefined}
                        invalidFeedback={formik.errors.lectura_luz_termino ? String(formik.errors.lectura_luz_inicio) : undefined}>
                        <FieldWrap>
                          <Input
                            type='number'
                            name='lectura_luz_termino'
                            onChange={formik.handleChange}
                            className='py-3'
                            value={formik.values.lectura_luz_termino}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>
                    <div className='w-full'>
                      <Label htmlFor='lectura_gas_termino'>Lectura Gas Termino: </Label>
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.lectura_gas_termino ? true : undefined}
                        invalidFeedback={formik.errors.lectura_gas_termino ? String(formik.errors.lectura_gas_termino) : undefined}>
                        <FieldWrap>
                          <Input
                            type='number'
                            name='lectura_gas_termino'
                            onChange={formik.handleChange}
                            className='py-3'
                            value={formik.values.lectura_gas_termino}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>
                  </section>
                )
              : null
          }
          <div className='flex justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              onClick={() => formik.handleSubmit()}
              >
              {proceso_planta_harina?.estado_proceso !== '5' && !(variable_proceso_planta_harina?.lectura_gas_inicio && variable_proceso_planta_harina.lectura_luz_inicio)  ? 'Agregar variables inicio' : 'Agregar variables Termino'}
            </Button>
          </div>

        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioVariablesProcesoPlantaHarina
