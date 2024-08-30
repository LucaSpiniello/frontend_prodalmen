import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import useDarkMode from '../../../../../hooks/useDarkMode'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import PieChart from '../../../../../components/charts/PieChart'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'

import TablaTarjaResultanteReproceso from './TablaTarjaResultante'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import Container from '../../../../../components/layouts/Container/Container'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalForm from '../../../../../components/ModalForm.modal'
import FormularioRegistroTarjaReproceso from '../../Formularios/FormularioRegistroTarjaReproceso'


interface ITarjaResultanteProps {
  // produccion?: TProduccion | null
}

const DetalleTarjaResultanteReproceso: FC<ITarjaResultanteProps> = () => {
  const [loading, setLoading] = useState(true)
  const tarjas_resultantes = useAppSelector((state: RootState) => state.reproceso.tarjas_resultantes)
  const programa_reproceso =  useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
  const bins_en_reproceso = useAppSelector((state: RootState) => state.reproceso.bins_reproceso)

  const [open, setOpen] = useState<boolean>(false)

  const labels = ['Pepa Calibrada', 'Borrel', 'Maseto', 'Pepa Huerto']

  const maseto = Array.isArray(tarjas_resultantes) ? 
  tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => tarja.peso + acc, 0) 
  : 0;

  const pepa_huerto = Array.isArray(tarjas_resultantes) ? 
    tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '4').reduce((acc, tarja) => tarja.peso + acc, 0) 
    : 0;

  const pepa_calibrada = Array.isArray(tarjas_resultantes) ? 
    tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => tarja.peso + acc, 0) 
    : 0;

  const borrel = Array.isArray(tarjas_resultantes) ? 
    tarjas_resultantes.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => tarja.peso + acc, 0) 
    : 0;

  const valores: number[] = [pepa_calibrada, borrel, maseto, pepa_huerto]

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
          <CardTitle>Tarjas Resultantes Reproceso</CardTitle>
          {
            programa_reproceso && programa_reproceso.estado === '2' && bins_en_reproceso && bins_en_reproceso.find(bin => bin.bin_procesado === true)
              ? (
                <ModalForm
                  title='Registro Tarja'
                  open={open}
                  setOpen={setOpen}
                  variant='solid'
                  color="blue"
                  colorIntensity="700"
                  textButton={`Registro Tarja`}
                  width='w-auto hover:scale-105 text-white'
                  >
                    <FormularioRegistroTarjaReproceso setOpen={setOpen}/>
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
                      tarjas_resultantes.length >= 1
                        ? (
                          <div className={`w-full h-full px-2 flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                            <div className='w-full lg:w-7/12 '>
                              <PieChart series={valores! || []} labels={labels! || []} labelsPosition='bottom'/>
                            </div>
                            <div className='w-full h-full flex flex-col justify-center mt-2  lg:mt-0'>
                              <TablaTarjaResultanteReproceso />
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

export default DetalleTarjaResultanteReproceso
