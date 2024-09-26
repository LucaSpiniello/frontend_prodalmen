import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
import { RootState } from "../../../../../redux/store"
import dayjs from 'dayjs'
import { DateRange, Range } from 'react-date-range';
import { useAuth } from "../../../../../context/authContext"
import { useFormik } from "formik"
import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils"
import DateRangePicker from "../../../../../components/DateRange"
import Button from "../../../../../components/ui/Button"
import Container from "../../../../../components/layouts/Container/Container"
import Card, { CardBody, CardHeader } from "../../../../../components/ui/Card"
import Label from "../../../../../components/form/Label"
import Validation from "../../../../../components/form/Validation"
import FieldWrap from "../../../../../components/form/FieldWrap"
import SelectReact, { TSelectOptions } from "../../../../../components/form/SelectReact"
import { fetchOperarios, fetchOperariosFiltro, fetchOperariosWithSearch } from "../../../../../redux/slices/operarioSlice"
import { TOperarios } from "../../../../../types/TypesRegistros.types"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { es } from 'date-fns/locale'
import themeConfig from '../../../../../config/theme.config';
import colors from 'tailwindcss/colors';

interface IInformeProduccion {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioInformeKilosXOperario: FC<IInformeProduccion> = ({ setOpen }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchOperariosFiltro({token, verificar_token: verificarToken, skill: '?skill=seleccion,sub_prod' }))
  }, []) 

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      operario: "",
      desde: dayjs().toDate(),
      hasta: dayjs().toDate()
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')
          values.desde = dayjs(values.desde).hour(0).minute(0).second(0).millisecond(0).toDate();
        values.hasta = dayjs(values.hasta).hour(19).minute(59).second(0).millisecond(0).toDate();
        const res = await fetchWithTokenPost(`api/seleccion/pdf_kilos_por_operario/`,
          {
            ...values,
          },
          token_verificado
        )
        if (res.ok){
          const data = await res.json()
          navigate('/pro/seleccion/programa-seleccion/pdf-kilos-x-operario/', { state: { operario_resumido: data, desde: values.desde, hasta: values.hasta, pathname: pathname  }})
        }
      } catch (error) {
        console.log("Algo ocurrio")
      }
    }
  })

  return (
    <Container breakpoint={null} className="!p-0">
      <Card>
        <CardHeader className="text-2xl">Selecciona rango de fecha</CardHeader>
        <CardBody>
          <div className='flex flex-col'>
            <div className='w-full'>
              <SelectReact
                options={operarios.map((operario: TOperarios) => ({
                  value: String(operario.id),
                  label: `${operario.nombre} ${operario.apellido}`
                }))}
                id='operario'
                placeholder='Selecciona un opción'
                name='operario'
                className='h-12'
                onChange={(value: any) => { 
                  formik.setFieldValue('operario', value.value)
                }}
              />
            </div>

            <div className='w-full h-full flex flex-col'>
              {/* <DateRangePicker setState={setState} state={state}/> */}
              <DateRange
                locale={es}
                fixedHeight={true}
                className='mx-auto'
                editableDateInputs
                onChange={(item) => {
                  // setState([item.selection])
                  formik.setFieldValue('desde', item.selection.startDate)
                  formik.setFieldValue('hasta', item.selection.endDate)
                }}
                moveRangeOnFirstSelection={false}
                ranges={[{
                    startDate: formik.values.desde,
                    endDate: formik.values.hasta,
                    key: 'selection'
                  }]}
                color={colors[themeConfig.themeColor][themeConfig.themeColorShade]}
              />
            </div> 
          </div>

          <div className='w-full flex gap-x-10'>
            <Button
              variant="solid"
              color="emerald"
              colorIntensity="700"
              onClick={() => {formik.handleSubmit()}}
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

export default FormularioInformeKilosXOperario
