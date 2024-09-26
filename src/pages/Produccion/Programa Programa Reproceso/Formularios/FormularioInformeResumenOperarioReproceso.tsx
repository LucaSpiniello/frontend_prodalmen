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
import Label from '../../../../components/form/Label';
import Validation from '../../../../components/form/Validation';
import FieldWrap from '../../../../components/form/FieldWrap';
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact';
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch';
import { TOperarioProduccion } from '../../../../types/TypesProduccion.types';

interface IInformeProduccion {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioResumenOperarioReproceso: FC<IInformeProduccion> = ({ setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { data: operarios } = useAuthenticatedFetch<TOperarioProduccion[]>(
    `api/registros/operarios`
  )

  const optionOperarios: TSelectOptions = operarios?.map((operario) => ({
    value: String(operario.id),
    label: `${operario.nombre} ${operario.apellido}`
  })) ?? []

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
      operario: '',
      desde: '',
      hasta: ''
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithTokenPost(`api/reproceso/pdf-operario-resumido/`,
          {
            ...values,
            desde: state[0].startDate,
            hasta: state[0].endDate
          },
          token_verificado
        )
        if (res.ok){
          const data = await res.json()
          navigate('/pro/reproceso/pdf-operario-resumido', { state: { reproceso: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: '/reproceso' }, replace: true})
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
      <div className='flex flex-col gap-y-5' >
        <div className='w-full'>
            <Label htmlFor='operario'>Operarios: </Label>
                  
              <Validation
              isValid={formik.isValid}
              isTouched={formik.touched.operario ? true : undefined}
              invalidFeedback={formik.errors.operario ? String(formik.errors.operario) : undefined}
              >
              <FieldWrap>
                <SelectReact
                  options={optionOperarios}
                  id='operario'
                  placeholder='Selecciona un opción'
                  name='operario'
                  className='h-12'
                  onChange={(value: any) => {
                    formik.setFieldValue('operario', value.value)
                  }}
                />
              </FieldWrap>
              </Validation>
          </div>

        <div className='flex flex-col md:flex-row lg:flex-row gap-10'>
          <div className='w-full h-full flex flex-col relative -top-1'>
            <span className='text-center text-2xl'>Selecciona rango de fecha</span>
            <DateRangePicker setState={setState} state={state}/>
          </div> 
        </div>

        <div className='w-full flex items-center justify-center gap-x-10'>
          <Button
            variant='solid'
            color='emerald'
            colorIntensity='700'
            className='w-full hover:scale-105 font-semibold text-md'
            onClick={() => formik.handleSubmit()}
            >
              Generar Informe
          </Button>

          <Button
            variant='solid'
            color='red'
            colorIntensity='700'
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

export default FormularioResumenOperarioReproceso
