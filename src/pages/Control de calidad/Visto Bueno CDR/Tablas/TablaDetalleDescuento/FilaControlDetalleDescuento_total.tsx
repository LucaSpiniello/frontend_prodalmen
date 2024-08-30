import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TableCell } from "@mui/material"
import { BiCheckDouble } from "react-icons/bi"
import { format } from "@formkit/tempo"
import { TControlCalidad, TRendimiento, TRendimientoMuestra } from "../../../../../types/TypesControlCalidad.type"
import useDarkMode from "../../../../../hooks/useDarkMode"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
import { RootState } from "../../../../../redux/store"
import { useAuth } from "../../../../../context/authContext"
import { fetchWithTokenPostAction } from "../../../../../utils/peticiones.utils"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface ILoteCompletadoProps {
  ccLote?: TControlCalidad | null

}

const FilaControlDetalleDescuento_total: FC<ILoteCompletadoProps> = () => {
  const { isDarkTheme } = useDarkMode()
  const rendimiento = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)

  return (
    <>
    <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `#10b981` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-black' : 'text-black'} font-semibold py-2`}>{(rendimiento?.cc_aportes_pex[0].exportable! + rendimiento?.cc_aportes_pex[0].des!)?.toFixed(1)} %</span>
      </div>
    </TableCell>
    <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-black' : 'text-black'} font-semibold py-2`}>{(rendimiento?.cc_descuentos[0].desechos! + rendimiento?.cc_descuentos[0].pepa_exp!)?.toFixed(1)} grs</span>
      </div>
    </TableCell>
    <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981`, }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-black' : 'text-black'} font-semibold py-2`}>{(rendimiento?.cc_kilos_des_merma[0].exportable! + rendimiento?.cc_kilos_des_merma[0].des!)?.toFixed(1)} grs</span>
      </div>
    </TableCell>
    <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-black' : 'text-black'} font-semibold py-2`}>{(rendimiento?.cc_porcentaje_liquidar[0].exportable! + rendimiento?.cc_porcentaje_liquidar[0].des!)?.toFixed(1)} %</span>
      </div>
    </TableCell>
    <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-black' : 'text-black'} font-semibold py-2`}>{(rendimiento?.cc_calculo_final.merma_exp! + rendimiento?.cc_calculo_final.merma_des!)?.toFixed(1)} grs</span>
      </div>
    </TableCell>
    <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-black' : 'text-black'} font-semibold py-2`}>{(rendimiento?.cc_merma_porc[0].exportable! + rendimiento?.cc_merma_porc[0].des!)?.toFixed(1)} %</span>
      </div>
    </TableCell>
    
    
    
  </>
  )
}

export default FilaControlDetalleDescuento_total
