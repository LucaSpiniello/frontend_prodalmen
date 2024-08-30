import {  useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import PieChart from '../../../../../components/charts/PieChart'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaBinResultantePlantaHarina from './TablaBinResultantePlantaHarina'
import Button from '../../../../../components/ui/Button'
import ModalForm from '../../../../../components/ModalForm.modal'
import FormularioBinResultantePlantaHarina from '../../Formularios/FormularioBinResultantePlantaHarina'
import { fetchBinsResultantePlantaHarina, fetchProgramaPlantaHarina } from '../../../../../redux/slices/plantaHarinaSlice'
import { useAuth } from '../../../../../context/authContext'


const DetalleBinResultantePlantaHarina = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bins_resultantes = useAppSelector((state: RootState) => state.planta_harina.bins_resultantes_planta_harina)
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { id } = useParams()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => { 
    if (loading) {
      setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    if (id){
      dispatch(fetchBinsResultantePlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
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
                programa_planta_harina?.estado_programa === '2'
                  ? (
                    <ModalForm
                      title='Registro Bin Resultante'
                      open={openModal}
                      setOpen={setOpenModal}
                      variant='solid'
                      color="blue"
                      colorIntensity="700"
                      textButton={`Registro Bin Resultante`}
                      width='w-auto flex items-center justify-center hover:scale-105 text-white'
                      >
                          <FormularioBinResultantePlantaHarina setOpen={setOpenModal}/>
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
                        <div className={`dark:bg-zinc-800 bg-zinc-100 w-full h-full px-2  flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                            <div className='w-7/12'>
                            <PieChart series={valores ! || []} labels={labels! || []} labelsPosition='bottom' />
                          </div>
                        <div className='w-full h-full flex flex-col justify-center mt-2  lg:mt-0'>
                          <TablaBinResultantePlantaHarina />
                        </div>
                      </div>
                      )
                      : (
                        <div className="w-full h-40 flex items-center justify-center">
                            <span className="font-sans text-4xl text-center">No hay bins resultantes en este proceso</span>
                        </div>)

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

export default DetalleBinResultantePlantaHarina
