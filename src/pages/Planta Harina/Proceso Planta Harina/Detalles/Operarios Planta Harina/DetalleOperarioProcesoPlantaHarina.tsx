import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import { useAuth } from "../../../../../context/authContext";
import { useParams } from "react-router-dom";
import TablaOperarioPlantaHarina from "./TablaOperariosProcesoPlantaHarina";
import ModalForm from "../../../../../components/ModalForm.modal";
import FormularioRegistroOperarioProcesoPlantaHarina from '../../Formularios/FormularioRegistroOperarioProcesoPlantaHarina'
import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import Button from "../../../../../components/ui/Button";
import { fetchOperariosProcesoPlantaHarina, fetchProcesoPlantaHarina } from "../../../../../redux/slices/procesoPlantaHarina";
import { useDispatch } from "react-redux";



interface ITablaOperariosProcesoPlantaHarinaProps {
  loading?: boolean
  refresh?: string
}

const DetalleOperarioProcesoPlantaHarina: FC<ITablaOperariosProcesoPlantaHarinaProps> = ({ loading }) => {
  const { id } = useParams()
  const proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)
  const operarios = useAppSelector((state: RootState) => state.proceso_planta_harina.operarios_proceso_planta_harina)
  const [open, setOpen] = useState<boolean>(false)
  const {verificarToken} = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const dispatch = useDispatch()

  useEffect(() => {
    if (id){
      dispatch(fetchProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchOperariosProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Operarios en Proceso Planta Harina N° {id}</CardTitle> 
          {
            proceso_planta_harina && proceso_planta_harina.estado_proceso != '4' && (
                <ModalForm
                  title={`Registro Operario al Proceso `}
                  open={open}
                  setOpen={setOpen}
                  variant='solid'
                  color="blue"
                  colorIntensity="700"
                  width='hover:scale-105text-white'
                  textButton={`Registrar Operarios al Proceso`}
                  >
                  <FormularioRegistroOperarioProcesoPlantaHarina setOpen={setOpen}/>
                </ModalForm>
              )
          }
          {
            proceso_planta_harina && proceso_planta_harina.estado_proceso === '5' && proceso_planta_harina.condicion_termino && (
              <Button variant="solid" color="amber" className="w-full md:w-auto lg:w-auto hover:scale-105" onClick={ async () => {
                try {
                  const token_verificado = await verificarToken(token!)
                  if (!token_verificado)throw new Error('Token no verificado')
                  const response = await fetchWithTokenPost(`api/procesos/${id}/asignar_dias_kilos/`, {}, token_verificado)
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
          }
        </CardHeader>
        <CardBody>
          <article className={`row-start-4 row-span-4 col-span-3 w-full h-full dark:bg-zinc-900 bg-zinc-50 flex flex-col lg:flex-col  justify-between pb-10`}>
            {
                loading
                  ? <Skeleton variant='rectangular' width='100%' height={370}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                     {
                      operarios && operarios.length >= 1
                        ? (
                          <div className={`w-full h-full  flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                            <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'>
                              <TablaOperarioPlantaHarina />
                            </div>
                          </div>
                        )
                        : (
                          <div className="w-full h-40 flex items-center justify-center">
                            <span className="font-sans text-4xl text-center">No hay operarios en este proceso</span>
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

export default DetalleOperarioProcesoPlantaHarina
