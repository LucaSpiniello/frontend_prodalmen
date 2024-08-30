import { useParams } from "react-router-dom";
import useDarkMode from "../../../hooks/useDarkMode";
import { useEffect, useState } from "react";
import { TControlCalidad, TRendimiento } from "../../../types/TypesControlCalidad.type";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { chartData } from "../../../utils/generalUtil";
import { CardHeader, Skeleton } from "@mui/material";
import PieChart from "../../../components/charts/PieChart";
import TablaMuestrasDetalle from "./Tablas/TablaMuestrasDetalle";
import TablaMuestrasDetallePepa from "./Tablas/TablaCCPepa/TablaCCPepa";
import TablaDetalleDescuento from "./Tablas/TablaDetalleDescuento/TablaDetalleDescuento";
import TablaCCalibrePepa from "./Tablas/TablaCCalibrePepa/TablaCCalibre";
import { useAuth } from "../../../context/authContext";
import { fetchControlCalidad, fetchMuestrasControlCalidad, fetchRendimientoLotes } from "../../../redux/slices/controlcalidadSlice";
import Container from "../../../components/layouts/Container/Container";
import Card, { CardBody, CardTitle } from "../../../components/ui/Card";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const DetalleCCRendimiento = () => {
  const { id } = useParams()
  const usuario = useAppSelector((state: RootState) => state.auth.dataUser)
  const rendimiento_lotes = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
		dispatch(fetchMuestrasControlCalidad({ id: parseInt(id!), token, verificar_token: verificarToken }))
	}, [])

  useEffect(() => {
    if (control_calidad){
      dispatch(fetchRendimientoLotes({ id: control_calidad.recepcionmp, params: { variedad: 'todas' } , token, verificar_token: verificarToken }))
    }
	}, [control_calidad])

  useEffect(() => {
    dispatch(fetchControlCalidad({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [loading])

  const { labels, valores } = chartData(rendimiento_lotes?.cc_muestra || [])
  const { labels: labels_cc_pepa, valores: valores_cc_pepa } = chartData(rendimiento_lotes?.cc_pepa || [])
  const { labels: labels_cc_calibre, valores: valores_cc_calibre } = chartData(rendimiento_lotes?.cc_pepa_calibre || [])

  return (
    <Container breakpoint={null} className="w-full h-full">
      <Card>
        <CardHeader>
          <CardTitle>Control de rendimiento para el Lote N° {control_calidad?.numero_lote}</CardTitle>
        </CardHeader>
        <CardBody>
          <article className={`flex md:flex-row lg:flex-row mb-5 justify-between mx-auto`}>
            <div className='w-full md:5/12 lg:5/12 justify-between flex flex-col lg:flex-row rounded-md lg:gap-x-4 gap-y-4'>
              <div className={`w-full flex flex-col dark:bg-zinc-800 bg-zinc-100 rounded-md justify-center p-2`}>
                <span className='font-semibold'>Muestra Registrada por:</span> 
                <span className='font-semibold text-xl'>{control_calidad?.email_registrador} | {control_calidad?.registrado_por_label}</span>
              </div>
              
              <div className={`dark:bg-zinc-800 bg-zinc-100  w-full  rounded-md h-full flex flex-col justify-center px-2`}>
                <span>Muestra del lote:</span> 
                <span className='font-semibold text-xl'>N° {control_calidad?.numero_lote}</span>
              </div>
              <div className={`dark:bg-zinc-800 bg-zinc-100 w-full  rounded-md h-full flex flex-col justify-center px-2`}>
                <span>Peso Total de Muestra:</span>
                <span className='font-semibold text-xl'>{(control_calidad?.control_rendimiento[0]?.peso_muestra ?? 0).toFixed(2)} grs</span>
              </div>
            </div>
          </article>

          <article className={`w-full h-full flex flex-col dark:bg-zinc-900 bg-zinc-100 justify-between `}>
            <div className='flex flex-col gap-5 w-full'>
              {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={200}/>
                  : (
                    <div className='w-full h-full flex flex-col md:flex-col
                      lg:flex-row dark:bg-zinc-800 rounded-md
                      border'>
                      <div className='w-full lg:w-7/12 gap-5'>
                        <PieChart series={valores! || []} labels={labels! || []} labelsPosition="bottom"/> {/* Primer Grafico de torta arriba izq */}
                      </div>
                      <div className='w-full flex flex-col'> {/* Ajusta el margen superior y las clases de posicionamiento */}
                        <TablaMuestrasDetalle />
                      </div>
                    </div>
                        )
              }
              
              {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={200}/>
                  : (
                    <div className='w-full flex flex-col h-full '>
                      <div className={`w-full h-full border dark:border-zinc-700  px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                        <div className='w-full lg:w-7/12 relative lg:-top-2 gap-5'>
                          <PieChart series={valores_cc_pepa || []} labels={labels_cc_pepa || []} labelsPosition="bottom"/> {/* Segundo Grafico de torta abajo izq */}
                        </div>
                        <div className='w-full flex flex-col justify-center '>
                          <TablaMuestrasDetallePepa />
                        </div>
                      </div>
                    </div>
                    )
              }
              
              {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={400}/>
                  : (
                      <div className='flex flex-col h-full'>
                        <h1 className='text-3xl text-center text-gray-700'>Control de Calidad Calibres Pepa</h1>
                        <div className={`w-full h-full border dark:border-zinc-700 px-2 flex flex-col items-center justify-center rounded-md py-2 gap-y-5`}>
                          <div className='w-full h-full flex flex-col lg:flex-row gap-y-10 py-10'>
                            <div className='w-full h-full flex flex-col items-center overflow-x-auto'>
                              <h1 className='text-2xl'>Calculo Descuento</h1>
                              <TablaDetalleDescuento ccLote={control_calidad}/>
                            </div>
                          </div>
                          <div className='w-full h-full flex flex-col md:flex-col lg:flex-row gap-y-5'>
                            <div className='lg:w-6/12 flex flex-col gap-5'>
                              <PieChart series={valores_cc_calibre || []} labels={labels_cc_calibre || []} labelsPosition="bottom"/>
                            </div>
                            <div className='flex flex-col overflow-hidden'>
                              <h1 className='text-2xl text-center'>Detalle Calibres Pepa</h1>
                              <TablaCCalibrePepa ccLote={control_calidad}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
              }
            </div>
          </article>
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetalleCCRendimiento