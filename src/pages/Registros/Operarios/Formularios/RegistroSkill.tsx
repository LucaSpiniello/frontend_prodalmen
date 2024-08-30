import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { Dispatch, FC, SetStateAction } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import { useFormik } from 'formik'
import { operarioSchema } from '../../../../utils/Validator'
import { ACTIVO, TIPOS_OPERARIO } from '../../../../utils/constante'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import Input from '../../../../components/form/Input'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormChoferes {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroOperario : FC<IFormChoferes> = ({ setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)


  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      rut: '',
      tipo_operario: '',
      activo: false,
      etiquetas: '',
      pago_x_kilo: 0
    },
    validationSchema: operarioSchema,
    onSubmit: async (values) => {
     //@ts-ignore

      const token_verificado = await verificar_token(token)
     
      if (!token_verificado) throw new Error('Token no verificado')

      const response_creacion_productor = await fetchWithTokenPost(`api/productores/`, values , token_verificado)

      if (response_creacion_productor.ok){
        toast.success('Productor creado exitosamente!')
        setOpen(false)
        const data = await response_creacion_productor.json()
        return data
      } else if (response_creacion_productor.status === 400){
        const errorData = await response_creacion_productor.json()
        toast.error(`${errorData.rut_productor[0]}`)
      }
    }
  })

  const opcionOperario = TIPOS_OPERARIO?.map((operario) => ({
    value: operario.values,
    label: operario.label
  })) ?? []

  const Active = ACTIVO?.map((activo) => ({
    value: activo.values,
    label: activo.label
  })) ?? []

  const optionsOperario: TSelectOptions | [] = opcionOperario
  const optionActive: TSelectOptions | [] = Active

  return (
      <form 
        onSubmit={formik.handleSubmit}
        className={`
          flex flex-col 
          md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
          relative p-4 rounded-md`}
        >

        <div className='md:col-span-2 md:col-start-1 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='tipo_operario'>Tipo Operario: </Label>
        
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.tipo_operario ? true : undefined}
          invalidFeedback={formik.errors.tipo_operario ? String(formik.errors.tipo_operario) : undefined}
          >
          <FieldWrap>
            <SelectReact
                options={optionsOperario}
                id='tipo_operario'
                placeholder='Selecciona un opción'
                name='tipo_operario'
                className='h-12'
                onChange={(value: any) => {
                  formik.setFieldValue('tipo_operario', value.value)
                }}
              />
          </FieldWrap>  
        </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-1 md:flex-col items-center'>
          <Label htmlFor='pago_x_kilo'>Pago Por Kilo: </Label>
          
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pago_x_kilo ? true : undefined}
            invalidFeedback={formik.errors.pago_x_kilo ? String(formik.errors.pago_x_kilo) : undefined}
            >
            <FieldWrap>
               <Input
                 type='number'
                 name='pago_x_kilo'
                 onChange={formik.handleChange}
                 className='py-3'
                 value={formik.values.pago_x_kilo}
              />
             </FieldWrap>
           </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-5 h-12 w-full mt-7'>
          <button className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>Registrar Conductor</button>
        </div>
      </form>
  )
}

export default FormularioRegistroOperario
