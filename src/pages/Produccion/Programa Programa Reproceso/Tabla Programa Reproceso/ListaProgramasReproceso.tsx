import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchProgramasReprocesos } from "../../../../redux/slices/reprocesoSlice"
import TablaProgramasReproceso from "./TablaProgramasReproceso"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaProgramasSeleccion = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const programas_reproceso = useAppSelector((state: RootState) => state.reproceso.programas_reprocesos)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    dispatch(fetchProgramasReprocesos({ token, verificar_token: verificarToken }))
  }, [])

  return (
    <div className='h-full'>
      <TablaProgramasReproceso data={programas_reproceso}/>
    </div>
  )
}

export default ListaProgramasSeleccion
