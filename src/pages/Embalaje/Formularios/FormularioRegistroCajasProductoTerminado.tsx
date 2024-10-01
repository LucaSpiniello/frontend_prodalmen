import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
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
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import Button from '../../../components/ui/Button'
import Input from '../../../components/form/Input'
import { fetchPalletProductoTerminado, fetchPalletsProductoTerminados, fetchTipoEmbalaje } from '../../../redux/slices/embalajeSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

interface IFormularioCajasPalletProps {
  setOpen: Dispatch<SetStateAction<boolean>>
  id_pallet: number
}

const FormularioCajasPalletProductoTerminado: FC<IFormularioCajasPalletProps> = ({ id_pallet, setOpen }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const tipo_embalaje = useAppSelector((state: RootState) => state.embalaje.tipo_embalaje)
  const [pesoCaja, setPesoCaja] = useState<number | undefined>(0)

  useEffect(() => {
    if (tipo_embalaje.length < 1){
      //@ts-ignores
      dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
    }
  }, [])

  const validationSchema = Yup.object().shape({
    cantidad_cajas: Yup.number().min(0, 'Ingrese un numero mayor a 0').required('Ingrese la cantidad de cajas').positive('Ingrese un numero mayor a 0'),
    peso_x_caja: Yup.number().max(pesoCaja!, `No puede sobrepasar los ${pesoCaja} kilos de la caja`).min(0, 'Ingrese un numero mayor a 0').positive('Ingrese un numero mayor a 0').required('Ingrese un peso para la caja'),
    tipo_caja: Yup.string().required('Ingrese un tipo de caja').nonNullable('Ingrese un tipo de caja')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tipo_caja: '',
      peso_x_caja: 0,
      cantidad_cajas: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/embalaje/${id}/pallet_producto_terminado/${id_pallet}/cajas_en_pallet_producto_terminado/`, 
      {
        registrado_por: perfil?.id,
        pallet: id_pallet,
        ...values
      }
      , token_verificado)
      if (res.ok){
        asignar_dias_kilos()
        toast.success('Caja agregada exitosamente')
        //@ts-ignore
        dispatch(fetchPalletProductoTerminado({ id, params: { id_pallet }, token, verificar_token: verificarToken  }))
         //@ts-ignore
         dispatch(fetchPalletsProductoTerminados({ id, token, verificar_token: verificarToken }))
        setOpen(false)
      } else {
        toast.error('No se ha podido crear el pallet')
      }
    }
  })

  const asignar_dias_kilos = async () => {
    try {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/embalaje/${id}/asignar_dias_kilos/`, {}, token_verificado)
      if (response.ok) {
        toast.success('Dias Asignados')
      } else {
        toast.error('Error' + `${await response.json()}`)
      }
    } catch {
      console.log('Error dias asignados')
    }
  }

  const optionsTipoEmbalaje: TSelectOptions = tipo_embalaje.
    filter(tipo => tipo?.id !== Number(formik.values.tipo_caja)).
    map((tipo) => ({ value: String(tipo.id), label: tipo.nombre}))
    ?? []

  return (
    <Container breakpoint={null} className='w-full'>
      <Card>
        <CardBody className='flex flex-col gap-5'>
          <div className="w-full flex gap-5 justify-between">
            <div className='w-full flex-col items-center'>
              <Label htmlFor='tipo_caja'>Tipo Caja: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_caja ? true : undefined}
                invalidFeedback={formik.errors.tipo_caja ? String(formik.errors.tipo_caja) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                      options={optionsTipoEmbalaje}
                      id='tipo_caja'
                      placeholder='Selecciona un opción'
                      name='tipo_caja'
                      className='h-14 py-2'
                      onChange={(value: any) => {
                        formik.setFieldValue('tipo_caja', value.value)
                        setPesoCaja(tipo_embalaje.find(element => element.id == value.value)?.peso)
                      }}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='peso_x_caja'>Peso Por Caja: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.peso_x_caja ? true : undefined}
                invalidFeedback={formik.errors.peso_x_caja ? String(formik.errors.peso_x_caja) : undefined}
                >
                <FieldWrap>
                  <Input
                      type='number'
                      id='peso_x_caja'
                      name='peso_x_caja'
                      value={formik.values.peso_x_caja}
                      className='h-14 py-2'
                      onChange={formik.handleChange}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full flex-col items-center'>
              <Label htmlFor='cantidad_cajas'>Cantidad de Cajas: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.cantidad_cajas ? true : undefined}
                invalidFeedback={formik.errors.cantidad_cajas ? String(formik.errors.cantidad_cajas) : undefined}
                >
                <FieldWrap>
                  <Input
                      type='number'
                      id='cantidad_cajas'
                      name='cantidad_cajas'
                      value={formik.values.cantidad_cajas}
                      className='h-14 py-2'
                      onChange={formik.handleChange}
                    />
                </FieldWrap>
              </Validation>
            </div>
          </div>

          <div className='w-full flex justify-end'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              className='text-xl py-2'
              onClick={() => formik.handleSubmit()}
              >
                Registrar Cajas Pallet Producto Terminado
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioCajasPalletProductoTerminado
