import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchProgramasDeSeleccion } from "../../../../redux/slices/seleccionSlice"
import TablaProgramasSeleccion from "./TablaProgramasSeleccion"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaProgramasSeleccion = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const programas_seleccion = useAppSelector((state: RootState) => state.seleccion.programas_seleccion)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchProgramasDeSeleccion({ token, verificar_token: verificarToken }))
  }, [])


  return (
    <div className='h-full'>
      <TablaProgramasSeleccion data={programas_seleccion}/>
    </div>
  )
}

export default ListaProgramasSeleccion
