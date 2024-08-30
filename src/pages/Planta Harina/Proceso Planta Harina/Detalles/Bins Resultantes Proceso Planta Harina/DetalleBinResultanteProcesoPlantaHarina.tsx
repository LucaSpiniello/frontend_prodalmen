import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import useDarkMode from '../../../../../hooks/useDarkMode'
import { useAuth } from '../../../../../context/authContext'
import PieChart from '../../../../../components/charts/PieChart'
import TablaTarjaResultante from './TablaBinResultanteProcesoPlantaHarina'
import { fetchControlCalidad } from '../../../../../redux/slices/controlcalidadSlice'
import { fetchTarjasResultantes } from '../../../../../redux/slices/produccionSlice'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaBinResultantePlantaHarina from './TablaBinResultanteProcesoPlantaHarina'
import TablaBinResultanteProcesoPlantaHarina from './TablaBinResultanteProcesoPlantaHarina'
import ModalForm from '../../../../../components/ModalForm.modal'
import FormularioBinResultanteProcesoPlantaHarina from '../../Formularios/FormularioBinResultanteProcesoPlantaHarina'
import { fetchBinEnProcesoPlantaHarina, fetchBinsResultanteProcesoPlantaHarina, fetchProcesoPlantaHarina } from '../../../../../redux/slices/procesoPlantaHarina'


const DetalleBinResultanteProcesoPlantaHarina = () => {
  const { id } = useParams()
  const bins_resultantes = useAppSelector((state: RootState) => state.proceso_planta_harina.bins_resultantes_proceso_planta_harina)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const bins_para_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.bin_en_proceso_planta_harina)

  useEffect(() => { 
    if (loading) {
      setLoading(false)
    }
  }, [loading])
  
  useEffect(() => {
    if (id){
      dispatch(fetchProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchBinsResultanteProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchBinEnProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
   }, [id])

  const labels = ['Bins Sin Calibrar', 'Bins Calibrados']
  const bins_calibrados= Array.isArray(bins_resultantes) ? 
    (bins_resultantes.filter(tarja => tarja.cc_tarja === true).reduce((acc, tarja) => tarja.peso + acc, 0) / bins_resultantes.length) * 100
    : 0;

  const bins_sin_calibrar = Array.isArray(bins_resultantes) ? 
    (bins_resultantes.filter(tarja => tarja.cc_tarja !== true).reduce((acc, tarja) => tarja.peso + acc, 0) / bins_resultantes.length) * 100
      : 0;


  const valores: number[] = [bins_sin_calibrar, bins_calibrados]

  return (
    <Container breakpoint={null} className='w-full !p-0'>
      <Card>
        <CardHeader>
          <CardTitle>Bins Resultantes Planta Harina</CardTitle>
          {
            proceso_planta_harina?.estado_proceso === '2' && bins_para_proceso_planta_harina && bins_para_proceso_planta_harina.find(bin => bin.procesado)
              ? (
                <ModalForm
                  title='Registro Bin Resultante Proceso'
                  open={openModal}
                  setOpen={setOpenModal}
                  variant='solid'
                  color="blue"
                  colorIntensity="700"
                  textButton={`Registro Bin Resultante Proceso`}
                  width='hover:scale-105 text-white'
                  size={900}
                  >
                    <FormularioBinResultanteProcesoPlantaHarina setOpen={setOpenModal} />
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
                        bins_resultantes.length >= 1
                          ? (
                            <div className={`w-full h-full px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                              <div className='w-7/12 flex items-center justify-center'>
                                <PieChart series={valores ! || []} labels={labels! || []} labelsPosition='bottom'/>
                               
                              </div>
                              <div className='w-full h-full flex flex-col justify-center mt-2  lg:mt-0'>
                                <TablaBinResultanteProcesoPlantaHarina />
                              </div>
                            </div>
                            )
                          : (
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay bins resultantes en este proceso</span>
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

export default DetalleBinResultanteProcesoPlantaHarina
