import { useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TControlCalidad } from "../../../../types/TypesControlCalidad.type"
import TablaControlRendimiento from "./TablaControlRendimiento"
import { fetchControlesDeCalidad } from "../../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const ListaControlRendimiento = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.controles_calidad)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchControlesDeCalidad({ token, verificar_token: verificarToken }))
  }, [])

  return (
    <div className="h-full">
      <TablaControlRendimiento data={control_calidad} refresh={() => {}} />
    </div>
  )
}

export default ListaControlRendimiento