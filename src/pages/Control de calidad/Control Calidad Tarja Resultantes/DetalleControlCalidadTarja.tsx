import { useParams } from "react-router-dom";
import useDarkMode from "../../../hooks/useDarkMode";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { TControlCalidadTarja } from "../../../types/TypesControlCalidad.type";
import { optionsCalibres } from "../../../utils/options.constantes";
import {Skeleton } from "@mui/material";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../components/layouts/Container/Container";
import Card, { CardHeader, CardBody, CardHeaderChild, CardTitle } from "../../../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { fetchCalibracionTarjasResultantesProduccionIndividual } from "../../../redux/slices/controlcalidadSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const DetalleCCTarja = () => {
  const { isDarkTheme } = useDarkMode();
  const { id } = useParams()

  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_tarja_produccion_individual)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    if (id){
      dispatch(fetchCalibracionTarjasResultantesProduccionIndividual({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])
  

  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [loading])

  const clavesDeseadas = [
    'trozo',
    'picada',
    'hongo',
    'daño_insecto',
    'dobles',
    'goma',
    'basura',
    'mezcla_variedad',
    'pepa_sana',
    'fuera_color',
    'punto_goma',
    'vana_deshidratada',
  ];



  const totalMuestra = control_calidad?.cantidad_muestra;
  const labels: string[] = [];
  const valores: number[] = [];

  if (control_calidad){
    clavesDeseadas.forEach((key) => {
      labels.push(key); // Agregar la etiqueta
      //@ts-ignore
      valores.push(parseFloat((control_calidad[key] / totalMuestra * 100).toFixed(2))); // Calcular y agregar el valor
    });
  }

  return (
    <PageWrapper name="Detalle Control Calidad Tarja">
      <Container breakpoint={null} className="w-full h-full">
        <Card>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Detalle de Control de Calidad Tarja Resultante N° {control_calidad?.codigo_tarja}</CardTitle>
            </CardHeaderChild>
          </CardHeader>
          <CardBody>
            <article className={`row-start-2 col-span-3 w-full h-full flex md:flex-row lg:flex-row justify-between items-center gap-x-10 mx-auto`}>
              <div className='w-full md:5/12 lg:5/12 justify-between lg:h-20 flex flex-col lg:flex-row rounded-md lg:gap-x-4 gap-y-4 p-2'>
                <div className={`dark:bg-zinc-700 bg-zinc-200 w-full rounded-md h-full flex flex-col justify-center px-2`}>
                  <span className='mr-4 font-semibold'>Código Tarja: grs</span> 
                  <span className='font-semibold text-xl'>{control_calidad?.codigo_tarja}</span>
                </div>
                
                <div className={`dark:bg-zinc-700 bg-zinc-200 w-full  rounded-md h-full flex flex-col justify-center px-2`}>
                  <span className='mr-4 font-semibold'>Estado:</span> 
                  <span className='font-semibold text-xl'>{control_calidad?.estado_cc_label}</span>
                </div>

                <div className={`dark:bg-zinc-700 bg-zinc-200 w-full  rounded-md h-full flex flex-col justify-center px-2`}>
                  <span className='mr-4 font-semibold'>Calibre:</span>
                  <span className='font-semibold text-xl'>{optionsCalibres.find(calibre => calibre.value === control_calidad?.calibre)?.label}</span>
                </div>

                <div className={`dark:bg-zinc-700 bg-zinc-200 w-full  rounded-md h-full flex flex-col justify-center px-2`}>
                  <span className='mr-4'>Cantidad Muestra:</span>
                  <span className='font-semibold text-xl'>{(control_calidad?.cantidad_muestra ?? 0)} grs</span>
                </div>
              </div>
            </article>

            <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col lg:flex-col justify-between `}>
              <div className='flex flex-col gap-5 w-full'>
                {
                  loading
                    ? <Skeleton variant="rectangular" width='100%' height={200}/>
                    : (
                      <div className='flex flex-row-reverse'>
                        <div className='flex flex-col md:flex-col w-full h-full '>
                          <div className={`w-full h-full px-2 flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                            <div className='w-full lg:w-full h-full'>
                              <PieChart series={valores! || []} labels={labels! || []}/>
                            </div>
                            <div className='w-full flex flex-col justify-center mt-4 lg:mt-0'> 
                              <h1 className='text-2xl text-center mb-5'>Detalle CC Pepa Bruta</h1>
                              <div className='lg:grid lg:grid-cols-4 gap-x-5 gap-y-2'>
                                <div className='md:col-span-2'>
                                  <Label htmlFor='' className='text-center'>Trozo</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.trozo! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:col-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Picada</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.picada! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-2 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Hongo</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.hongo! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-2 md:col-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Daño Insecto</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.daño_insecto! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Dobles</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.dobles! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-3 md:col-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Vana Deshidratada</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.vana_deshidratada! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-4 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Mezcla Variedad</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.mezcla_variedad! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-4 md:col-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Fuera Color</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.fuera_color! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-5 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Goma</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.goma! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                <div className='md:row-start-5 md:col-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Punto Goma</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.punto_goma! ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>

                                <div className='md:row-start-6 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Basura</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.basura ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>

                                {control_calidad?.canuto ? 
                                <div className='md:row-start-6 md:col-start-3 md:col-span-2 '>
                                  <Label htmlFor='' className='text-center'>Canuto</Label>
                                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.canuto ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>
                                : 
                                 null
                              }


                                <div className='md:row-start-6 md:col-span-2'>
                                  <Label htmlFor='' className='text-center'>Pepa Sana</Label>
                                  <div className='flex items-center justify-center dark:bg-green-700 bg-zinc-200 py-2 px-3 rounded-md'>
                                    <span>{(control_calidad?.pepa_sana ?? 0).toFixed(1)} grs</span>
                                  </div>
                                </div>


                              </div>
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
    </PageWrapper>

  )
}

export default DetalleCCTarja
