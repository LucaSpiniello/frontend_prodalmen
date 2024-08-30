import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TablaBinBodegaSeleccion from './TablaBinBodega'
import { format } from '@formkit/tempo'
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { useAuth } from '../../../../context/authContext'
import { RootState } from '../../../../redux/store'
import { fetchBinAgrupado, fetchBinBodega, listaBinBodegaFiltroThunk } from '../../../../redux/slices/bodegaSlice'
import { fetchProgramaSeleccion } from '../../../../redux/slices/seleccionSlice'
import Container from '../../../../components/layouts/Container/Container'
import TablaBinParaAgrupar from './TablaBinAgrupado'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'

const RegistroBinAProduccion = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const bins_en_agrupacion = useAppSelector((state: RootState) => state.bodegas.bines_en_agrupacion)
  const agrupacion = useAppSelector((state: RootState) => state.bodegas.bin_agrupado)

  const bins_bodega_sin_agrupar = useAppSelector((state: RootState) => state.bodegas.bin_bodega)


  useEffect(() => {
    if (id){
      dispatch(fetchBinAgrupado({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => {
      if (agrupacion?.transferir_bodega && id){
        // dispatch(fetchBinBodega({ params: { search: `${agrupacion?.transferir_bodega.toLocaleLowerCase()}&programa=agrupacion` }, token, verificar_token: verificarToken }))
        dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: agrupacion.transferir_bodega.toLowerCase()}))
      }
  }, [agrupacion, id])


  const kilos_totales = bins_en_agrupacion.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0
  
  return (
    <PageWrapper title='Registro Agrupación'>
      <Container breakpoint={null} className='w-full h-full '>
        <Card className='h-full'>
          <CardHeader className='flex flex-col'>
            <CardTitle className='grid grid-cols-1'>Agrupación de bin N° {id} 
              <div className='col-span-12 text-center'>{agrupacion?.codigo_tarja}</div>
               </CardTitle>
            <div className='w-full flex flex-col md:flex-row lg:flex-row gap-x-5 '>
              <div className='w-full flex flex-col'>
                <label htmlFor="">Registrado por: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>{agrupacion?.registrado_por_nombre}</span>
                </div>
              </div>

              <div className='w-full flex flex-col'>
                <label htmlFor="">Creado el: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>{format(agrupacion?.fecha_creacion! , { date: 'short', time: 'short'}, 'es')}</span>
                </div>
              </div>

              <div className='w-full flex flex-col'>
                <label htmlFor="">Transferir A: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>Bodega {agrupacion?.transferir_bodega}</span>
                </div>
              </div>

              <div className='w-full flex flex-col'>
                <label htmlFor="">Código Tarja: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>{agrupacion?.codigo_tarja}</span>
                </div>
              </div>

              <div className='w-full flex flex-col'>
                <label htmlFor="">Kilos de Fruta: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>{(kilos_totales ?? 0).toLocaleString()}</span>
                </div>
              </div>

            </div>
          </CardHeader>
          <CardBody className='h-full flex flex-col lg:flex-row gap-1'>
            <div className='w-full'>
              <TablaBinBodegaSeleccion />
            </div>

            <div className='w-full'>
              <TablaBinParaAgrupar />
            </div>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default RegistroBinAProduccion
