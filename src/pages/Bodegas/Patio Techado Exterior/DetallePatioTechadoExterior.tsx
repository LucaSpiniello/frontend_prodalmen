import { useLocation, useParams } from "react-router-dom";
import useDarkMode from "../../../hooks/useDarkMode";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { TEnvasePatio, TPatioTechadoEx } from "../../../types/TypesBodega.types";
import TablaEnvasesPatio from "./Tabla Patio Techado Exterior/TablaEnvasesPatio";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import { fetchLotePatioTechadoExterior } from "../../../redux/slices/bodegaSlice";
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardTitle } from "../../../components/ui/Card";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";



const DetallePatioTechadoExterior = () => {
  const { state } = useLocation()

  const patio_techado = useAppSelector((state: RootState) => state.bodegas.patio_techado)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { id } = useParams()

  useEffect(() => {
    dispatch(fetchLotePatioTechadoExterior({ id: state.id_recepcion, token, verificar_token: verificarToken }))
  }, [])

  // const envasesPatio: TEnvasePatio[] = guia?.envases!
  const totalEnvases: number = patio_techado?.envases.length!

  return (
   <PageWrapper title="Detalle Patio techado exterior">
    <Container breakpoint={null} className="w-full h-full overflow-hidden">

      <Card>
        <CardHeader>
          <CardTitle>Detalle Guía Patio {id}</CardTitle>
        </CardHeader>
        <CardBody >
          <div className='flex flex-col md:flex-row lg:flex-row w-full gap-5'>
            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Cantidad Envases: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                <span>{totalEnvases}</span>
              </div>
            </div>



            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Ubicación: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>{patio_techado?.ubicacion_label}</span>
              </div>
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="rut_productor">Productor: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>{patio_techado?.productor}</span>
              </div>
            </div>

        </div>
        </CardBody>
    
        <TablaEnvasesPatio data={patio_techado?.envases || undefined} id_lote={patio_techado?.cc_guia} total_envases={totalEnvases!}/>

      </Card>
    </Container>
   </PageWrapper>

  )
}

export default DetallePatioTechadoExterior
