import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TableCell } from "@mui/material"
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
  muestra?: TRendimientoMuestra | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  ccLote?: TControlCalidad | null

}

const FilaControlRendimientoCalibreFinal: FC<ILoteCompletadoProps> = () => {
  const rendimiento = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)
  const calculoTotal = rendimiento?.cc_calculo_final.final_exp!;
  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `#10b981`, padding: 5 }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>Total</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].precalibre! * rendimiento?.cc_calculo_final.final_exp! / 100)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981`, }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_18_20! * rendimiento?.cc_calculo_final.final_exp! / 100)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_20_22! * rendimiento?.cc_calculo_final.final_exp! / 100)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_23_25! * rendimiento?.cc_calculo_final.final_exp! / 100)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_25_27! * rendimiento?.cc_calculo_final.final_exp! / 100)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_27_30! * rendimiento?.cc_calculo_final.final_exp! / 100)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_30_32! * rendimiento?.cc_calculo_final.final_exp! / 100 ?? 0).toFixed(2)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_32_34! * rendimiento?.cc_calculo_final.final_exp! / 100 ?? 0).toFixed(2)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_34_36! * rendimiento?.cc_calculo_final.final_exp! / 100 ?? 0).toFixed(2)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_36_40! * rendimiento?.cc_calculo_final.final_exp! / 100 ?? 0).toFixed(2)} kgs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{(rendimiento?.cc_pepa_calibre[0].calibre_40_mas! * rendimiento?.cc_calculo_final.final_exp! / 100 ?? 0).toLocaleString()} kgs</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `#10b981` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center font-semibold dark:text-black `}>{calculoTotal} kgs</span>
        </div>
      </TableCell>
      
      
    </>

  )
}

export default FilaControlRendimientoCalibreFinal
