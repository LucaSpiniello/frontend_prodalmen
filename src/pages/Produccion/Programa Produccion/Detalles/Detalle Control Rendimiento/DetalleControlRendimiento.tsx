import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchEnvasesProduccion, fetchProgramaProduccion, fetchTarjasResultantes } from '../../../../../redux/slices/produccionSlice'
import TablaRendimientoPrograma from './TablaRendimientoPrograma'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { fetchRendimientoLotes, fetchRendimientoLotesTarjas } from '../../../../../redux/slices/controlcalidadSlice'
import TablaProyeccionRecepcionado from './TablaProyectoRecepcionado'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const DetalleControlRendimiento = () => {
  const { id } = useParams()

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const lotes_en_programa = useAppSelector((state: RootState) => state.programa_produccion.lotes)
  const tarjas_resultantes = useAppSelector((state: RootState) => state.programa_produccion.tarjas_resultantes)
  const rendimiento = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)
  const cc_rendimiento_actual = useAppSelector((state: RootState) => state.control_calidad.rendimiento_tarjas_actual)
  const control_calidad = [... new Set(lotes_en_programa.map(lote => lote.control_calidad))]
  const programa_produccion = useAppSelector((state: RootState) => state.programa_produccion.programa)
  const controles_calidad = control_calidad ? control_calidad.join(',') : ''

  useEffect(() => {
    dispatch(fetchEnvasesProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchTarjasResultantes({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchRendimientoLotesTarjas({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchProgramaProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (control_calidad){
      dispatch(fetchRendimientoLotes({ id: parseInt(controles_calidad), params: { variedad: 'todas' }, token, verificar_token: verificarToken }))
    }
  }, [controles_calidad])

  const pepa_calibrada = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const pepa_borrel = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante in ['1', '2', '4']).reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const pepa_resultante = pepa_borrel! + pepa_calibrada!

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>Proyección CDC de Programa Producción N° {programa_produccion?.numero_programa}</CardTitle>
        </CardHeader>
        <CardBody>
          <article className='flex flex-col md:flex-row lg:flex-row w-full h-full gap-5'>
            <Card className='w-full bg-zinc-100'>
              <CardHeader>
                <CardTitle>Proyección de Kilos de Fruta Recepcionada</CardTitle>
              </CardHeader>
              <CardBody>
                <div className='w-full flex flex-col md:flex-row lg:flex-row items-center justify-center'>
                    <div className='w-full flex flex-col items-center justify-center'>
                      <span className='text-md font-semibold'>{rendimiento?.cc_calculo_final.kilos_brutos}</span>
                      <span>Pepa Bruta</span>
                    </div>

                    <div className='w-full flex flex-col items-center justify-center'>
                      <span className='text-md font-semibold'>{rendimiento?.cc_calculo_final.final_exp}</span>
                      <span>Pepa Exportable</span>
                    </div>
                </div>
                <TablaProyeccionRecepcionado data={rendimiento} />
              </CardBody>
            </Card>

            <Card className='w-full bg-zinc-100'>
              <CardHeader>
                <CardTitle>Rendimiento del Programa Produccion N° {id}</CardTitle>
              </CardHeader>
              <CardBody>
                  <div className='w-full flex flex-col md:flex-row lg:flex-row items-center justify-center'>
                    <div className='w-full flex flex-col items-center justify-center'>
                      <span className='text-md font-semibold'>{pepa_calibrada} kgs</span>
                      <span className='text-center'>Pepa Calibrada</span>
                    </div>

                    <div className='w-full flex flex-col items-center justify-center'>
                      <span className='text-md font-semibold'>{cc_rendimiento_actual?.pepa_resultante} kgs</span>
                      <span className='text-center'>Pepa Resultante</span>
                    </div>
                  </div>
                  <TablaRendimientoPrograma data={cc_rendimiento_actual}/>  
              </CardBody>
            </Card>
          </article>
        </CardBody>        
      </Card>
    </Container>
  )
}

export default DetalleControlRendimiento
