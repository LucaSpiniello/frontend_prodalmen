import { useFormik } from 'formik'
import React, { Dispatch, SetStateAction, useState } from 'react'
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
import { registrar_bin_resultante_planta_harina } from '../../../../redux/slices/plantaHarinaSlice'
import { useParams } from 'react-router-dom'

const FormularioBinResultantePlantaHarina = ({ setOpen }: { setOpen : Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const { id } = useParams()
  const [disabled, setDisabled] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      calle_bodega: '',
      peso: 0,
      tipo_patineta: ''
    },
    onSubmit: (values) => {
      dispatch(registrar_bin_resultante_planta_harina({
        id: parseInt(id!),
        params: { setOpen: setOpen, setDisabled: setDisabled },
        data: { 
          programa: id,
          registrado_por: perfil?.id,
          ...values 
        },
        token,
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
                <Label htmlFor='calle_bodega'>Calle Bodega: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calle_bodega ? true : undefined}
                  invalidFeedback={formik.errors.calle_bodega ? String(formik.errors.calle_bodega) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionCalleBodega}
                      id='calle_bodega'
                      name='calle_bodega'
                      className='py-3'
                      value={optionCalleBodega.find(option => option?.value === formik.values.calle_bodega)}
                      onChange={(value: any) => {
                        formik.setFieldValue('calle_bodega', value.value)
                      }}         
                      />
                  </FieldWrap>
                </Validation>
              </article>

              <article className='w-full'>
                <Label htmlFor='peso'>Peso: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.peso ? true : undefined}
                  invalidFeedback={formik.errors.peso ? String(formik.errors.peso) : undefined}>
                  <FieldWrap>
                    <Input
                      type='number'
                      name='peso'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.peso}
                    />
                  </FieldWrap>
                </Validation>
              </article>

              <article className='w-full'>
                <Label htmlFor='tipo_patineta'>Tipo Patineta: </Label>
                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.tipo_patineta ? true : undefined}
                  invalidFeedback={formik.errors.tipo_patineta ? String(formik.errors.tipo_patineta) : undefined}>
                  <FieldWrap>
                    <SelectReact
                      placeholder="Seleccione un resultado"
                      options={optionTipoPatineta}
                      id='tipo_patineta'
                      name='tipo_patineta'
                      className='py-3'
                      value={optionTipoPatineta.find(option => option?.value === formik.values.tipo_patineta)}
                      onChange={(value: any) => {
                        formik.setFieldValue('tipo_patineta', value.value)
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
                  Registrar Bin Resultante Planta Harina
              </Button>

            </div>
          </section>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioBinResultantePlantaHarina
