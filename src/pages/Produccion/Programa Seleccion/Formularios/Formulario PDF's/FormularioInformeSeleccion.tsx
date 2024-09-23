import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
import { RootState } from "../../../../../redux/store"
import dayjs from 'dayjs'
import { Range } from 'react-date-range';
import { useAuth } from "../../../../../context/authContext"
import { useFormik } from "formik"
import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils"
import DateRangePicker from "../../../../../components/DateRange"
import Button from "../../../../../components/ui/Button"
import Container from "../../../../../components/layouts/Container/Container"
import Card, { CardBody, CardHeader } from "../../../../../components/ui/Card"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IInformeProduccion {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioInformeSeleccion: FC<IInformeProduccion> = ({ setOpen }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().toDate(),
			endDate: undefined,
			key: 'selection',
		},
	]);


  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      desde: '',
      hasta: ''
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
        
        if (!token_verificado) throw new Error('Token no verificado')
        state[0].endDate = dayjs(state[0].endDate).hour(19).minute(59).second(0).millisecond(0).toDate();
        const res = await fetchWithTokenPost(`api/seleccion/pdf_informe_seleccion/`,
          {
            ...values,
            desde: state[0].startDate,
            hasta: state[0].endDate
          },
          token_verificado
        )
        if (res.ok){
          const data = await res.json()
          
          navigate('/pro/seleccion/programa-seleccion/pdf-informe-seleccion/', { state: { programas_seleccion: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: pathname  }})

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
        hasta: state[0].endDate
      })
    }
  }, [state])


  return (
    <Container>
      <Card>
        <CardHeader className="text-2xl">Selecciona rango de fecha</CardHeader>
        <CardBody>
          <div className='flex flex-col md:flex-row lg:flex-row'>
            <div className='w-full h-full flex flex-col'>
              <DateRangePicker setState={setState} state={state}/>
            </div> 
          </div>

          <div className='w-full flex gap-x-10'>
            <Button
              variant="solid"
              color="emerald"
              colorIntensity="700"
              onClick={() => formik.handleSubmit()}
              className='w-full hover:scale-105 font-semibold text-md'
              >
                Generar Informe
            </Button>
            <Button
              variant="solid"
              color="red"
              colorIntensity="700"
              className='w-full hover:scale-105 font-semibold text-md'
              onClick={() => setOpen(false)}
              >
                Volver
            </Button>
          </div>
        </CardBody>
      </Card>

    </Container>
  )
}

export default FormularioInformeSeleccion
