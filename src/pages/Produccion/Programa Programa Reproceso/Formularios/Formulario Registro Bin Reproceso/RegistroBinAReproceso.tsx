import { useEffect, useState } from 'react'
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { format } from '@formkit/tempo'
import { VACIAR_TABLA, fetchProgramaReproceso } from '../../../../../redux/slices/reprocesoSlice'
import { fetchBinBodega } from '../../../../../redux/slices/bodegaSlice'
import TablaBinBodegaReproceso from './TablaBinBodega'
import TablaBinReproceso from './TablaBinReproceso'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const RegistroBinAProduccionReproceso = () => {
  const { id } = useParams() 
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth?.authTokens)
  const programa_reproceso = useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
  const nuevos_bin_reproceso = useAppSelector((state: RootState) => state.reproceso.nuevos_bin_reproceso)
  const [refresh, setRefresh] = useState<boolean>(false)

  useEffect(() => {
    dispatch(VACIAR_TABLA())
  }, [])



  useEffect(() => {
    dispatch(fetchProgramaReproceso({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  const kilos_totales = nuevos_bin_reproceso.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0
  return (
    <PageWrapper title='Registro Selección'>
      <Card className='h-full'>
        <CardHeader className='flex flex-col'>
          <CardTitle className=''>Programa de Reproceso N° {id}</CardTitle>
          <div className='w-full flex flex-col md:flex-row lg:flex-row gap-x-5 gap-3'>
            <div className='w-full flex flex-col'>
              <label htmlFor="">Registrado por: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{programa_reproceso?.registrado_por_label} | {programa_reproceso?.email_registrador}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Creado el: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{format(programa_reproceso?.fecha_creacion! , { date: 'short', time: 'short'}, 'es')}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Estado programa: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{programa_reproceso?.estado_label}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Kilos Fruta En Programa Reproceso: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{kilos_totales}</span>
              </div>
            </div>

          </div>
        </CardHeader>

        <CardBody className='h-full flex flex-col lg:flex-row gap-1'>
          <div className='w-full'>
            <TablaBinBodegaReproceso refresh={refresh} />
          </div>

          <div className='w-full'>
            <TablaBinReproceso refresh={refresh} setRefresh={setRefresh} />
          </div>

        </CardBody>
      </Card>
    </PageWrapper>
  )
}

export default RegistroBinAProduccionReproceso
