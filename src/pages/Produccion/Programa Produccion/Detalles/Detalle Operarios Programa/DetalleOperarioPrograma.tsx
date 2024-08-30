import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import TablaOperariosPrograma from "./TablaOperariosPrograma";
import { useAuth } from "../../../../../context/authContext";
import { fetchOperarioPrograma, fetchListaOperariosEnPrograma, fetchProgramaProduccion } from "../../../../../redux/slices/produccionSlice";
import { useParams } from "react-router-dom";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalForm from "../../../../../components/ModalForm.modal";
import FormularioRegistroOperarioPrograma from "../../Formularios/FormularioRegistroOperario";
import Button from "../../../../../components/ui/Button";
import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils";
import toast from "react-hot-toast";


interface ITablaOperariosProduccionProps {
  loading?: boolean
  refresh?: string
}

const DetalleOperarioPrograma: FC<ITablaOperariosProduccionProps> = ({ loading }) => {
  const programa_produccion = useAppSelector((state: RootState) => state.programa_produccion.programa)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { id } = useParams()
  const operarios = useAppSelector((state: RootState) => state.programa_produccion.listaOperarios)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    if (id) {
      dispatch(fetchListaOperariosEnPrograma({ id_programa: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => {
    if (id) {
      dispatch(fetchProgramaProduccion({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])


  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Operarios en Programa N°{programa_produccion?.numero_programa}</CardTitle>
          <CardHeaderChild>
            {
              (programa_produccion?.estado === '5' || !['2', '4'].includes(programa_produccion?.estado!))
                ? null
                : (
                  <>
                    <ModalForm
                      title={`Registro Operario al Programa `}
                      open={openModal}
                      setOpen={setOpenModal}
                      variant='solid'
                      color="blue"
                      colorIntensity="700"
                      width='w-full md:w-auto lg:w-auto hover:scale-105'
                      textButton={`Registrar Operarios al programa`}
                      >
                      <FormularioRegistroOperarioPrograma setOpen={setOpenModal}/>
                    </ModalForm>
                    {/* {
                      operarios.length >= 1 && programa_produccion && programa_produccion.estado === '4' &&  (
                        <Button variant="solid" color="amber" className="w-full md:w-auto lg:w-auto hover:scale-105" onClick={ async () => {
                          try {
                            const token_verificado = await verificarToken(token!)
                            if (!token_verificado)throw new Error('Token no verificado')
                            const response = await fetchWithTokenPost(`api/produccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
                            if (response.ok) {
                              toast.success('Dias Asignados')
                            } else {
                              toast.error('Error' + `${await response.json()}`)
                            }
                          } catch {
                            console.log('Error dias asignados')
                          }
                        }}>Asignar Dias</Button>
                      )
                    } */}
                  </>
                )
            }
          </CardHeaderChild>
        </CardHeader>
        
        <CardBody>
          <article className={`row-start-4 row-span-4 col-span-3 w-full h-full dark:bg-zinc-900 bg-zinc-50 flex flex-col lg:flex-col  justify-between pb-10`}>
            {
                loading
                  ? <Skeleton variant='rectangular' width='100%' height={370}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                      {
                        operarios.length >= 1
                          ? (
                            <div className={`w-full h-full  flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                              <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'>
                                <TablaOperariosPrograma programa_produccion={programa_produccion!}/>
                              </div>
                            </div>
                          )
                          : (
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay operarios ingresados en este programa</span>
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

export default DetalleOperarioPrograma
