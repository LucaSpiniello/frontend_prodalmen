import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact from '../../../components/form/SelectReact'
import { optionCalleBodega } from '../../../utils/options.constantes'
import Textarea from '../../../components/form/Textarea'
import Button from '../../../components/ui/Button'
import { fetchPalletsProductoTerminados } from '../../../redux/slices/embalajeSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormularioPalleProductoProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioPalletProductoTerminado: FC<IFormularioPalleProductoProps> = ({ setOpen }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const formik = useFormik({
    initialValues: {
      calle_bodega: '',
      observaciones: '',
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/embalaje/${id}/pallet_producto_terminado/`, 
      {
        registrado_por: perfil?.id,
        embalaje: id,
        ...values
      }
      , token_verificado)
      if (res.ok){
        toast.success('Pallet creado exitosamente')
        //@ts-ignore
        dispatch(fetchPalletsProductoTerminados({ id, token, verificar_token: verificarToken }))
        setOpen(false)
      } else {
        toast.error('No se ha podido crear el pallet')
      }

    }
  })


  return (
    <Container breakpoint={null} className='w-full'>
      <Card>
        <CardBody>
          <div className="w-full flex flex-col gap-5 justify-between">
            <div className='w-full flex-col items-center'>
              <Label htmlFor='calle_bodega'>Calle Bodega: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.calle_bodega ? true : undefined}
                invalidFeedback={formik.errors.calle_bodega ? String(formik.errors.calle_bodega) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                      options={optionCalleBodega}
                      id='calle_bodega'
                      placeholder='Selecciona un opción'
                      name='calle_bodega'
                      className='h-14 py-2'
                      onChange={(value: any) => {
                        formik.setFieldValue('calle_bodega', value.value)
                      }}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
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
                      value={formik.values.observaciones}
                      className='h-14 py-2'
                      onChange={formik.handleChange}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              className='text-xl py-2'
              onClick={() => formik.handleSubmit()}
              >
                Registrar Pallet Producto Terminado
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioPalletProductoTerminado
