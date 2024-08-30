import { useEffect } from "react"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TPatioTechadoEx } from "../../../../types/TypesBodega.types"
import TablaPatioTechadoExt from "./TablaPatioTechadoExt"
import TablaBodega from "./TablaPatioTechadoExt"
import { fetchPatioTechadoExterior } from "../../../../redux/slices/bodegaSlice"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

const ListaPatioTechadoExterior = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const patio_techado = useAppSelector((state: RootState) => state.bodegas.patio_techado_ext)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()  

  useEffect(() => {
    dispatch(fetchPatioTechadoExterior({ token, verificar_token: verificarToken }))
  }, [])


  return (
    <div className="h-full">
      <TablaPatioTechadoExt data={patio_techado} />
    </div>
  )
}

export default ListaPatioTechadoExterior
