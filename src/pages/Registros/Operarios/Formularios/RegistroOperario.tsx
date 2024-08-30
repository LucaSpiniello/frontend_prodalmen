import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { Dispatch, FC, SetStateAction } from 'react'
import { useFormik } from 'formik'
import { ACTIVO, TIPOS_OPERARIO } from '../../../../utils/constante'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import Input from '../../../../components/form/Input'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { GUARDAR_OPERARIO } from '../../../../redux/slices/operarioSlice'
import { RootState } from '../../../../redux/store'
import Button from '../../../../components/ui/Button'
import toast from 'react-hot-toast'
import { useAuth } from '../../../../context/authContext'
import { GUARDAR_TOKENS } from '../../../../redux/slices/authSlice'
import { fetchWithToken, fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import Container from '../../../../components/layouts/Container/Container'
import Card from '../../../../components/ui/Card'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormChoferes {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroOperario: FC<IFormChoferes> = ({ setOpen }) => {

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      rut: '',
      activo: false,
    },
    // validationSchema: operarioSchema,
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
  
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/registros/operarios/`,
        {
          ...values
        },
        token_verificado
      )

      if (response.ok){
        const data = await response.json()
        dispatch(GUARDAR_OPERARIO(data))
        toast.success("Operario registrado correctamente")
        setOpen(false)
      } else if (response.status === 400){
        const errorData = await response.json()
        toast.error(`${Object.entries(errorData)}`)
    
      } else {
        console.log("to mal ctm")
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
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <form 
          className={`
            flex flex-col 
            md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
            relative p-4 rounded-md`}
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

          <div className='md:row-start-2 md:col-span-3 md:flex-col items-center'>
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

          <div className='md:col-span-3  md:row-start-2 md:flex-col items-center'>
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
                  className='h-12 py-3'
                  onChange={(value: any) => {
                    formik.setFieldValue('activo', value.value)
                  }}
                />
              </FieldWrap>
            </Validation>

          </div>

          <div className='md:row-start-3 md:col-span-2 md:col-start-5 h-12 w-full mt-7'>
            <Button
              onClick={() => {formik.handleSubmit()}}
              variant='solid'
              className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>
                Registrar Operario
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  )
}

export default FormularioRegistroOperario
