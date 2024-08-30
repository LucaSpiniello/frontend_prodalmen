import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TRendimiento, TRendimientoMuestra } from "../../../../../types/TypesControlCalidad.type"
import useDarkMode from "../../../../../hooks/useDarkMode"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
import { RootState } from "../../../../../redux/store"
import { TableCell } from "@mui/material"
import { fetchWithTokenPost, fetchWithTokenPostAction } from "../../../../../utils/peticiones.utils"
import { useAuth } from "../../../../../context/authContext"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface ILoteCompletadoProps {
  muestra?: TRendimientoMuestra | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  ccLote?: TControlCalidad | null

}

const FilaControlDetalleDescuento_1: FC<ILoteCompletadoProps> = () => {
  const { isDarkTheme } = useDarkMode()
  const rendimiento = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)


  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(rendimiento?.cc_aportes_pex[0].exportable)?.toFixed(1)} %</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(rendimiento?.cc_descuentos[0].pepa_exp)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(rendimiento?.cc_kilos_des_merma[0].exportable)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(rendimiento?.cc_porcentaje_liquidar[0].exportable)?.toFixed(1)} %</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(rendimiento?.cc_calculo_final.merma_exp)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(rendimiento?.cc_merma_porc[0].exportable)?.toFixed(1)} %</span>
        </div>
      </TableCell>
      
      
      
    </>

  )
}

export default FilaControlDetalleDescuento_1
