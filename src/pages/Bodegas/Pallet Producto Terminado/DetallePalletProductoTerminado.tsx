import React, { useEffect, useState } from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact from '../../../components/form/SelectReact'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils'
import { useFormik } from 'formik'
import Label from '../../../components/form/Label'
import { optionCalleBodega } from '../../../utils/options.constantes'
import {fetchHistoricoPallet, fetchPalletProductoTerminado } from '../../../redux/slices/embalajeSlice'
import Textarea from '../../../components/form/Textarea'
import Button from '../../../components/ui/Button'
import { format } from '@formkit/tempo'
import TablaCajasPalletProductoTerminado from './TablaCajasPalletProductoTerminado'
import Timeline, { TimelineItem } from '../../../components/Timeline'
import Alert from '../../../components/ui/Alert'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

const DetallePalletProductoTerminado = ({ id_pallet }: { id_pallet : number }) => {
  const [editar, setEditar] = useState(false)
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const historico_pallet_producto_terminado = useAppSelector((state: RootState) => state.embalaje.historico_pallet_producto_terminado)

  useEffect(() => {
    if (id_pallet){
      //@ts-ignore
      dispatch(fetchHistoricoPallet({ id: id_pallet, token, verificar_token: verificarToken  }))
    }
  }, [id_pallet])
  

  return (
    <Container breakpoint={null} className='w-full flex flex-col gap-5'>
      <Card>
          <CardBody className='h-96 overflow-scroll'>
            <Timeline>
              {
                historico_pallet_producto_terminado.map((dato) => (
                  <TimelineItem icon={
                      dato.cambio.includes('creado')
                        ? 'HeroRocketLaunch'
                        : dato.cambio.includes('agregado')
                          ?'HeroPlusCircle'
                          : dato.cambio.includes('cambió')
                            ? 'DuoLoading'
                            : dato.cambio.includes('eliminado')
                              ? 'HeroXMark'
                              : ''
                    }
                    actions={
                      dato.cambio.includes('creado')
                      ? 'animate-bounce'  
                      : dato.cambio.includes('agregado')
                        ?'animate-pulse'
                        : dato.cambio.includes('cambió')
                          ? 'animate-spin'
                          : ''
                    }
                    >
                    {
                      dato.cambio.includes('creado')
                        ? (
                          <>
                            <div>
                              {dato?.codigo_pallet} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )}
                            </div>
                            <Alert color='emerald' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                          </>
                          )
                        : dato.cambio.includes('agregado')
                          ? (
                            <>
                              <div>
                                {dato?.codigo_pallet} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )}
                              </div>
                              <Alert color='emerald' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                            </>
                            )
                          : dato.cambio.includes('cambió')
                            ? (
                              <>
                                <div>
                                  {dato?.codigo_pallet} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )}
                                </div>
                                <Alert color='lime' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                              </>
                              )
                            : dato.cambio.includes('eliminado')
                                ? (
                                  <>
                                    <div>
                                      {dato?.codigo_pallet} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )}
                                    </div>
                                    <Alert color='red' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                                  </>
                                  )
                                : null
                    }

                  </TimelineItem>
                ))
              }
            </Timeline>
          </CardBody>
        </Card>
    </Container>
  )
}

export default DetallePalletProductoTerminado
