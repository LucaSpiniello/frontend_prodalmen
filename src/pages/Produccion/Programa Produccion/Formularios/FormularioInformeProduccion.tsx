import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Label from '../../../../components/form/Label'
import SelectReact from '../../../../components/form/SelectReact'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { useFormik } from 'formik'
import DateRangePicker from '../../../../components/DateRange'
import dayjs from 'dayjs'
import { Range } from 'react-date-range';
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { tipo_informe } from '../../../../utils/generalUtil'
import { useAuth } from '../../../../context/authContext'
import { fetchWithToken, fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import Button from '../../../../components/ui/Button'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IInformeProduccion {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioInformeProduccion: FC<IInformeProduccion> = ({ setOpen }) => {
  const base_url = process.env.VITE_BASE_URL
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().toDate(),
			endDate: dayjs().toDate(),
			key: 'selection',
		},
	]);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      tipo_informe: '',
      desde: '',
      hasta: ''
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')

          state[0].startDate = dayjs(state[0].startDate).hour(0).minute(0).second(0).millisecond(0).toDate();
        
          state[0].endDate = dayjs(state[0].endDate).hour(19).minute(59).second(0).millisecond(0).toDate();

        

        const res = await fetchWithTokenPost(`api/produccion/pdf_produccion/`,
          {
            ...values,
            desde: state[0].startDate,
            hasta: state[0].endDate
          },
          token_verificado
        )
        if (res.ok){
          const data = await res.json()
          if (values.tipo_informe === '1'){
            navigate('/pro/produccion/pdf-pre-limpia/', { state: { pdf_detalle: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: '/produccion'  }})
          } else {
            navigate('/pro/produccion/pdf-descascarado/', { state: { key: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: pathname }})
          }
        }
      } catch (error) {
        console.log("Algo ocurrio")
      }
    }
  })

  useEffect(() => {
    if (state){
      formik.setValues({
        desde: state[0].startDate,
        hasta: state[0].endDate,
        tipo_informe: formik.values.tipo_informe
      })
    }
  }, [state])


  
  return (
    <div className='w-full h-full'>
      <form className='flex flex-col gap-y-5' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col md:flex-row lg:flex-row gap-10'>
          <div className='w-full'>
            <Label htmlFor='tipo_informe'>Activo: </Label>
                  
              <Validation
              isValid={formik.isValid}
              isTouched={formik.touched.tipo_informe ? true : undefined}
              invalidFeedback={formik.errors.tipo_informe ? String(formik.errors.tipo_informe) : undefined}
              >
              <FieldWrap>
                <SelectReact
                  options={tipo_informe}
                  id='tipo_informe'
                  placeholder='Selecciona un opción'
                  name='tipo_informe'
                  className='h-12'
                  onChange={(value: any) => {
                    formik.setFieldValue('tipo_informe', value.value)
                  }}
                />
              </FieldWrap>
              </Validation>
          </div>

          <div className='w-full h-full flex flex-col relative -top-1'>
            <span>Selecciona rango de fecha</span>
            <DateRangePicker setState={setState} state={state}/>
          </div> 
        </div>

        <div className='w-full  flex items-center justify-center gap-x-10'>
          <Button
            variant='solid'
            onClick={() => formik.handleSubmit()}
            className='w-full px-4 py-4 rounded-md bg-green-700 hover:bg-green-600 border-green-700 hover:border-green-600 hover:scale-105 font-semibold text-md'
            >
              Generar Informe
          </Button  >
          <Button
            variant='solid'
            className='w-full px-5 py-4 rounded-md bg-red-700 hover:bg-red-600 border-red-700 hover:border-red-600 hover:scale-105 font-semibold text-md text-white'
            onClick={() => setOpen(false)}
            >
              Volver
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FormularioInformeProduccion
