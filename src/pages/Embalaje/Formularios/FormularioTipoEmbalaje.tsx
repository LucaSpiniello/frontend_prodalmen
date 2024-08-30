import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import Input from '../../../components/form/Input'
import Button from '../../../components/ui/Button'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import { fetchTipoEmbalaje } from '../../../redux/slices/embalajeSlice'

interface IFormularioTipoEmbalajeProps {
  setOpen: Dispatch<SetStateAction<boolean>>
} 

const FormularioTipoEmbalaje: FC<IFormularioTipoEmbalajeProps> = ({ setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      nombre: '',
      peso: 0
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost('api/tipo_embalaje/', {...values}, token_verificado)
      if (res.ok){
        toast.success('Tipo Embalaje registrado exitosamente')
        setOpen(false)
        dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
      } else {
        toast.error('No se pudo registrar, volver a intentar')
      }
    }
  })


  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardBody>
          <div className='flex flex-col gap-5'>
            <div className='flex gap-5 justify-between'>
              <div className='w-full'>
                <Label htmlFor='nombre'>Nombre: </Label>

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
                      className='py-[10px]'
                      value={formik.values.nombre}
                    />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='w-full'>
                <Label htmlFor='peso'>Peso: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.peso ? true : undefined}
                  invalidFeedback={formik.errors.peso ? String(formik.errors.peso) : undefined}
                  >
                  <FieldWrap>
                    <Input
                      type='number'
                      name='peso'
                      onChange={formik.handleChange}
                      className='py-[10px]'
                      value={formik.values.peso}
                    />
                  </FieldWrap>
                </Validation>
              </div>
            </div>

            <div className='flex justify-end'>
              <Button
                variant='solid'
                color='blue'
                colorIntensity='700'
                onClick={() => formik.handleSubmit()}
                >
                  Registrar Tipo Embalaje
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioTipoEmbalaje
