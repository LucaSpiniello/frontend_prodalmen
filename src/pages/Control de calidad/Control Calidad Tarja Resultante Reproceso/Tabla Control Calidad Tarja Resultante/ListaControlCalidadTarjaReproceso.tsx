import { useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TControlCalidadTarja } from "../../../../types/TypesControlCalidad.type"
import TablaControlCalidadTarja from "./TablaControlCalidadTarja"
import { fetchCalibracionTarjasReproceso } from "../../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

const ListaControlCalidadReproceso = () => {
  // const { authTokens, validate } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const control_calidad_tarja = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_tarjas_reprocesos)


  useEffect(() => {
    //@ts-ignore
    dispatch(fetchCalibracionTarjasReproceso({ token, verificar_token: verificarToken }))
  }, [])

  return (
    <div className="h-full">
      <TablaControlCalidadTarja data={control_calidad_tarja} />
    </div>
  )
}

export default ListaControlCalidadReproceso
