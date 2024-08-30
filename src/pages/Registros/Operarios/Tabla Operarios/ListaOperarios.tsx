import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import TablaOperarios from "./TablaOperarios"
import { fetchOperarios } from "../../../../redux/slices/operarioSlice"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const ListaOperarios = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchOperarios({ token, verificar_token: verificarToken }))
  }, [])


  return (
    <div className='h-full'>
      <TablaOperarios data={operarios}/>
    </div>
  )
}

export default ListaOperarios
