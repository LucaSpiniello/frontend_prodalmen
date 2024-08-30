import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { format } from '@formkit/tempo'
import { TProduccion } from '../../../../../types/TypesProduccion.types'
import useDarkMode from '../../../../../hooks/useDarkMode'
import { useParams } from 'react-router-dom'
import { TControlCalidad, TRendimiento, TTarjaResultante } from '../../../../../types/TypesControlCalidad.type'
import { useAuthenticatedFetch } from '../../../../../hooks/useAuthenticatedFetch'
import { Skeleton } from '@mui/material'
import PieChart from '../../../../../components/charts/PieChart'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { fetchTarjasResultantes } from '../../../../../redux/slices/produccionSlice'
import { useAuth } from '../../../../../context/authContext'
import { fetchControlCalidad } from '../../../../../redux/slices/controlcalidadSlice'
import TablaTarjaResultanteSeleccion from './TablaTarjaResultante'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalForm from '../../../../../components/ModalForm.modal'
import FormularioRegistroTarjaSeleccion from '../../Formularios/RegistroTarjaSeleccion'
import { fetchSubProductosOperarios, fetchTarjasSeleccionadas } from '../../../../../redux/slices/seleccionSlice'


interface ITarjaResultanteProps {
  // produccion?: TProduccion | null
}

const DetalleTarjaResultanteSeleccion: FC<ITarjaResultanteProps> = () => {
  const dispatch = useAppDispatch()
  const {id} = useParams()
  const [loading, setLoading] = useState(true)
  const tarjas_bin_selecciondas = useAppSelector((state: RootState) => state.seleccion.tarjas_seleccionadas)
  const sub_productos = useAppSelector((state: RootState) => state.seleccion.sub_productos_operarios)
  const programa_seleccion =  useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const [open, setOpen] = useState<boolean>(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()


  useEffect(() => {
    dispatch(fetchTarjasSeleccionadas({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    dispatch(fetchSubProductosOperarios({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  const labels = ['Descarte Sea', 'Pepa Seleccionada', 'Whole & Broken', 'SubProducto']

  const descarteSea = Array.isArray(tarjas_bin_selecciondas) ? 
    tarjas_bin_selecciondas.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => tarja.peso + acc, 0) 
  : 0;

  const pepa_seleccionada = Array.isArray(tarjas_bin_selecciondas) ? 
    tarjas_bin_selecciondas.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => tarja.peso + acc, 0) 
  : 0;

  const wholeAndBroken = Array.isArray(tarjas_bin_selecciondas) ? 
    tarjas_bin_selecciondas.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => tarja.peso + acc, 0) 
  : 0;

  const sub_producto = Array.isArray(sub_productos) ? 
    sub_productos.filter(tarja => tarja.en_bin === true).reduce((acc, producto) => producto.peso + acc, 0)
  : 0;

  const valores: number[] = [ descarteSea, pepa_seleccionada, wholeAndBroken, sub_producto]

  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [])

  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardHeader>
          <CardTitle>Tarjas Resultantes Selección</CardTitle>          
          {
            programa_seleccion?.estado_programa === '2'
              ? (
                <ModalForm
                  title='Registro Tarja'
                  open={open}
                  setOpen={setOpen}
                  variant='solid'
                  textButton={`Registro Tarja`}
                  width='w-auto border-none rounded-md bg-blue-700 flex items-center py-3 justify-center hover:scale-105 text-white'
                  >
                    <FormularioRegistroTarjaSeleccion setOpen={setOpen}/>
                </ModalForm>
                )
              : null
          }
        </CardHeader>
        <CardBody>
          <article className={`row-start-4 row-span-4 col-span-3 w-full h-full flex flex-col lg:flex-col  justify-between pb-10 `}>
            {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={350}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                      {
                        tarjas_bin_selecciondas.length >= 1
                          ? (
                            <div className={`w-full h-full px-2 flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                              <div className='w-full lg:w-7/12 '>
                                <PieChart series={valores! || []} labels={labels! || []} labelsPosition='bottom'/>
                              </div>
                              <div className='w-full h-full flex flex-col justify-center mt-2  lg:mt-0'>
                                <TablaTarjaResultanteSeleccion />
                              </div>
                            </div>
                          )
                          : (
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay tarjas resultantes en este programa</span>
                            </div>
                          )
                      }
                    </div>
                        )
            }
          </article>
        </CardBody>
      </Card>
    </Container>

  )
}

export default DetalleTarjaResultanteSeleccion
