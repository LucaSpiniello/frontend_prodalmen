//@ts-nocheck
import { Dispatch, FC, SetStateAction, useEffect } from "react"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { editOperario, fetchOperario } from "../../../../redux/slices/operarioSlice"
import { ACTIVO, TIPOS_OPERARIO } from "../../../../utils/constante"
import SelectReact, { TSelectOptions } from "../../../../components/form/SelectReact"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import Input from "../../../../components/form/Input"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormChoferes {
  setOpen: Dispatch<SetStateAction<boolean>>
  id: number
}

const FormularioEdicionOperario: FC<IFormChoferes> = ({ setOpen, id }) => {
  const { isDarkTheme } = useDarkMode()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const operario = useAppSelector((state: RootState) => state.operarios.operario)
  const token = useAppSelector((state: RootState) => state.auth.authTokens?.access)


	useEffect(() => {
    //@ts-ignore
		dispatch(fetchOperario({ id, token }))

		formik.setValues({
      nombre: operario?.nombre!,
      apellido: operario?.apellido!,
      rut: operario?.rut!
			})
	}, [dispatch])

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
    onSubmit: async (values) => {
      //@ts-ignore
      dispatch(editOperario({ id, operario: values, token, isOpen: setOpen }));
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

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
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

        <div className='md:col-span-2 md:col-start-1 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='tipo_operario'>Tipo Operario: </Label>
        
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.tipo_operario ? true : undefined}
          invalidFeedback={formik.errors.tipo_operario ? String(formik.errors.tipo_operario) : undefined}
          validFeedback='Good'>
          <FieldWrap>
            <SelectReact
                options={optionsOperario}
                id='tipo_operario'
                placeholder='Selecciona un opción'
                name='tipo_operario'
                className='h-12'
                value={opcionOperario.find(option => option.value === formik.values.tipo_operario)}
                onChange={(value: any) => {
                  formik.setFieldValue('tipo_operario', value.value)
                }}
              />
          </FieldWrap>
        </Validation>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
          <Label htmlFor='activo'>Activo: </Label>
          
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.activo ? true : undefined}
            invalidFeedback={formik.errors.activo ? String(formik.errors.activo) : undefined}
            >
            <FieldWrap>
              <SelectReact
                options={optionActive}
                id='activo'
                placeholder='Selecciona un opción'
                name='activo'
                className='h-12'
                value={optionActive.find(option => (option?.value) === String(formik.values.activo))}
                onChange={(value: any) => {
                  formik.setFieldValue('activo', value.value)
                }}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <Label htmlFor='etiquetas'>Etiquetas: </Label>
          
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.etiquetas ? true : undefined}
            invalidFeedback={formik.errors.etiquetas ? String(formik.errors.etiquetas) : undefined}
            >
            <FieldWrap>
              <Input
                type='text'
                name='etiquetas'
                onChange={formik.handleChange}
                className='py-3'
                value={formik.values.etiquetas}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-1 md:flex-col items-center'>
          <Label htmlFor='pago_x_kilo'>Dirección: </Label>
          
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
                 className='py-3'
                 value={formik.values.pago_x_kilo}
              />
             </FieldWrap>
           </Validation>
        </div>

      <div className='md:row-start-3 md:col-span-2 md:col-start-5 h-12 w-full mt-7'>
        <button type='submit' className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}

export default FormularioEdicionOperario
