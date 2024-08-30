import { useEffect } from "react"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TEnvases } from "../../../../types/TypesRecepcionMP.types"
import TablaEnvases from "./TablaEnvases"
import { fetchEnvases } from "../../../../redux/slices/envasesSlice"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"


const ListaEnvases = () => {
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchEnvases({ token, verificar_token: verificarToken }))
  }, [])


  return (
    <div className="h-full">
      <TablaEnvases data={envases} />
    </div>
  )
}

export default ListaEnvases
