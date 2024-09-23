import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import { useAuth } from "../../../../../context/authContext";
import { useParams } from "react-router-dom";
import TablaOperariosSeleccion from "./TablaOperariosSeleccion";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalForm from "../../../../../components/ModalForm.modal";
import FormularioRegistroOperarioSeleccion from "../../Formularios/FormularioRegistroOperarioSeleccion";
import { fetchOperariosEnSeleccion, fetchProgramaSeleccion } from "../../../../../redux/slices/seleccionSlice";
import Button from "../../../../../components/ui/Button";
import toast from "react-hot-toast";
import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils";


interface ITablaOperariosProduccionProps {
  loading?: boolean
  refresh?: string
}

const DetalleOperarioSeleccion: FC<ITablaOperariosProduccionProps> = ({ loading }) => {
  const programa_seleccion = useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const { id } = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const operarios = useAppSelector((state: RootState) => state.seleccion.operarios_seleccion)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchOperariosEnSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchProgramaSeleccion({ id: id, token, verificar_token: verificarToken}))
  }, [])

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Operarios en Programa {programa_seleccion?.numero_programa}</CardTitle>
          {
            programa_seleccion && programa_seleccion.estado_programa <= '3' && (
              <ModalForm
                title={`Registro Operario al Programa`}
                open={open}
                setOpen={setOpen}
                variant='solid'
                width='bg-blue-800 hover:bg-blue-700 hover:scale-105 px-7 py-2 text-lg text-white border-none'
                textButton={`Registrar Operarios al programa`}
                >
                <FormularioRegistroOperarioSeleccion setOpen={setOpen}/>
              </ModalForm>
            )
          }
          {/* {
            operarios.length >= 1 && programa_seleccion && programa_seleccion.estado_programa === '4' &&  (
              <Button variant="solid" color="amber" className="w-full md:w-auto lg:w-auto hover:scale-105" onClick={ async () => {
                try {
                  const token_verificado = await verificarToken(token!)
                  if (!token_verificado) throw new Error('Token no verificado')
                  const response = await fetchWithTokenPost(`api/seleccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
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
                                <TablaOperariosSeleccion />
                              </div>
                            </div>
                          )
                          : (
                            <div className="w-full h-40 flex items-center justify-center">
                              <span className="font-sans text-4xl text-center">No hay Operarios agregados en este programa</span>
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

export default DetalleOperarioSeleccion
