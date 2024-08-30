import { FC, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import useDarkMode from "../../../../../hooks/useDarkMode";
import { useParams } from "react-router-dom";
import { TRendimiento } from "../../../../../types/TypesControlCalidad.type";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import { useAuth } from "../../../../../context/authContext";
import PieChart from "../../../../../components/charts/PieChart";
import TablaEnvasesLotes from "./TablaSubProductoOperario";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import TablaSubProductoOperario from "./TablaSubProductoOperario";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalForm from "../../../../../components/ModalForm.modal";
import FormularioRegistroSubProducto from "../../Formularios/RegistroSubProducto";
import { fetchMetricasSubproducto, fetchSubProductosOperarios } from "../../../../../redux/slices/seleccionSlice";



interface IMuestraProps {
  // muestra?: TRendimientoMuestra | null
}

const DetalleSubProductoOperario: FC<IMuestraProps> = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<boolean>(false)
  const subproductos = useAppSelector((state: RootState) => state.seleccion.sub_productos_operarios)
  const programa_seleccion =  useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const metricas = useAppSelector((state: RootState) => state.seleccion.subproducto_metricas)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchMetricasSubproducto({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [subproductos])

  useEffect(() => {
    if (!open) {
      dispatch(fetchSubProductosOperarios({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [open])


  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return () => {}
  }, [loading])


  const labels = metricas?.map(registro => registro.nombre)
  const valores = metricas?.map(registro => registro.total_kilos)

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>SubProductos del programa N° {id}</CardTitle>
          {
							programa_seleccion?.estado_programa === '2'
								? (
									<ModalForm
											variant='solid'
											open={open}
											setOpen={setOpen}
                      color="blue"
                      colorIntensity="700"
											textButton={`Registrar SubProducto`}
											title='Registrar SubProducto de Operario'
											size={900}
											modalAction={true}
                      isAnimation={false}
										>
											<FormularioRegistroSubProducto setOpen={setOpen}/>
											
									</ModalForm>
											)
								: null
						}
        </CardHeader>
        <CardBody>
          <article className={`row-start-4 row-span-4 col-span-3 w-full h-full flex flex-col lg:flex-col justify-between `}>
            {
                loading
                  ? <Skeleton variant="rectangular" width='100%' height={320}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                      {
                        subproductos.length >= 1
                          ? (
                            <div className={`w-full h-full px-2 dark:bg-inherit bg-white flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                              <div className='w-7/12 '>
                                <PieChart series={valores! || []} labels={labels! || []}/>
                              </div>
                              <div className='w-full flex flex-col'>
                                <TablaSubProductoOperario />
                              </div>
                            </div>
                          ) 
                          : (    
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay subproductos agregados en este programa</span>
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

export default DetalleSubProductoOperario
