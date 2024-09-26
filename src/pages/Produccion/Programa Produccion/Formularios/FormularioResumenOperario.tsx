import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import { DateRange, Range } from 'react-date-range';
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import DateRangePicker from '../../../../components/DateRange'
import { useAuth } from '../../../../context/authContext';
import { fetchWithToken, fetchWithTokenPost } from '../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IInformeProduccion {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioResumen: FC<IInformeProduccion> = ({ setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const navigate = useNavigate()
  const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().toDate(),
			endDate: dayjs().toDate(),
			key: 'selection',
		},
	]);

  const formik = useFormik({
    initialValues: {
      desde: '',
      hasta: ''
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')
          state[0].startDate = dayjs(state[0].startDate).hour(0).minute(0).second(0).millisecond(0).toDate();
        
        state[0].endDate = dayjs(state[0].endDate).hour(19).minute(59).second(0).millisecond(0).toDate();

      
        const res = await fetchWithTokenPost(`api/produccion/pdf_operario_resumido/`,
          {
            ...values,
            desde: state[0].startDate,
            hasta: state[0].endDate
          },
          token_verificado
        )
        if (res.ok){
          const data = await res.json()
          navigate('/pro/produccion/pdf-operario-resumido', { state: { produccion: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: '/produccion' }, replace: true})
        } else if (res.status === 404) {
          const errorData = await res.json()
          toast.error(`${Object.entries(errorData)}`)
        }
      } catch (error) {
        console.log("Algo ocurrio")
      }
    }
  })

  return (
    <div className='w-full h-full'>
      <form className='flex flex-col gap-y-5' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col md:flex-row lg:flex-row gap-10'>
          <div className='w-full h-full flex flex-col relative -top-1'>
            <span className='text-center text-2xl'>Selecciona rango de fecha</span>
            <DateRangePicker setState={setState} state={state}/>
          </div> 
        </div>

        <div className='w-full  flex items-center justify-center gap-x-10'>
          <Button
            variant='solid'
            className='w-full px-4 py-4 rounded-md bg-green-700 hover:bg-green-600 border-green-700 hover:border-green-600 hover:scale-105 font-semibold text-md'
            onClick={() => formik.handleSubmit()}
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

export default FormularioResumen
