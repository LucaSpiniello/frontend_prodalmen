
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import useDarkMode from '../../../hooks/useDarkMode'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { editarComercializador, fetchComercializador } from '../../../redux/slices/comercializadores'
import { useAuth } from '../../../context/authContext'
import Card, { CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { useFormik } from 'formik'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import Input from '../../../components/form/Input'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IDetalleProps {
  id: number
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DetalleComercializador: FC<IDetalleProps> = ({ id, setOpen }) => {
  const { isDarkTheme } = useDarkMode()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const comercializador = useAppSelector((state: RootState) => state.comercializadores.comercializador)
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState(false)
  

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchComercializador({ id, token, verificar_token: verificarToken }))
  }, [id])

  useEffect(() => {
    formik.setValues({
      nombre: comercializador?.nombre,
      razon_social: comercializador?.razon_social,
      giro: comercializador?.giro,
      direccion: comercializador?.direccion,
      zip_code: comercializador?.zip_code,
      email_comercializador: comercializador?.email_comercializador
    })
    return () => {}
  }, [comercializador])


  const formik = useFormik({
    initialValues: {
      nombre: "",
      razon_social: "",
      giro: "",
      direccion: "",
      zip_code: "",
      email_comercializador: ""
    },
    onSubmit: async (values: any) => {
      // @ts-ignore
      dispatch(editarComercializador({ id, token, data: values, action: setOpen, verificar_token: verificarToken }))
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
          className={`flex flex-col 
          md:grid md:grid-cols-6 gap-x-4 gap-y-8 relative p-4  rounded-md`}
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
                    <span>{comercializador?.nombre}</span>
                  </div>
                  )
            }
          </div>

          <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
            <label htmlFor="razon_social">Razón Social: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.razon_social ? true : undefined}
                    invalidFeedback={formik.errors.razon_social ? String(formik.errors.razon_social) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='razon_social'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.razon_social}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{comercializador?.razon_social}</span>
                  </div>
                  )
            }
          </div>

          <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
            <label htmlFor="giro">Giro: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.giro ? true : undefined}
                    invalidFeedback={formik.errors.giro ? String(formik.errors.giro) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='giro'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.giro}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{comercializador?.giro}</span>
                  </div>
                  )
            }
          </div>


          <div className='md:col-span-2 md:row-start-2  md:flex-col items-center'>
            <label htmlFor="direccion">Dirección: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.direccion ? true : undefined}
                    invalidFeedback={formik.errors.direccion ? String(formik.errors.direccion) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='direccion'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.direccion}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{comercializador?.direccion}</span>
                  </div>
                  )
            }
          </div>


          <div className='md:col-span-2 md:row-start-2 md:col-start-3 md:flex-col items-center'>
            <label htmlFor="zip_code">Código de Zona (Zip Code): </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.zip_code ? true : undefined}
                    invalidFeedback={formik.errors.zip_code ? String(formik.errors.zip_code) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='zip_code'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.zip_code}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{comercializador?.zip_code}</span>
                  </div>
                  )
            }
            
          </div>



          <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
            <label htmlFor="email_comercializador">Email Comercializador: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.email_comercializador ? true : undefined}
                    invalidFeedback={formik.errors.email_comercializador ? String(formik.errors.email_comercializador) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='email_comercializador'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.email_comercializador}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{comercializador?.email_comercializador}</span>
                  </div>
                  )
            }

          </div>


        </div>
      </CardBody>
    </Card>
  )
}

export default DetalleComercializador  
