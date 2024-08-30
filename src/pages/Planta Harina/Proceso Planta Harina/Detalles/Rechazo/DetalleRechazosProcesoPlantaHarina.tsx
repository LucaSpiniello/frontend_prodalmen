import { FC, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
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
import TablaBinsParaPlantaHarina from "./TablaRechazosProcesoPlantaHarina";
import ModalForm from "../../../../../components/ModalForm.modal";
import FormularioTipoRechazoPlantaHarina from "../../Formularios/FormularioTipoRechazoPlantaHarina";
import { fetchMetricasRechazosProcesoPlantaHarina, fetchProcesoPlantaHarina, fetchRechazosProcesoPlantaHarina } from "../../../../../redux/slices/procesoPlantaHarina";



interface IMuestraProps {
  // muestra?: TRendimientoMuestra | null
}

const DetalleRechazosProcesoPlantaHarina: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const metricas_proceso_rechazo_planta = useAppSelector((state: RootState) => state.proceso_planta_harina.metricas_proceso_rechazo_planta_harina)
  const proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)
  const rechazos_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.rechazos_proceso_planta_harina)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  useEffect(() => {
    //@ts-ignore
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [loading])

  useEffect(() => {
    if (id){
      dispatch(fetchProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchRechazosProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchMetricasRechazosProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  const labels = [...metricas_proceso_rechazo_planta.map(metricas => metricas.tipo_rechazo_display)]
  const valores = [...metricas_proceso_rechazo_planta.map(metricas => metricas.total_kilos_fruta)]
  

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Rechazos Proceso Planta Harina N° {id}</CardTitle>
          {
              proceso_planta_harina?.estado_proceso === '5'
                ? (
                  <ModalForm
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    open={openModal}
                    setOpen={setOpenModal}
                    textButton='Registrar Tipo Rechazo'
                    title='Registro Rechazo Planta Harina'
                    >
                      <FormularioTipoRechazoPlantaHarina setOpen={setOpenModal}/>
                  </ModalForm>
                )
                : null
            }
        </CardHeader>
        <CardBody>
        {/* <article className={`dark:bg-zinc-800 bg-zinc-200 w-full h-full flex flex-col lg:flex-col justify-between`}> */}
          {
            loading
              ? <Skeleton variant="rectangular" width='100%' height={320}/>
              : (
                <div className='flex flex-col md:flex-col w-full h-full '>
                  {
                    rechazos_proceso_planta_harina.length >= 1
                      ? (
                        // <div className={`w-full h-full px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md flex flex-col lg:flex-row justify-center `}>
                        //     <div className='w-8/12 flex justify-center'>
                        //       <PieChart series={valores! || []} labels={labels! || []} labelsPosition="bottom"/>
                        //     </div> 
                            <div className='w-full flex flex-col justify-center'> {/* Ajusta el margen superior y las clases de posicionamiento */}
                              <TablaBinsParaPlantaHarina />
                            </div>
                          //  </div> 
                      )
                      : (
                        <div className="w-full h-40 flex items-center justify-center">
                          <span className="font-sans text-4xl text-center">No hay rechazos en este proceso</span>
                        </div>
                      )
                  }
                </div>
                    )
            }
        {/* </article> */}
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetalleRechazosProcesoPlantaHarina
