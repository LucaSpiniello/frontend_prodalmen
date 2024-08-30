import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import useDarkMode from '../../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { conductorSchema } from '../../../../utils/Validator'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { editarConductor, fetchConductor } from '../../../../redux/slices/conductoresSlice'
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch'
import { TConductor } from '../../../../types/TypesRegistros.types'
import { useAuth } from '../../../../context/authContext'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormChoferes {
  setOpen: Dispatch<SetStateAction<boolean>>
  id: number
}

const FormularioEdicionConductores: FC<IFormChoferes> = ({ setOpen, id }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  // const conductor = useAppSelector((state: RootState) => state.conductores.conductor)

  const { data: conductor } = useAuthenticatedFetch<TConductor>(`api/registros/choferes/${id}/`)

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
    <form
      onSubmit={formik.handleSubmit}
      className={`
          flex flex-col 
          md:grid md:grid-cols-4 gap-x-4 gap-y-8 mt-10 
          relative p-4  rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
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
            className='py-3'
            value={formik.values.nombre}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <Label htmlFor='apellido'>Apellido: </Label>

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
      </div>

      <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='rut'>Rut: </Label>

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
      </div>

      <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='telefono'>Contacto: </Label>

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
      </div>
    

      <div className='md:row-start-3 md:col-span-2 md:col-start-3 h-14 w-full'>
        <button type='submit' className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>Guardar Cambios</button>
      </div>
    </form>
  )
}

export default FormularioEdicionConductores
