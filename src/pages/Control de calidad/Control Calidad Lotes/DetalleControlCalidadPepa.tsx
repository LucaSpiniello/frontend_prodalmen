import { useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch';
import { TControlCalidad, TPepaMuestra, TRendimientoMuestra } from '../../../types/TypesControlCalidad.type';
import { TGuia } from '../../../types/TypesRecepcionMP.types';
import { useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../utils/urlToNumer';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { fetchControlCalidad, fetchMuestraControlDeCalidad, fetchMuestrasCalibradasControlDeCalidad, fetchMuestrasCalibradasControlDeCalidadDetalle } from '../../../redux/slices/controlcalidadSlice';
import { fetchGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const DetalleCCPepa = () => {
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)
  const muestra = useAppSelector((state: RootState) => state.control_calidad.cc_muestra_individual)
  const cc_rendimiento = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_muestras_detalle)
  const [CCRendimientoC, setCCRendimientoC] = useState<TPepaMuestra | undefined>()

  useEffect(() => {
    dispatch(fetchControlCalidad({ id: id[0], token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    dispatch(fetchGuiaRecepcion({ id: control_calidad?.guia_recepcion, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    dispatch(fetchMuestraControlDeCalidad({ id: id[0], params: { id_muestra: id[1] }, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    dispatch(fetchMuestrasCalibradasControlDeCalidadDetalle({ id: id[0], params: { id_muestra: id[1] }, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (muestra?.cc_calibrespepaok) {
      setCCRendimientoC(control_calidad?.control_rendimiento.find(lote => lote.cc_rendimiento.cc_calibrespepaok == true)?.cc_rendimiento)
    }
  }, [muestra])

  return (
    <Container>
      <Card>
        <CardHeader>
          <div className={`w-full col-span-3 h-20 flex items-center justify-center rounded-md`}>
            <h1 className='text-3xl'>Detalle Muestra N° {muestra?.id} para el Lote N° { control_calidad?.numero_lote }</h1>
          </div>
        </CardHeader>
        <CardBody className='flex flex-col gap-y-5'>
          <article className={`row-start-2 col-span-3 w-full h-full flex flex-col md:flex-row lg:flex-row justify-between items-center gap-x-10 mx-auto`}>
            <div className='w-full md:5/12 lg:5/12 justify-between h-full flex flex-col md:flex-row lg:flex-row rounded-md gap-4'>
              <div className={`dark:bg-zinc-700 bg-zinc-100 w-full rounded-md h-full flex flex-col justify-center p-2`}>
                <span className='mr-4 font-semibold'>Muestra Registrada por:</span> 
                <span className='font-semibold text-xl '>{perfil?.first_name} | {perfil?.email}</span>
              </div>
              <div className={`dark:bg-zinc-700 bg-zinc-100 w-full rounded-md h-full flex flex-col justify-center p-2`}>
                <span className='mr-4'>Muestra del lote:</span> 
                <span className='font-semibold text-xl'>N° {control_calidad?.numero_lote}</span>
              </div>
              <div className={`dark:bg-zinc-700 bg-zinc-100 w-full  rounded-md h-full flex flex-col justify-center p-2`}>
                <span className='mr-4'>Peso Total de Muestra:</span>
                <span className='font-semibold text-xl'>{muestra?.peso_muestra.toFixed(1)} grs</span>
              </div>
            </div>
          </article>

          <article className={`row-start-4 row-span-5 col-span-3 w-full h-full flex flex-col justify-between `}>
            <div className='flex flex-col gap-5 w-full'>

              <div className={`w-full h-full border dark:border-zinc-700 border-zinc-200 p-3 flex flex-col rounded-md`}>

                <span className='text-xl h-12'>Información Muestra</span>
                <div className='w-full flex flex-col md:flex-row lg:flex-row gap-2'>
                  
                  <div className='w-full h-full flex flex-col '>
                    <label htmlFor="rut_productor">Basura: </label>
                    <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{muestra?.basura} = {`${(muestra?.basura! / muestra?.peso_muestra! * 100).toFixed(2)} %`} </span>
                    </div>
                  </div>
                  
                  <div className='w-full h-full'>
                    <label htmlFor="rut_productor">Pelón: </label>
                    <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{muestra?.pelon} = {`${(muestra?.pelon! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                    </div>
                  </div>

                  <div className='w-full h-full'>
                    <label htmlFor="rut_productor">Ciega: </label>
                    <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{muestra?.ciega} = {`${(muestra?.ciega! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                    </div>
                  </div>
                </div>

                <div className='w-full flex gap-2'>
                  
                  <div className='w-full h-full flex flex-col '>
                    <label htmlFor="rut_productor">Cascara: </label>
                    <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{muestra?.cascara} = {`${(muestra?.cascara! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                    </div>
                  </div>
                  
                  <div className='w-full h-full'>
                    <label htmlFor="rut_productor">Pepa Huerto: </label>
                    <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{muestra?.pepa_huerto} = {`${(muestra?.pepa_huerto! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                    </div>
                  </div>

                </div>
              </div>

              <div className={`w-full h-full border dark:border-zinc-700 rounded-md p-4 flex flex-col gap-y-2`}>

                <div className='flex flex-col md:flex-row lg:flex-row justify-between items-center'>
                  <span className='text-xl h-12 w-full '>Control de Pepa</span>
                  <div className='w-full h-20 flex flex-col '>
                    <label htmlFor="rut_productor">Pepa Bruta: </label>
                    <div className={`bg-green-700 text-white p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{muestra?.pepa} grs</span>
                    </div>
                  </div>
                </div>
                {
                  muestra?.cc_ok === true
                    ? (
                      <>
                      <div className='w-full flex flex-col md:flex-row lg:flex-row gap-2'>
        
                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Mezcla variedades: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.muestra_variedad} = {`${(muestra.cc_rendimiento?.muestra_variedad! / muestra?.pepa! * 100).toFixed(2)} %`} </span>
                          </div>
                        </div>
                        
                        <div className='w-full h-full'>
                          <label htmlFor="rut_productor">Daño Insecto: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.daño_insecto} = {`${(muestra.cc_rendimiento?.daño_insecto! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full'>
                          <label htmlFor="rut_productor">Hongo: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.hongo} = {`${(muestra.cc_rendimiento?.hongo! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Dobles: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.doble} = {`${(muestra.cc_rendimiento?.doble! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>
                      </div>

                      <div className='w-full flex flex-col md:flex-row lg:flex-row gap-2'>
                        
                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Color: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.fuera_color} = {`${(muestra.cc_rendimiento?.fuera_color! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Vana Deshidratada: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.vana_deshidratada} = {`${(muestra.cc_rendimiento?.vana_deshidratada! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Punto Goma: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.punto_goma} = {`${(muestra.cc_rendimiento?.punto_goma! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>
                        
                        <div className='w-full h-full'>
                          <label htmlFor="rut_productor">Goma: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{muestra.cc_rendimiento?.goma} = {`${(muestra.cc_rendimiento?.goma! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                    </div>
                      </>
                    )
                    : <span className='text-2xl text-center'>{muestra?.cc_ok!}</span>
                }
              </div>

              <div className={`w-full h-full border dark:border-zinc-700 rounded-md flex flex-col p-4 gap-y-5`}>

                <div className='flex flex-col md:flex-row lg:flex-row justify-between w-full items-center'>
                  <span className='text-xl h-12 w-full '>Calibres de Pepa Sana</span>
                  <div className='w-full h-20 flex flex-col '>
                    <label htmlFor="rut_productor">Pepa Sana: </label>
                    <div className={`bg-green-700 text-white p-2 flex items-center h-12 rounded-md`}>
                      <span className='text-xl'>{(muestra?.cc_rendimiento?.peso_muestra_calibre)?.toFixed(2)} grs</span>
                    </div>
                  </div>
                </div>
                {
                  muestra?.cc_calibrespepaok === true
                    ? (
                      <>
                      <div className='w-full flex flex-col md:flex-row lg:flex-row gap-2'>
        
                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Pre Calibre: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.pre_calibre} = {`${(CCRendimientoC?.pre_calibre! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`} </span>
                          </div>
                        </div>
                        
                        <div className='w-full h-full'>
                          <label htmlFor="rut_productor">Calibre 18/20: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_18_20} = {`${(CCRendimientoC?.calibre_18_20! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full'>
                          <label htmlFor="rut_productor">Calibre 20/22: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_20_22} = {`${(CCRendimientoC?.calibre_20_22! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>  
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 23/25: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_23_25} = {`${(CCRendimientoC?.calibre_23_25! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>
                      </div>

                      <div className='w-full flex flex-col md:flex-row lg:flex-row gap-2'>
                        
                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 25/27: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_25_27} = {`${(CCRendimientoC?.calibre_25_27! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 27/30: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_27_30} = {`${(CCRendimientoC?.calibre_27_30! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 30/32: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_30_32} = {`${(CCRendimientoC?.calibre_30_32! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>
                        
                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 32/34: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_32_34} = {`${(CCRendimientoC?.calibre_32_34! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                    </div>

                    <div className='w-full flex flex-col md:flex-row lg:flex-row gap-2'>

                        <div className='w-full h-full'>
                          <label htmlFor="rut_productor">Calibre 34/36: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_34_36} = {`${(CCRendimientoC?.calibre_34_36! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>
                        
                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 36/40: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_36_40} = {`${(CCRendimientoC?.calibre_36_40! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 40/Más: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_40_mas} = {`${(CCRendimientoC?.calibre_40_mas! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div>

                        {/* <div className='w-full h-full flex flex-col '>
                          <label htmlFor="rut_productor">Calibre 30/32: </label>
                          <div className={`dark:bg-zinc-700 bg-zinc-100 p-2 flex items-center h-12 rounded-md`}>
                            <span className='text-xl'>{CCRendimientoC?.calibre_30_32} = {`${(CCRendimientoC?.calibre_30_32! / CCRendimientoC?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                          </div>
                        </div> */}
                        
                      
                    </div>
                      </>
                    )
                    : <span className='text-2xl text-center'>Aun no se ha creado la muestra de pepa</span>
                }
              </div>
              
            </div>
          </article>
        </CardBody>
      </Card>
    </Container> 
  )
}

export default DetalleCCPepa
