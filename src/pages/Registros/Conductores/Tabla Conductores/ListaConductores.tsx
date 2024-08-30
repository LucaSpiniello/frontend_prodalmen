import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import TablaConductor from "./TablaConductor"
import { fetchConductores } from "../../../../redux/slices/conductoresSlice"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaConductores = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const conductores = useAppSelector((state: RootState) => state.conductores.conductores)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() =>{
    // @ts-ignore
    dispatch(fetchConductores({ token, verificar_token: verificarToken }))
  }, [])

  return (
    <div className='h-full'>
      <TablaConductor data={conductores} />
    </div>
  )
}

export default ListaConductores
