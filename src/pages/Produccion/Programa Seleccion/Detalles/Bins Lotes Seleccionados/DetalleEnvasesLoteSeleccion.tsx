import { FC, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import useDarkMode from "../../../../../hooks/useDarkMode";
import { Link, useParams } from "react-router-dom";
import { TRendimiento } from "../../../../../types/TypesControlCalidad.type";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import { useAuth } from "../../../../../context/authContext";
import PieChart from "../../../../../components/charts/PieChart";
import TablaEnvasesLotes from "./TablaEnvasesLotesSeleccion";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../../components/ui/Button";
import { fetchBinsPepaCalibrada } from "../../../../../redux/slices/seleccionSlice";



interface IMuestraProps {
  // muestra?: TRendimientoMuestra | null
}

const DetalleEnvasesLote: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const programa_seleccion =  useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const bins_en_seleccion =  useAppSelector((state: RootState) => state.seleccion.bins_pepas_calibradas)
  const bins_calibrados = useAppSelector((state: RootState) => state.seleccion.bins_pepas_calibradas)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [loading])

  useEffect(() => {
    if(id){
      dispatch(fetchBinsPepaCalibrada({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])


  const labels = ['Envases Por Procesar', 'Envases procesados']
  const totalBins = bins_calibrados?.length;
  //@ts-ignore
  const BinsProcesados = bins_calibrados?.filter(bin => bin.bin_procesado === true && bin.esta_eliminado !== true).length;
  const envasesPorProcesar = totalBins! - BinsProcesados!;
  
  const porcentajeProcesados = ((BinsProcesados! / totalBins!) * 100)
  const porcentajePorProcesar = ((envasesPorProcesar / totalBins!) * 100)
  
  const valores = [porcentajePorProcesar, porcentajeProcesados];

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Envases de Lotes por procesar del programa N° {id}</CardTitle>
          {
            programa_seleccion?.estado_programa === '2'
              ? (
                  <Link to={`/pro/seleccion/programa-seleccion/registro-programa/${id}`} state={{ pathname: '/programa-seleccion/' }}>
                    <Button
                      title="Añadir Bin al Programa"
                      variant="solid"
                      color='blue'
                      colorIntensity="700"
                      className='hover:scale-105'>
                      <span>Añadir Bin al Programa Selección N°{id}</span>
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
                        bins_en_seleccion.length >= 1
                        ? (
                          <div className={`w-full h-full px-2 flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                            <div className='lg:w-7/12'>
                              <PieChart series={valores! || []} labels={labels! || []} labelsPosition="bottom"/>
                            </div>
                            <div className='w-full flex flex-col'> {/* Ajusta el margen superior y las clases de posicionamiento */}
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
