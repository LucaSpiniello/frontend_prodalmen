import { FC, useEffect, useState } from "react";
import { TRendimientoMuestra } from "../../../../../types/TypesControlCalidad.type";
import useDarkMode from "../../../../../hooks/useDarkMode";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import PieChart from "../../../../../components/charts/PieChart"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import { fetchEnvasesProduccion, fetchProgramaProduccion } from "../../../../../redux/slices/produccionSlice";
import { useAuth } from "../../../../../context/authContext";
import { fetchControlCalidad } from "../../../../../redux/slices/controlcalidadSlice";
import TablaEnvasesPrograma from "./TablaEnvasesPrograma";
import Container from "../../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../../components/ui/Button";


interface IMuestraProps {
  muestra?: TRendimientoMuestra | null
}

const DetalleEnvasesLote: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const envases_produccion = useAppSelector((state: RootState) => state.programa_produccion.lotes)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const programa_produccion =  useAppSelector((state: RootState) => state.programa_produccion.programa)
  const { pathname } = useLocation()
  const { verificarToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [loading])

  useEffect(() => {
    if (id) {
      dispatch(fetchProgramaProduccion({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  // useEffect(() => {
  //   dispatch(fetchControlCalidad({ id: parseInt(id!), token, verificar_token: verificarToken }))
  // }, [])

  useEffect(() => {
    dispatch(fetchEnvasesProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])


  const labels = ['Envases Por Procesar', 'Envases procesados']
  const totalEnvases = envases_produccion?.length;
  const envasesProcesados = envases_produccion?.filter(envase => envase.bin_procesado === true && envase.esta_eliminado !== true).length;
  const envasesPorProcesar = totalEnvases! - envasesProcesados!;
  
  const porcentajeProcesados = ((envasesProcesados! / totalEnvases!) * 100)
  const porcentajePorProcesar = ((envasesPorProcesar / totalEnvases!) * 100)
  
  const valores = [porcentajePorProcesar, porcentajeProcesados];

  return (
    <Container breakpoint={null}  className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Envases de Lotes por procesar del programa producción N° {id}</CardTitle>
          {
              programa_produccion?.estado === '5' || programa_produccion?.estado === '3' || programa_produccion?.estado !== '2'
                ? null
                : (
                  <Button
                    variant='solid'
                    color="blue"
                    colorIntensity="700"
                    className="w-full md:w-auto lg:w-auto"
                    onClick={() => navigate(`/pro/produccion/registro-programa/${id}`, { state: { pathname: pathname }})}
                    
                    >
                      <span>Añadir Lotes al Programa N° {programa_produccion.numero_programa}</span>
                  </Button>
                  )
            }
        </CardHeader>
        <CardBody>
          <article className={`w-full h-full dark:bg-zinc-800 bg-zinc-100 flex flex-col lg:flex-col justify-between`}>
            {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={320}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                      {
                        envases_produccion.length >= 1
                          ? (
                              <div className={`w-full h-full dark:bg-zinc-800 bg-zinc-100  px-2 flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                                <div className='w-full h-full lg:w-7/12'>
                                  <PieChart series={valores! || []} labels={labels! || []} labelsPosition="bottom"/>
                                </div>
                                <div className='w-full'> 
                                  <TablaEnvasesPrograma />
                                </div>
                              </div>
                            )
                          : (
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay envases ingresados en este programa</span>
                            </div>
                          )
                      }
                    </div>
              )
            }
          </article>
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetalleEnvasesLote
