import { FC, useEffect } from 'react';
import useDarkMode from '../../../hooks/useDarkMode'
import { TEnvases } from '../../../types/TypesRecepcionMP.types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { fetchEnvaseMateriaPrima } from '../../../redux/slices/envasesSlice';
import { useAuth } from '../../../context/authContext';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IDetalleEnvaseProps {
  id: number
}

const DetalleEnvaseMP: FC<IDetalleEnvaseProps> = ({ id }) => {
  const { isDarkTheme } = useDarkMode();
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const envase = useAppSelector((state: RootState) => state.envasesmp.envase)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchEnvaseMateriaPrima({ id, token, verificar_token: verificarToken }))
  }, [id])

  return (  
    <div
      className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 dark:bg-zinc-900 bg-zinc-50 relative px-5 py-6
        rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="nombre">Nombre: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{envase?.nombre}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:flex-col md:cols-start-2 items-center'>
        <label htmlFor="peso">Peso: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{envase?.peso}</span>
        </div>
      </div>

      <div className='md:col-span-4 md:flex-col md:cols-start-2 items-center'>
        <label htmlFor="descripcion">Descripción: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex h-32 rounded-md`}>
          <span>{envase?.descripcion}</span>
        </div>
      </div>
    </div>

  )
}

export default DetalleEnvaseMP
