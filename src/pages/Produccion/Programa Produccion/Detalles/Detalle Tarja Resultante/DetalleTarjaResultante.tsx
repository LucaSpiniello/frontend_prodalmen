import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import useDarkMode from '../../../../../hooks/useDarkMode'
import { useAuth } from '../../../../../context/authContext'
import PieChart from '../../../../../components/charts/PieChart'
import TablaTarjaResultante from './TablaTarjaResultante'
import { fetchControlCalidad } from '../../../../../redux/slices/controlcalidadSlice'
import { fetchProgramaProduccion, fetchTarjasResultantes } from '../../../../../redux/slices/produccionSlice'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalForm from '../../../../../components/ModalForm.modal'
import FormularioRegistroTarja from '../../Formularios/FormularioRegistroTarja'


const DetalleTarjaResultante = () => {
  const { isDarkTheme } = useDarkMode()
  const { id } = useParams()
  const tarjas_resultantes = useAppSelector((state: RootState) => state.programa_produccion.tarjas_resultantes)
  const programa_produccion =  useAppSelector((state: RootState) => state.programa_produccion.programa)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => { 
    dispatch(fetchTarjasResultantes({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(fetchProgramaProduccion({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => { 
    if (loading) {
      setLoading(false)
    }
  }, [loading])


  const labels = ['Pepa Borrel', 'Pepa Calibrada', 'Maseto', 'Pepa Huerto']
  const total = tarjas_resultantes.length
  const pepa_calibrada = Array.isArray(tarjas_resultantes) ? 
  (tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '3').length * 100) / total
  : 0;

  const pepa_borrel = Array.isArray(tarjas_resultantes) ? 
    (tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '1').length * 100) / total
    : 0;

  const maseto = Array.isArray(tarjas_resultantes) ? 
    (tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '2').length * 100) / total
    : 0;

  const pepa_huerto = Array.isArray(tarjas_resultantes) ? 
  (tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '4').length * 100) / total
  : 0;  

  const valores: number[] = [pepa_borrel, pepa_calibrada, maseto, pepa_huerto]

  return (
    <Container breakpoint={null} className='w-full !p-0'>
      <Card>
        <CardHeader>
          <CardTitle>Tarjas Resultantes</CardTitle>
          {
            programa_produccion && programa_produccion.estado === '2' && programa_produccion.lotes_length > '0'
              ? (
                <ModalForm
                  title='Registro Tarja'
                  open={open}
                  setOpen={setOpen}
                  variant='solid'
                  color='blue'
                  colorIntensity='700'
                  textButton={`Registro Tarja`}
                  width='w-full md:w-auto lg:w-auto hover:scale-105 text-white'
                  >
                    <FormularioRegistroTarja setOpen={setOpen} />
                </ModalForm>
                )
              : null
          }
        </CardHeader>
        <CardBody>
          <article className={`w-full dark:bg-zinc-800 bg-zinc-100 flex flex-col lg:flex-col  justify-between `}>
            {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={350}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                      {
                        tarjas_resultantes.length >= 1
                          ? (
                            <div className={`w-full h-full dark:bg-zinc-800 bg-zinc-100 px-2 flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                              <div className='w-full h-full lg:w-7/12'>
                                <PieChart series={valores ! || []} labels={labels! || []} labelsPosition='bottom'/>
                              </div>
                              <div className='w-full h-full flex flex-col justify-center mt-2  lg:mt-0'>
                                <TablaTarjaResultante />
                              </div>
                            </div>
                          )
                          : (
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay tarjas resulantes en este programa</span>
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

export default DetalleTarjaResultante
