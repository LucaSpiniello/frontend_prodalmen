import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { envaseSchema } from '../../../../utils/Validator';
import Label from '../../../../components/form/Label';
import Validation from '../../../../components/form/Validation';
import FieldWrap from '../../../../components/form/FieldWrap';
import Input from '../../../../components/form/Input';
import Textarea from '../../../../components/form/Textarea';
import Button from '../../../../components/ui/Button';
import { useAuth } from '../../../../context/authContext';
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils';
import { GUARDAR_ENVASE } from '../../../../redux/slices/envasesSlice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';



interface IFormEnvasesProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroEnvases : FC<IFormEnvasesProps> = ({ setOpen }) => {
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

  const formik = useFormik({
    initialValues: {
      nombre: "",
      peso: 0,
      descripcion: ""
    },
    validationSchema: envaseSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithTokenPost(`api/envasesmp/`, { ...values }, token_verificado)
        if (res.ok) {
          const data = await res.json()
          toast.success("El envase fue registrado exitosamente!!")
          dispatch(GUARDAR_ENVASE(data))
          setOpen(false)

        } else if (res.status === 400) {
          const erroData = await res.json()
          toast.error(`${Object.entries(erroData)}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })


  return (
    
      <form 
        onSubmit={formik.handleSubmit}
        className={`
          flex flex-col 
          md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
          relative p-4 dark:bg-zinc-900 bg-zinc-50 rounded-md`}
        >
        <div className='md:col-span-3 md:flex-col items-center'>
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

        <div className='md:col-span-3 md:col-start-4 md:flex-col items-center'>
          <Label htmlFor='peso'>Peso Envase: </Label>
          
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.peso ? true : undefined}
            invalidFeedback={formik.errors.peso ? String(formik.errors.peso) : undefined}
            >
            <FieldWrap>
               <Input
                 type='text'
                 name='peso'
                 onChange={formik.handleChange}
                 className='py-3'
                 value={formik.values.peso}
              />
             </FieldWrap>
           </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-6 md:flex-col items-center'>
          <Label htmlFor='descripcion'>Descripción: </Label>
          
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.descripcion ? true : undefined}
            invalidFeedback={formik.errors.descripcion ? String(formik.errors.descripcion) : undefined}
            >
            <FieldWrap>
              <Textarea 
                name='descripcion'
                onChange={formik.handleChange}
                value={formik.values.descripcion}
                className='py-2'
                rows={6}
              />
             </FieldWrap>
           </Validation>
        </div>

      

        <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
          <Button
            onClick={() => formik.handleSubmit()}
            variant='solid' 
            className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Envase
          </Button>
        </div>
      </form>
  )
}

export default FormularioRegistroEnvases  
