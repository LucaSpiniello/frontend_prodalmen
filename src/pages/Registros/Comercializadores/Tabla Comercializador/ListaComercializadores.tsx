import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import TablaComercializadores from "./TablaComercializador"
import { fetchComercializadores } from "../../../../redux/slices/comercializadores"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const ListaComercializadores = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const comercializadores = useAppSelector((state: RootState) => state.comercializadores.comercializadores)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchComercializadores({ token, verificar_token: verificarToken }))
  }, [])


  return (
    <div className='h-full'>
      <TablaComercializadores data={comercializadores}/>
    </div>
  )
}

export default ListaComercializadores
