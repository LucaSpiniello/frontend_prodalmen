import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TRendimiento, TRendimientoMuestra } from "../../../../../types/TypesControlCalidad.type"
import useDarkMode from "../../../../../hooks/useDarkMode"
import { useAppSelector } from "../../../../../redux/hooks"
import { RootState } from "../../../../../redux/store"
import { TableCell } from "@mui/material"


interface ILoteCompletadoProps {
  ccLote?: TControlCalidad | null

}

const FilaControlDetalleDescuento_2: FC<ILoteCompletadoProps> = () => {
  const { isDarkTheme } = useDarkMode()
  const rendimiento = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)

  const formatNumber = (number: number) => 
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(number);
  
  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>
            {formatNumber(rendimiento?.cc_aportes_pex[0].exportable || 0)} %
          </span>
        </div>
      </TableCell>
      
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>
            {formatNumber(rendimiento?.cc_descuentos[0].pepa_exp || 0)} grs
          </span>
        </div>
      </TableCell>
    
      
    </>

  )

  return (
    <>
    <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_aportes_pex[0].des)?.toFixed(1)} %</span>
      </div>
    </TableCell>
    <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
      <div className=' h-full w-full flex items-center justify-center'>
        <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_descuentos[0].desechos)?.toFixed(1)} grs</span>
      </div>
    </TableCell>
    
    
  </>

  )
}

export default FilaControlDetalleDescuento_2
