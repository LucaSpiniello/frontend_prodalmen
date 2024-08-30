import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
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
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchEtiquetasEmbalaje, registroEtiquetas } from '../../../redux/slices/embalajeSlice'
import toast from 'react-hot-toast'

interface IFormularioEtiquetaProps {
  setOpen: Dispatch<SetStateAction<boolean>>
} 

const FormularioEtiqueta: FC<IFormularioEtiquetaProps> = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [etiquetaCaja, setEtiquetaCaja] = useState<File>()
  const [etiquetaTermica, setEtiquetaTermica] = useState<File>()

  const formik = useFormik({
    initialValues: {
      nombre: '',
    },
    onSubmit: async (values) => {
      // await dispatch(registroEtiquetas({ token, data: values, verificar_token: verificarToken, action: setOpen }))
      try {
        if (etiquetaCaja && etiquetaTermica) {
          const token_validado = await verificarToken(token)
          if (!token_validado) throw new Error('El token no es valido')
          const formData: FormData = new FormData()
          formData.append('archivo_etiqueta_caja', etiquetaCaja)
          formData.append('archivo_etiqueta_termica', etiquetaTermica)
          formData.append('nombre', values.nombre)
          const configPost = {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token_validado}`
            },
            body: formData
          }
          const response = await fetch(`${process.env.VITE_BASE_URL}/api/etiqueta_embalaje/`, configPost)
          if (response.ok) {
            toast.success('Etiquetas Creadas')
            dispatch(fetchEtiquetasEmbalaje({ token, verificar_token: verificarToken }))
          } else {
            toast.error(`error ${await response.json()}`)
          }
        } else {
          toast.error('Debe Subir las 2 Etiquetas')
        }
      } catch (error: any) {
        console.log(error)
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
                <Label htmlFor='archivo_etiqueta_caja'>Archivo Etiqueta Caja: </Label>
                  <input
                    type='file'
                    id='archivo_etiqueta_caja'
                    name='archivo_etiqueta_caja'
                    onChange={(e) => {
                      if (e.target.files) {
                        setEtiquetaCaja(e.target.files[0])
                      }
                    }}
                    className='py-[10px]'
                  />
              </div>
              <div className='w-full'>
                <Label htmlFor='archivo_etiqueta_termica'>Archivo Etiqueta Termica: </Label>
                  <input
                    type='file'
                    id="archivo_etiqueta_termica"
                    name='archivo_etiqueta_termica'
                    onChange={(e) => {
                      if (e.target.files) {
                        setEtiquetaTermica(e.target.files[0])
                      }
                    }}
                    className='py-[10px]'
                  />
              </div>
            </div>

            <div className='flex justify-end'>
              <Button
                variant='solid'
                color='blue'
                colorIntensity='700'
                onClick={() => formik.handleSubmit()}
                >
                  Registrar Etiqueta
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioEtiqueta
