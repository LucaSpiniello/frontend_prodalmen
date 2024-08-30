import { FC, useEffect, useState } from "react";
import { Skeleton, Tooltip } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { useAuth } from "../../../../../context/authContext";
import useDarkMode from "../../../../../hooks/useDarkMode";
import { TRendimiento } from "../../../../../types/TypesControlCalidad.type";
import { RootState } from "../../../../../redux/store";
import PieChart from "../../../../../components/charts/PieChart";
import TablaEnvasesLotes from "./TablaEnvasesLotesSeleccion";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../../components/ui/Button";
import { fetchBinsEnReproceso, fetchProgramaReproceso } from "../../../../../redux/slices/reprocesoSlice";



interface IMuestraProps {
  // muestra?: TRendimientoMuestra | null
}

const DetalleEnvasesLote: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const bins_en_reproceso = useAppSelector((state: RootState) => state.reproceso.bins_reproceso)
  const programa_reproceso = useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const {verificarToken} = useAuth()

  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [loading])


  useEffect(() => {
    //@ts-ignore
    dispatch(fetchProgramaReproceso({ id, token, verificar_token: verificarToken }))
    dispatch(fetchBinsEnReproceso({ id, token, verificar_token: verificarToken }))
  }, [])



  const labels = ['Envases Por Procesar', 'Envases procesados']
  const totalBins = bins_en_reproceso?.length 
  //@ts-ignore
  const BinsProcesados = bins_en_reproceso?.filter(bin => bin.bin_procesado === true && bin.esta_eliminado !== true).length;
  const envasesPorProcesar = totalBins! - BinsProcesados!;
  
  const porcentajeProcesados = ((BinsProcesados! / totalBins!) * 100)
  const porcentajePorProcesar = ((envasesPorProcesar / totalBins!) * 100)
  
  const valores = [porcentajePorProcesar, porcentajeProcesados];

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Bins por Procesar del Programa de Reproceso N° {id}</CardTitle>
          {
            programa_reproceso?.estado === '2'
              ? (
                <Link to={`/pro/reproceso/registro-programa/${id}`} state={{ pathname: '/reproceso' }}>
                  <Button
                    title='Añadir Bin a Reproceso'
                    variant="solid"
                    color="blue"
                    colorIntensity="700"
                    className='w-auto text-white hover:scale-105'>
                    <span>Añadir Lote al Programa N°{id}</span>
                  </Button>
                </Link>
                )
              : null
          }
        </CardHeader>
        <CardBody>
        <article className={`row-start-4 row-span-4 col-span-3 w-full h-full flex flex-col lg:flex-col justify-between`}>
          {
              loading
                ? <Skeleton variant="rectangular" width='100%' height={320}/>
                : (
                  <div className='flex flex-col md:flex-col w-full h-full'>
                    {
                      bins_en_reproceso && bins_en_reproceso.length >= 1
                        ? (
                            <div className={`w-full h-full px-2 flex flex-col lg:flex-row rounded-md py-1`}>
                              <div className='lg:w-7/12'>
                                <PieChart series={valores! || []} labels={labels! || []} labelsPosition="bottom"/>
                              </div>
                              <div className='w-full flex flex-col'>
                                <TablaEnvasesLotes />
                              </div>
                            </div>
                          )
                        : (
                          <div className="w-full h-40 flex items-center justify-center">
                            <span className="font-sans text-4xl text-center">No hay bins ingresados en este programa</span>
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
