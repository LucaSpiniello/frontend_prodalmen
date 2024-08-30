import { useFormik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import { useAuth } from '../../../../context/authContext'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { RootState } from '../../../../redux/store'
import { useAppSelector } from '../../../../redux/hooks'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import SelectReact from '../../../../components/form/SelectReact'
import { optionsOperarios } from '../../../../utils/options.constantes'
import Button from '../../../../components/ui/Button'
import Input from '../../../../components/form/Input'
import { fetchOperario } from '../../../../redux/slices/operarioSlice'
import * as Yup from 'yup'

const FormularioRegistroSkillOperario = ({ id, setOpen }: { id: number, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const validationSchema = Yup.object().shape({
    pago_x_kilo: Yup.string()
      .matches(/^\d+(\.\d{1,3})?$/, 'El número debe estar en el formato correcto y solo usar puntos como separador de decimales')
      .required('Este campo es obligatorio'),
    });


  const formik = useFormik({
    initialValues: {
      tipo_operario: '',
      pago_x_kilo: 0
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
       
        if (!token_verificado){
           throw new Error('Token no verificado')
        }
 
       const response = await fetchWithTokenPost(`api/registros/operarios/${id}/agregar-skill/`, { ...values } , token_verificado)
 
       if (response.ok) {
        setOpen(false)

         toast.success("Skill a operario creado exitosamente")
         dispatch(fetchOperario({ id, token, verificar_token: verificarToken }))
       } else {
        const errorData = await response.json()
        toast.error(`${Object.entries(errorData)}`)
       }
     } catch (error: any) {
       console.log(error) 
     }
    }
  })

  return (
    <div className={`w-full flex flex-col md:flex-row lg:flex-row gap-4`}>
      <div className='w-full md:w-5/12 flex-col items-center'>
        <Label htmlFor='tipo_operario'>Tipo Operario: </Label>
            
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.tipo_operario ? true : undefined}
          invalidFeedback={formik.errors.tipo_operario ? String(formik.errors.tipo_operario) : undefined}
          validFeedback='Good'>
          <FieldWrap>
            <SelectReact
                options={optionsOperarios}
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

      <div className='w-full md:w-5/12 justify-center'>
        <Label htmlFor='pago_x_kilo'>Pago Por Kilos: </Label>
        
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.pago_x_kilo ? true : undefined}
          invalidFeedback={formik.errors.pago_x_kilo ? String(formik.errors.pago_x_kilo) : undefined}
          >
          <FieldWrap>
            <Input
              type='text'
              name='pago_x_kilo'
              onChange={formik.handleChange}
              className='py-2.5'
              value={formik.values.pago_x_kilo}
            />
          </FieldWrap>
        </Validation>
      </div>


      <div className="w-full md:w-4/12 flex flex-col justify-end">

        <Button
          variant='solid'
          className="w-full py-2.5"
          color='blue'
          colorIntensity="700"
          onClick={() => {
            formik.handleSubmit()
          }}
          >
            Agregar Skill
        </Button>
      </div>
    </div>
  )
}

export default FormularioRegistroSkillOperario
