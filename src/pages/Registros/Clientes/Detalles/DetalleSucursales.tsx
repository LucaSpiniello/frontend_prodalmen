import React, { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { fetchSucursales } from '../../../../redux/slices/clientes'
import TablaSucursales from '../TablaSucursales'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IDetalleSucursalesProps {
  rut: string | undefined
  tipo_cliente: string 
}

const DetalleSucursales: FC<IDetalleSucursalesProps> = ({ rut, tipo_cliente }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  

  useEffect(() => {
    if (rut){
      dispatch(fetchSucursales({ params: { rut: `${rut}`}, token, verificar_token: verificarToken }))
    }
  }, [rut])

  return <TablaSucursales tipo_cliente={tipo_cliente}/>
}

export default DetalleSucursales
