import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import TablaCamion from "./TablaCamiones"
import { fetchCamiones } from "../../../../redux/slices/camionesSlice"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const ListaCamiones = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchCamiones({ token, verificar_token: verificarToken }))
  }, [token])

  return (
    <div className="h-full">
      <TablaCamion data={camiones} />
    </div>
  )
}

export default ListaCamiones
