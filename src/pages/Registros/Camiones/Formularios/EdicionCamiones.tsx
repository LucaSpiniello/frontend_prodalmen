import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import SelectReact from '../../../../components/form/SelectReact'
import Textarea from '../../../../components/form/Textarea'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../../hooks/useDarkMode'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { editarCamion, fetchCamion } from '../../../../redux/slices/camionesSlice'
import { optionsAcoplado } from '../../../../utils/options.constantes'
import { useAuth } from '../../../../context/authContext'
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch'
import { TCamion } from '../../../../types/TypesRegistros.types'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';



interface IFormCamiones {
  setOpen: Dispatch<SetStateAction<boolean>>
  id: number | undefined
}

const FormularioEditarCamiones: FC<IFormCamiones> = ({setOpen, id}) => {
  const { isDarkTheme } = useDarkMode();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  // const { data: camion } = useAuthenticatedFetch<TCamion>(`api/registros/camiones/${id}/`)

  const camion = useAppSelector((state: RootState) => state.camiones.camion)

  useEffect(() => {
      //@ts-ignore
      dispatch(fetchCamion({ id, token, verificar_token: verificarToken }))
  }, [id])
  
  useEffect(() => {
    formik.setValues({
      patente: camion?.patente!,
      acoplado: camion?.acoplado!,
      observaciones: camion?.observaciones!
    })
    return () => {}
  }, [camion])


  const formik = useFormik({
    initialValues: {
      patente: "",
      acoplado: false,
      observaciones: ""
    },
    onSubmit: async (values) => {
     // @ts-ignore
     dispatch(editarCamion({ id, token, data: values, action: setOpen, verificar_token: verificarToken }))
    }
  })


  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6
        rounded-md`}
    >
       <div className='md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='patente'>Patente: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.patente ? true : undefined}
            invalidFeedback={formik.errors.patente ? String(formik.errors.patente) : undefined}
            >
            <FieldWrap>
            <Input
              type='text'
              name='patente'
              onChange={formik.handleChange}
              className='py-3'
              value={formik.values.patente}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
          <Label htmlFor='acoplado'>Acoplado: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.acoplado ? true : undefined}
            invalidFeedback={formik.errors.acoplado ? String(formik.errors.acoplado) : undefined}
            >
            <FieldWrap>
              <SelectReact
                options={optionsAcoplado}
                id='acoplado'
                placeholder='Selecciona un opción'
                name='acoplado'
                className='h-14 py-2'
                value={optionsAcoplado.find(option => option?.value === String(formik.values.acoplado))}

                onChange={(value: any) => {
                  formik.setFieldValue('acoplado', value.value)
                }}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:row-start-2 md:col-span-4  md:flex-col items-center'>
          <Label htmlFor='observaciones'>Observaciones: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.observaciones ? true : undefined}
            invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
            >
            <FieldWrap>
              <Textarea
                rows={5}
                cols={9}
                name='observaciones'
                onChange={formik.handleChange}
                value={formik.values.observaciones}
              />
            </FieldWrap>
          </Validation>
        </div>

      <div className='relative w-full h-20 col-span-4'>
        <button type='submit' className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
          Guardar Cambios
        </button>
      </div>
    </form>

  )
}

export default FormularioEditarCamiones
