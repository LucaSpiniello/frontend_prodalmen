import { useEffect, useState } from 'react'
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchBinBodega, listaBinBodegaFiltroThunk } from '../../../../../redux/slices/bodegaSlice'
import { format } from '@formkit/tempo'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchProgramaPlantaHarina } from '../../../../../redux/slices/plantaHarinaSlice'

import TablaBinBodegaProcesoPlantaHarina from './TablaBinBodegaProcesoPlantaHarina'
import TablaBinProcesoPlantaHarina from './TablaBinPlantaHarina'
import { fetchProcesoPlantaHarina } from '../../../../../redux/slices/procesoPlantaHarina'

const RegistroBinParaProcesoPlantaHarina = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)
  const bins_para_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.bins_para_proceso_planta_harina)
  const [refresh, setRefresh] = useState<boolean>(false)

  // useEffect(() => {
  //   dispatch(fetchBinBodega({ params: { search: 'g4,g5,g6&programa=planta-harina' }, token, verificar_token: verificarToken }))
  // }, [])

  useEffect(() => {
    // dispatch(fetchBinBodega({ params: { search: !filtroBodega ? 'g1,g2' : filtroBodega }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g4,g5,g6'}))
  }, [])

  useEffect(() => {
    dispatch(fetchProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  const kilos_totales = bins_para_proceso_planta_harina.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0

  return (
    <PageWrapper title='Registro Planta Harina'>
      <Card className='h-full'>
        <CardHeader className='flex flex-col'>
          <CardTitle className=''>Agregar Fruta Proceso Planta Harina N° {id}</CardTitle>
          <div className='w-full flex gap-x-5 '>
            <div className='w-full flex flex-col'>
              <label htmlFor="">Registrado por: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{proceso_planta_harina?.creado_por_nombre}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Creado el: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{format(proceso_planta_harina?.fecha_creacion! , { date: 'short', time: 'short'}, 'es')}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Estado programa: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{proceso_planta_harina?.estado_proceso_label}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Kilos Fruta Para Programa Planta Harina: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{kilos_totales}</span>
              </div>
            </div>

          </div>
        </CardHeader>
        <CardBody className='h-full flex flex-col lg:flex-row gap-1'>
          <div className='w-full'>
            <TablaBinBodegaProcesoPlantaHarina refresh={refresh} />
          </div>

          <div className='w-full'>
            <TablaBinProcesoPlantaHarina refresh={refresh} setRefresh={setRefresh} />
          </div>

        </CardBody>
      </Card>
    </PageWrapper>
  )
}

export default RegistroBinParaProcesoPlantaHarina