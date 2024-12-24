import { FC, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { useAuth } from "../../../../../context/authContext";
import useDarkMode from "../../../../../hooks/useDarkMode";
import { TRendimiento } from "../../../../../types/TypesControlCalidad.type";
import { RootState } from "../../../../../redux/store";
import PieChart from "../../../../../components/charts/PieChart";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaBinsParaPlantaHarina from "./TablaBinsParaPlantaHarina";
import Button from "../../../../../components/ui/Button";
import { fetchBinEnPlantaHarina, fetchProgramaPlantaHarina } from "../../../../../redux/slices/plantaHarinaSlice";



interface IMuestraProps {
  // muestra?: TRendimientoMuestra | null
}

const DetalleBinsParaPlantaHarina: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  // const [loading, setLoading] = useState(true)
  const bins_para_planta_harina = useAppSelector((state: RootState) => state.planta_harina.bin_en_planta_harina)
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)


  // useEffect(() => {
  //   //@ts-ignore
  //   if (loading){
  //     setTimeout(() => {
  //       setLoading(false)
  //     }, 1000)
  //   }

  //   return () => {}
  // }, [loading])

  useEffect(() => {
   if (id){
     dispatch(fetchBinEnPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
     dispatch(fetchProgramaPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
   }
  }, [id])


  const labels = ['Envases procesados', 'Envases Por Procesar']
  const totalBins = bins_para_planta_harina?.length 
  const BinsProcesados = bins_para_planta_harina?.filter(bin => bin.procesado === true && bin.esta_eliminado !== true).length;
  const envasesPorProcesar = totalBins! - BinsProcesados!;
  
  const porcentajeProcesados = ((BinsProcesados! / totalBins!) * 100)
  const porcentajePorProcesar = ((envasesPorProcesar / totalBins!) * 100)
  
  const valores = [porcentajeProcesados, porcentajePorProcesar];

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Bins por procesar programa planta harina N° {id}</CardTitle>
          {
            programa_planta_harina?.estado_programa === '5' || programa_planta_harina?.estado_programa === '3' || programa_planta_harina?.estado_programa !== '2'
            ? null
            : (
              (
                <Link to={`${`/ph/ph-prog/registro-programa-planta-harina/${id}`}`} state={{ pathname: `/programa-planta-harina/${id}/` }}>
                  <Button
                    variant="solid"
                    color="blue"
                    colorIntensity="700"
                    className="hover:scale-105 text-white"
                    >
                      Añadir Bin A Programa Planta Harina
                  </Button>
                </Link>
              )
            )
          }
        </CardHeader>
        <CardBody>
        <article className={`w-full dark:bg-zinc-800 bg-zinc-100 h-full flex flex-col lg:flex-col justify-between`}>
          {/* {
              loading
                ? <Skeleton variant="rectangular" width='100%' height={320}/>
                : ( */}
                  <div className='flex flex-col md:flex-col w-full h-full'>
                    {
                      bins_para_planta_harina && bins_para_planta_harina.length >= 1
                        ? (
                          <div className={`dark:bg-zinc-800 bg-zinc-100 w-full h-full px-2  flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                            <div className='w-full'>
                              <PieChart series={valores! || []} labels={labels! || []} />
                            </div>
                            <div className='w-full h-full flex flex-col'>
                              <TablaBinsParaPlantaHarina />
                            </div>
                          </div>
                        )
                        : (
                          <div className="w-full h-40 flex items-center justify-center">
                            <span className="font-sans text-4xl text-center">No hay bins ingresados en este proceso</span>
                        </div>
                        )
                    }
                  </div>
                      {/* )
          } */}
        </article>
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetalleBinsParaPlantaHarina
