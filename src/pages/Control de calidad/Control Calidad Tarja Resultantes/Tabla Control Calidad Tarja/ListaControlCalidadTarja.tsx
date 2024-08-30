import { useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TControlCalidadTarja } from "../../../../types/TypesControlCalidad.type"
import TablaControlCalidadTarja from "./TablaControlCalidadTarja"
import { fetchCalibracionTarjasResultantesProduccion } from "../../../../redux/slices/controlcalidadSlice"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"


const ListaControlCalidadTarjaResultanteProduccion = () => {
  const control_calidad_tarja = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_tarjas_produccion)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchCalibracionTarjasResultantesProduccion({ token, verificar_token: verificarToken }))
  },[])

  return (
    <div className="h-full">
      <TablaControlCalidadTarja data={control_calidad_tarja} />
    </div>
  )
}

export default ListaControlCalidadTarjaResultanteProduccion
