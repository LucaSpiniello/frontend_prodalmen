import { useEffect, useState } from 'react'
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { fetchBinBodega } from '../../../../redux/slices/bodegaSlice'
import TablaBinBodegaSeleccion from './TablaBinBodegaEmbalaje'
import TablaBinEmbalaje from './TablaBinEmbalaje'
import { format } from '@formkit/tempo'
import { fetchProgramaEmbalajeIndividual } from '../../../../redux/slices/embalajeSlice'
import TablaBinBodegaEmbalaje from './TablaBinBodegaEmbalaje'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const RegistroBinAProduccion = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const programa_embalaje = useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual)
  const nuevos_bin_para_embalar = useAppSelector((state: RootState) => state.embalaje.nuevos_bin_para_embalar)
  const [refresh, setRefresh] = useState<boolean>(false)

  // useEffect(() => {
  //   dispatch(fetchBinBodega({ params: { search: 'g1,g2,g3,g4,g5,g6,g7&programa=embalaje' }, token, verificar_token: verificarToken }))
  // }, [])

  useEffect(() => {
    dispatch(fetchProgramaEmbalajeIndividual({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  const kilos_totales = nuevos_bin_para_embalar.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0
  return (
    <PageWrapper title='Registro Programa Embalaje'>
      <Card className='h-full'>
        <CardHeader className='flex flex-col'>
          <CardTitle className=''>Agregar Fruta Programa de Embalaje N° {id}</CardTitle>
          <div className='w-full flex flex-col md:flex-row lg:flex-row gap-5 '>
            <div className='w-full flex flex-col'>
              <label htmlFor="">Registrado por: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{programa_embalaje?.solicitado_por}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Creado el: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{format(programa_embalaje?.fecha_creacion! , { date: 'short', time: 'short'}, 'es')}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Estado programa: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{programa_embalaje?.estado_embalaje_label}</span>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor="">Kilos Fruta En Programa Embalaje: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                <span>{kilos_totales}</span>
              </div>
            </div>

          </div>
        </CardHeader>
        <CardBody className='h-full flex flex-col lg:flex-row gap-1'>
          <div className='w-full'>
            <TablaBinBodegaEmbalaje refresh={refresh} />
          </div>

          <div className='w-full'>
            <TablaBinEmbalaje refresh={refresh} setRefresh={setRefresh} />
          </div>

        </CardBody>
      </Card>
    </PageWrapper>
  )
}

export default RegistroBinAProduccion
