import { FC, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import useDarkMode from "../../../../hooks/useDarkMode";
import { useNavigate, useParams } from "react-router-dom";
import { TRendimiento } from "../../../../types/TypesControlCalidad.type";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import PieChart from "../../../../components/charts/PieChart";
import TablaEnvasesLotes from "./TablaBinsEmbalaje";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../components/ui/Card";
import Container from "../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import TablaBinsEmbalaje from "./TablaBinsEmbalaje";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../components/ui/Button";
import { fetchBinEnEmbalaje, fetchProgramaEmbalajeIndividual } from "../../../../redux/slices/embalajeSlice";


const DetalleBinEmbalaje = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const programa_embalaje = useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual)
  const bins_en_embalaje = useAppSelector((state: RootState) => state.embalaje.bin_en_programa)
  const navigate = useNavigate()
  const token = useAppSelector((state) => state.auth.authTokens)

  useEffect(() => {
    if (id){
      dispatch(fetchBinEnEmbalaje({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaEmbalajeIndividual({ id: parseInt(id!), token, verificar_token: verificarToken }))

    }
  }, [id])

  useEffect(() => {
    //@ts-ignore
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [loading])


  const labels = ['Envases Por Procesar', 'Envases procesados']
  const totalBins = bins_en_embalaje?.length
  // //@ts-ignore
  const BinsProcesados = bins_en_embalaje?.filter(bin => bin.procesado === true).length
  const envasesPorProcesar = totalBins! - BinsProcesados!;
  
  const porcentajeProcesados = ((BinsProcesados! / totalBins!) * 100)
  const porcentajePorProcesar = ((envasesPorProcesar / totalBins!) * 100)
  
  const valores = [porcentajePorProcesar, porcentajeProcesados];

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Bins a Procesar Programa Embalaje N° {id}</CardTitle>
          {
            programa_embalaje?.estado_embalaje === '5' || programa_embalaje?.estado_embalaje === '3' || programa_embalaje?.estado_embalaje !== '2'
              ? null
              : (
                <Button
                  variant='solid'
                  color="blue"
                  colorIntensity="700"
                  className="w-full md:w-auto lg:w-auto hover:scale-205"
                  onClick={() => navigate(`/emb/registro-programa-embalaje/${id}`, { state: { pathname: '/programas-embalaje' }})}
                  
                  >
                    <span>Añadir Bins al Programa de Embalaje N° {id}</span>
                </Button>
                )
          }
        </CardHeader>
        <CardBody>
          <article className={`row-start-4 row-span-4 col-span-3 w-full h-full flex flex-col lg:flex-col justify-between`}>
            {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={320}/>
                  : (
                    <div className='flex flex-col items-center justify-center md:flex-col w-full h-full'>
                      {
                        bins_en_embalaje.length >= 1
                          ? (
                            <div className={`w-full h-full px-2 dark:bg-zinc-800 bg-zinc-100 flex flex-col lg:flex-row justify-center rounded-md py-1`}>
                              <div className='w-full lg:w-7/12'>
                                <PieChart series={valores! || []} labels={labels! || []}/>
                              </div>
                              <div className='w-full flex flex-col'> 
                                <TablaBinsEmbalaje />
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

export default DetalleBinEmbalaje
