import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import SelectReact from '../../../../components/form/SelectReact'
import FieldWrap from '../../../../components/form/FieldWrap'
import Input from '../../../../components/form/Input'
import { optionCalleBodega, optionTipoPatineta, optionsTipoResultanteSeleccion } from '../../../../utils/options.constantes'
import Button from '../../../../components/ui/Button'
import { fetchTarjasSeleccionadas } from '../../../../redux/slices/seleccionSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormularioRegistroTarjaSeleccionProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}



const FormularioRegistroTarjaSeleccion: FC<IFormularioRegistroTarjaSeleccionProps> = ({ setOpen }) => {
  const { id } = useParams()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [disabled, setDisabled] = useState<boolean>()
    
  const formik = useFormik({
    initialValues: {
      tipo_resultante: '',
      peso: 0,
      tipo_patineta: '',
      calle_bodega: ''
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/seleccion/${id}/tarjaseleccionada/`, 
        {
          ...values,
          seleccion: id,
          registrado_por: perfil?.id
        },
        token_verificado
      )

      if (res.ok){
        const data = await res.json()
        //@ts-ignore
        dispatch(fetchTarjasSeleccionadas({ id, token, verificar_token: verificarToken }))
        asignar_dias_kilos()
        setOpen(false)
        toast.success("Tarja registrada exitosamente")
        setDisabled(false)
      } else {
        console.log("mal hecho")
        setDisabled(false)
      }
    }
  });

  const asignar_dias_kilos = async () => {
    try {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/seleccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
      if (response.ok) {
        toast.success('Trabajo asignado a operarios')
      } else {
        toast.error('Error' + `${await response.json()}`)
      }
    } catch {
      console.log('Error dias asignados')
    }
  }

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 dark:bg-inherit relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='tipo_resultante'>Tipo Resultante: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.tipo_resultante ? true : undefined}
            invalidFeedback={formik.errors.tipo_resultante ? String(formik.errors.tipo_resultante) : undefined}
            >
            <FieldWrap>
              <SelectReact
                options={optionsTipoResultanteSeleccion}
                id='tipo_resultante'
                placeholder='Selecciona un opción'
                name='tipo_resultante'
                className='h-14 py-2'
                onChange={(value: any) => {
                  formik.setFieldValue('tipo_resultante', value.value)
                }}
              />
            
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex flex-col'>
          <Label htmlFor='peso'>Peso: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.peso ? true : undefined}
            invalidFeedback={formik.errors.peso ? String(formik.errors.peso) : undefined}
            >
            <FieldWrap>
              <Input
                type='number'
                name='peso'
                onChange={formik.handleChange}
                className='py-[13px] mt-0.5 text-black'
                value={formik.values.peso}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:row-start-2 md:col-span-2  md:flex-col items-center'>
          <Label htmlFor='tipo_patineta'>Tipo Patineta: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.tipo_patineta ? true : undefined}
            invalidFeedback={formik.errors.tipo_patineta ? String(formik.errors.tipo_patineta) : undefined}
            >
            <FieldWrap>
              <SelectReact
                  options={optionTipoPatineta}
                  id='tipo_patineta'
                  placeholder='Selecciona un opción'
                  name='tipo_patineta'
                  className='h-14 py-2'
                  onChange={(value: any) => {
                    formik.setFieldValue('tipo_patineta', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-start-3 md:col-span-2  md:flex-col items-center'>
          <Label htmlFor='calle_bodega'>Calle Bodega: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.calle_bodega ? true : undefined}
            invalidFeedback={formik.errors.calle_bodega ? String(formik.errors.calle_bodega) : undefined}
            >
            <FieldWrap>
              <SelectReact
                  options={optionCalleBodega}
                  id='calle_bodega'
                  placeholder='Selecciona un opción'
                  name='calle_bodega'
                  className='h-14 py-2'
                  onChange={(value: any) => {
                    formik.setFieldValue('calle_bodega', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
        </div>



        <div className='relative w-full h-20 col-span-4'>
         <Button
          variant='solid'
          isDisable={disabled}
          onClick={() => {setDisabled(true);formik.handleSubmit()}}
          className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Tarja
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormularioRegistroTarjaSeleccion
