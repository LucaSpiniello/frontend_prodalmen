import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Textarea from '../../../../components/form/Textarea'
import FieldWrap from '../../../../components/form/FieldWrap'
import Validation from '../../../../components/form/Validation'
import Label from '../../../../components/form/Label'
import Input from '../../../../components/form/Input'
import SelectReact from '../../../../components/form/SelectReact'
import { useLocation, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { OPTIONS, TTabs } from '../../../../types/TabsDashboardPrograma.types'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { optionCalleBodega, optionTipoPatineta, optionTipoResultante } from '../../../../utils/options.constantes'
import { GUARDAR_TARJA_NUEVA, fetchProgramaProduccion, fetchTarjasResultantes } from '../../../../redux/slices/produccionSlice'
import { useAuth } from '../../../../context/authContext'
import { fetchWithToken, fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import Button from '../../../../components/ui/Button'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormularioRegistroTarjaProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroTarja: FC<IFormularioRegistroTarjaProps> = ({ setOpen }) => {
  const { id } = useParams()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [disabled, setDisabled] = useState<boolean>(false)
    
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
      const res = await fetchWithTokenPost(`api/produccion/${id}/tarjas_resultantes/`, 
        {
          ...values,
          produccion: id,
          registrado_por: perfil?.id
        },
        token_verificado
      )

      if (res.ok){
        setDisabled(false)
        dispatch(fetchTarjasResultantes({ id: parseInt(id!), token, verificar_token: verificarToken }))
        dispatch(fetchProgramaProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))

        setOpen(false)
        toast.success("Tarja registrada exitosamente")
        asignarDiasKilos(id)
      } else {
        setDisabled(false)
        const errorData = await res.json()
        toast.error(`${Object.entries(errorData)}`)
      }
    }
  });

  const asignarDiasKilos = async (id : any) => {
    try {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado)throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/produccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
      if (response.ok) {
        toast.success('Dias Asignados')
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
                options={optionTipoResultante}
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
                className='py-3 text-black'
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
          onClick={() => {formik.handleSubmit(); setDisabled(true)}}
          className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Tarja
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormularioRegistroTarja
