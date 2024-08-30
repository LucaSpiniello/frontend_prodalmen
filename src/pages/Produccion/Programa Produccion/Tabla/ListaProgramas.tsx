import { useEffect } from "react"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TProduccion } from "../../../../types/TypesProduccion.types"
import TablaProductor from "../../../Registros/Productores/Tabla Productores/TablaProductor"
import TablaProgramas from "./TablaProgramas"
import { fetchProgramasProduccion } from "../../../../redux/slices/produccionSlice"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaProgramas = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const programas_produccion = useAppSelector((state: RootState) => state.programa_produccion.programas_produccion)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchProgramasProduccion({ token, verificar_token: verificarToken }))
  }, [])


  return (
    <div className='h-full'>
      <TablaProgramas data={programas_produccion}/>
    </div>
  )
}

export default ListaProgramas
