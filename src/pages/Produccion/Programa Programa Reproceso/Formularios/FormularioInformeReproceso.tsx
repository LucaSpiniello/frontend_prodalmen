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
import { useAppSelector } from '../../../../redux/hooks'
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

const FormularioInformeReproceso: FC<IInformeProduccion> = ({ setOpen }) => {
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

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      desde: '',
      hasta: ''
    },
    onSubmit: async (values: any) => {
      console.log(values)
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithTokenPost(`api/reproceso/pdf-reproceso/`,
          {
            desde: state[0].startDate,
            hasta: state[0].endDate
          },
          token_verificado
        )
        if (res.ok){
          const data = await res.json()
          navigate('/pro/reproceso/pdf-informe-reproceso/', { state: { reproceso: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: '/reproceso' }})
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
      })
    }
  }, [state])


  
  return (
    <div className='w-full h-full'>
      <div className='flex flex-col gap-y-5'>
        <div className='flex flex-col md:flex-row lg:flex-row gap-10'>
          <div className='w-full h-full flex flex-col relative -top-1'>
            <span className='text-center text-lg'>Selecciona rango de fecha</span>
            <DateRangePicker setState={setState} state={state}/>
          </div> 
        </div>

        <div className='w-full  flex items-center justify-center gap-x-10'>
          <Button
            variant='solid'
            color='emerald'
            colorIntensity='700'
            onClick={() => formik.handleSubmit()}
            className='w-full hover:scale-105 font-semibold text-md'
            >
              Generar Informe
          </Button  >
          <Button
            variant='solid'
            color='red'colorIntensity='700'
            className='w-full hover:scale-105 font-semibold text-md text-white'
            onClick={() => setOpen(false)}
            >
              Volver
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FormularioInformeReproceso
