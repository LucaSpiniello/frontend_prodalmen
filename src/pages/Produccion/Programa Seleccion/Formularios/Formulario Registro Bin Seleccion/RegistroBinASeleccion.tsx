import { useEffect, useState } from 'react'
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchBinBodega } from '../../../../../redux/slices/bodegaSlice'
import TablaBinBodegaSeleccion from './TablaBinBodega'
import TablaBinSeleccion from './TablaBinSeleccion'
import { format } from '@formkit/tempo'
import { fetchProgramaSeleccion } from '../../../../../redux/slices/seleccionSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const RegistroBinASeleccion = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const programa_seleccion = useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const nuevos_bin_seleccion = useAppSelector((state: RootState) => state.seleccion.nuevos_bin_seleccion)
  const [refresh, setRefresh] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchProgramaSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  const kilos_totales = nuevos_bin_seleccion.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0
  return (
    <PageWrapper title='Registro Selección'>
      <Card className='h-full'>
        <CardHeader className='flex flex-col'>
          <CardTitle className=''>Agregar Fruta al Programa de Selección N° {id}</CardTitle>
          <div className='w-full flex flex-col md:flex-row lg:flex-row gap-5 '>
            <div className='w-full flex flex-col'>
              <label htmlFor="">Registrado por: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{programa_seleccion?.registrado_por_label} | {programa_seleccion?.email_registrador}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Creado el: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{format(programa_seleccion?.fecha_creacion! , { date: 'short', time: 'short'}, 'es')}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Estado programa: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{programa_seleccion?.estado_programa_label}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Kilos Fruta En Programa Selección: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{kilos_totales}</span>
              </div>
            </div>

          </div>
        </CardHeader>
        <CardBody className='w-full h-full flex flex-col lg:flex-row gap-1'>
          <div className='w-full'>
            <TablaBinBodegaSeleccion refresh={refresh} />
          </div>

          <div className='w-full'>
            <TablaBinSeleccion refresh={refresh} setRefresh={setRefresh} />
          </div>

        </CardBody>
      </Card>
    </PageWrapper>
  )
}

export default RegistroBinASeleccion
