import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import TablaBinFrutaCalibrada from './TablaBinFrutaCalibrada'
import TablaBinFrutaResultante from './TablaBinFrutaResultante'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { useAuth } from '../../../../../context/authContext'
import { RootState } from '../../../../../redux/store'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRendimientoSeleccion } from '../../../../../redux/slices/seleccionSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const DetalleProyeccionSelecccion = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const detalle_rendimiento = useAppSelector((state: RootState) => state.seleccion.detalle_rendimiento)


  
  useEffect(() => {
    //@ts-ignore
    dispatch(fetchRendimientoSeleccion({ id, token, verificar_token: verificarToken }))
  }, [])


  return (
    <PageWrapper>
      <Container breakpoint={null} className='w-full h-full '>
        <Card>
          <CardHeader>
            <CardTitle className='text-3xl'>Detalle Proyección Rendimiento Selección</CardTitle>
          </CardHeader>
          <CardBody className='flex flex-col gap-y-10'>
            <article className='flex flex-col md:flex-row lg:flex-row gap-5'>
              <Card className='w-full border dark:border-zinc-700 h-full'>
                <CardHeader><CardTitle>Bins Fruta Calibrada</CardTitle></CardHeader>
                <CardBody className='flex flex-col gap-5'>

                  <div className='flex justify-between'>
                    <span>Fruta Calibrada Resultante: </span>
                    <span>{(detalle_rendimiento?.bin_fruta_calibrada_rendimiento.fruta_resultante ?? 0).toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Pepa Sana Proyectada por CC:	</span>
                    <span>{(detalle_rendimiento?.bin_fruta_calibrada_rendimiento.pepa_sana_proyectada ?? 0).toLocaleString()}</span>
                  </div>

                </CardBody>
              </Card>

              <Card className='w-full border dark:border-zinc-700'>
                <CardHeader><CardTitle>Resultado Programa Selección</CardTitle></CardHeader>
                <CardBody className='flex flex-col gap-y-5'>
                  <div className='flex justify-between'>
                    <span>Porcentaje Proyectado en Producción: </span>
                    <span>{(detalle_rendimiento?.porcentaje_proyeccion_entrante ?? 0).toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Pocentaje Proyectado en Selección:	</span>
                    <span>{(detalle_rendimiento?.porcentaje_proyeccion_saliente ?? 0).toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Diferencia:	</span>
                    <span>{(detalle_rendimiento?.diferencia ?? 0).toLocaleString()}</span>
                  </div>

                </CardBody>
              </Card>

              <Card className='w-full border dark:border-zinc-700 h-full'>
                <CardHeader><CardTitle>Bins Fruta Resultante</CardTitle></CardHeader>
                <CardBody className='flex flex-col gap-y-5'>

                  <div className='flex justify-between'>
                    <span>Fruta Calibrada Resultante: </span>
                    <span>{(detalle_rendimiento?.bin_fruta_resultante_rendimiento.fruta_resultante ?? 0).toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Pepa Sana Proyectada por CC:	</span>
                    <span>{(detalle_rendimiento?.bin_fruta_resultante_rendimiento.pepa_sana_proyectada ?? 0).toLocaleString()}</span>
                  </div>

                </CardBody>
              </Card>
              
            </article>

            <article className='flex flex-col md:flex-row lg:flex-row gap-5'>
              <Card className='w-full border dark:border-zinc-700 h-full'>
                <TablaBinFrutaCalibrada />
              </Card>

              <Card className='w-full border dark:border-zinc-700 h-full'>
                <TablaBinFrutaResultante />
              </Card>

            </article>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default DetalleProyeccionSelecccion 