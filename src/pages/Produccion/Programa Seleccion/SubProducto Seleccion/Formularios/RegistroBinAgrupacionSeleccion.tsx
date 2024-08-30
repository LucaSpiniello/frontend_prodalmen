import { useEffect, useState } from 'react'
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper'
import { TPepaParaSeleccion } from '../../../../../types/TypesSeleccion.type'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchBinBodega } from '../../../../../redux/slices/bodegaSlice'
import { fetchUsuarioRegistrador } from '../../../../../redux/slices/authSlice'
import { format } from '@formkit/tempo'
import { fetchProgramaSeleccion, fetchSubProductoLista } from '../../../../../redux/slices/seleccionSlice'
import TablaSubProductoABinBodega from './TablaSubProductoABinBodega'
import TablaSubProductos from './TablaSubProductosParaAgrupar'
import Container from '../../../../../components/layouts/Container/Container'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const RegistroBinAProduccion = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const subproductos_para_agrupar = useAppSelector((state: RootState) => state.seleccion.subproductos_para_agrupar)

  const hoy = new Date()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchSubProductoLista({ token, verificar_token: verificarToken }))
  }, [])

  const kilos_totales = subproductos_para_agrupar.reduce((acc, bin) => bin.peso + acc, 0) ?? 0


  return (
    <PageWrapper title='Creación SubProducto'>
      <Container breakpoint={null} className='!p-1'>
        <Card className='h-full'>
          <CardHeader className='flex flex-col'>
            <CardTitle className=''>Crear Agrupación Bin Sub Producto </CardTitle>
            <div className='w-full flex gap-x-5 px-8'>

              <div className='w-full flex flex-col'>
                <label htmlFor="">Creado el: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>{format(hoy, { date: 'full', time: 'short'}, 'es')}</span>
                </div>
              </div>

              <div className='w-full flex flex-col'>
                <label htmlFor="">Registrado Por: </label>
                <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center justify-center h-12 rounded-md`}>
                  <span>{`${perfil?.first_name} ${perfil?.last_name}`}</span>
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
          <CardBody className='h-full flex flex-col lg:flex-row gap-1'>
            <div className='w-full'>
              <TablaSubProductos />
            </div>

            <div className='w-full'>
              <TablaSubProductoABinBodega />
            </div>

          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default RegistroBinAProduccion
