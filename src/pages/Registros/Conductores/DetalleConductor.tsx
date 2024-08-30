import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { editarConductor, fetchConductor } from '../../../redux/slices/conductoresSlice'
import { useAuth } from '../../../context/authContext'
import Card, { CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { useFormik } from 'formik'
import { conductorSchema } from '../../../utils/Validator'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import Input from '../../../components/form/Input'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IDetalleConductor {
  id: number
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DetalleConductor: FC<IDetalleConductor> = ({ id, setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const conductor = useAppSelector((state: RootState) => state.conductores.conductor)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { isDarkTheme } = useDarkMode()
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState(false)

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchConductor({ id, token, verificar_token: verificarToken }))
  }, [id])

  useEffect(() => {
    formik.setValues({
      nombre: conductor?.nombre,
      apellido: conductor?.apellido,
      rut: conductor?.rut,
      telefono: conductor?.telefono
    })
  }, [conductor])


  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      rut: "",
      telefono: ""
    },
    validationSchema: conductorSchema,
    onSubmit: async (values: any) => {
      // @ts-ignore
      dispatch(editarConductor({ id, token, data: values, action: setOpen, verificar_token: verificarToken }))
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className='w-full h-full py-3 flex justify-between'>
          <div className='w-full'>
            {
              !editar
                ? (
                  <Button
                    variant='solid'
                    size='lg'
                    className='px-14'
                    onClick={() => setEditar(true)}
                    >
                      Editar
                  </Button>
                  )
                : (
                  <Button
                    variant='solid'
                    size='lg'
                    className='px-14 bg-red-700 hover:bg-red-600 border border-red-900 hover:border-red-900'
                    onClick={() => setEditar(false)}
                    >
                      Cancelar
                  </Button>
                  
                )
            }
          </div>
          <div className='w-full flex items-center justify-end'>
            {
              editar
                ? (
                  <Button
                    variant='solid'
                    size='lg'
                    className='px-14'
                    onClick={() => {
                      formik.handleSubmit()
                    }}
                    >
                      Guardar
                  </Button>
                  )
                : null
            }
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <div
          className={`
              flex flex-col 
              md:grid md:grid-cols-4 gap-x-4 gap-y-8 
              relative p-4 rounded-md`}
        >
          <div className='md:col-span-2 md:flex-col items-center'>
            <label htmlFor="nombre">Nombre: </label>
            {
              editar
                ? (
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
                      className='py-3'
                      value={formik.values.nombre}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{conductor?.nombre}</span>
                  </div>
                  )
            }

          </div>

          <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
            <label htmlFor="apellido">Apellido: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.apellido ? true : undefined}
                    invalidFeedback={formik.errors.apellido ? String(formik.errors.apellido) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='apellido'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.apellido}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{conductor?.apellido}</span>
                  </div>
                  )
            }
          </div>

          <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
            <label htmlFor="rut">Rut: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.rut ? true : undefined}
                    invalidFeedback={formik.errors.rut ? String(formik.errors.rut) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='rut'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.rut}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{conductor?.rut}</span>
                  </div>
                  )
            }
          </div>

          <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
            <label htmlFor="telefono">Contacto: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.telefono ? true : undefined}
                    invalidFeedback={formik.errors.telefono ? String(formik.errors.telefono) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='telefono'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.telefono}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{conductor?.telefono}</span>
                  </div>
                  )
            }
            
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default DetalleConductor
