import { useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import TablaControlCalidad from "./TablaControlCalidad"
import { fetchControlesDeCalidad } from "../../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

const ListaControlCalidad = () => {
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.controles_calidad)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchControlesDeCalidad({ token, verificar_token: verificarToken }))
  }, [])

  return (
    <div className="h-full">
      <TablaControlCalidad data={control_calidad ? control_calidad : []} />
    </div>
  )
}

export default ListaControlCalidad