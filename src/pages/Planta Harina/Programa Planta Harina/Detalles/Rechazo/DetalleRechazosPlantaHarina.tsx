import { FC, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { useAuth } from "../../../../../context/authContext";
import useDarkMode from "../../../../../hooks/useDarkMode";
import { TRendimiento } from "../../../../../types/TypesControlCalidad.type";
import { RootState } from "../../../../../redux/store";
import PieChart from "../../../../../components/charts/PieChart";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaRechazosPlantaHarina from "./TablaRechazosPlantaHarina";
import ModalForm from "../../../../../components/ModalForm.modal";
import FormularioTipoRechazoPlantaHarina from "../../Formularios/FormularioTipoRechazoPlantaHarina";
import { fetchMetricasRechazosPlantaHarina, fetchProgramaPlantaHarina, fetchRechazosPlantaHarina } from "../../../../../redux/slices/plantaHarinaSlice";



interface IMuestraProps {
  // muestra?: TRendimientoMuestra | null
}

const DetalleRechazosPlantaHarina: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const metricas_rechazo_planta = useAppSelector((state: RootState) => state.planta_harina.metricas_rechazo_planta_harina)
  const rechazos_planta_harina = useAppSelector((state: RootState) => state.planta_harina.rechazos_planta_harina)
  const programa = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const [openModal, setOpenModal] = useState<boolean>(false)
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
      dispatch(fetchRechazosPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchMetricasRechazosPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  const labels = [...metricas_rechazo_planta.map(metricas => metricas.tipo_rechazo_display)]
  const valores = [...metricas_rechazo_planta.map(metricas => metricas.total_kilos_rechazo)]
  

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Rechazos programa planta harina N° {id}</CardTitle>
          <CardHeaderChild>
            {
              programa?.estado_programa === '5'
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
          </CardHeaderChild>
        </CardHeader>
          
        <CardBody>
        
        <article className={`dark:bg-zinc-800 bg-zinc-100 w-full h-full flex flex-col lg:flex-col justify-between`}>
          {
              loading
                ? <Skeleton variant="rectangular" width='100%' height={320}/>
                : (
                  <div className='flex flex-col md:flex-col w-full h-full'>
                    {
                      rechazos_planta_harina.length >= 1
                        ? (
                          <div className={`w-full h-full px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md flex flex-col lg:flex-row justify-center `}>
                            {/* <div className='w-7/12 flex justify-center items-center'>
                              <PieChart series={valores! || []} labels={labels! || []} labelsPosition="bottom"/>
                            </div> */}
                            <div className='w-full flex flex-col justify-center'> {/* Ajusta el margen superior y las clases de posicionamiento */}
                              <TablaRechazosPlantaHarina />
                            </div>
                          </div>
                        )
                        :  (
                          <div className="w-full h-40 flex items-center justify-center">
                            <span className="font-sans text-4xl text-center">No hay rechazos registrados en este proceso</span>
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

export default DetalleRechazosPlantaHarina
