import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TableCell } from "@mui/material"
import { TControlCalidad, TRendimientoMuestra } from "../../../../../types/TypesControlCalidad.type"
import useDarkMode from "../../../../../hooks/useDarkMode"
import { useAppSelector } from "../../../../../redux/hooks"
import { RootState } from "../../../../../redux/store"


interface IFilaControlRendimientoPepaProps {
  muestra?: TRendimientoMuestra | null
  id_lote?: number

}

const FilaControlRendimientoPepa: FC<IFilaControlRendimientoPepaProps> = ({ muestra: row }) => {
  const { isDarkTheme } = useDarkMode()
  const userData = useAppSelector((state: RootState) => state.auth.dataUser)

  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{row?.id}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(row?.pepa)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{((row?.pepa ?? 0) - ((row?.cc_rendimiento.muestra_variedad ?? 0) + (row?.cc_rendimiento.daño_insecto ?? 0) + (row?.cc_rendimiento.hongo ?? 0) + (row?.cc_rendimiento.doble ?? 0) + (row?.cc_rendimiento.fuera_color ?? 0) + (row?.cc_rendimiento.vana_deshidratada ?? 0) + (row?.cc_rendimiento.punto_goma ?? 0) + (row?.cc_rendimiento.goma ?? 0)))?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(row?.cc_rendimiento.muestra_variedad)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(row?.cc_rendimiento.daño_insecto)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(row?.cc_rendimiento.hongo)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{(row?.cc_rendimiento.doble)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{row?.cc_rendimiento.fuera_color} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{row?.cc_rendimiento.vana_deshidratada} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{row?.cc_rendimiento.punto_goma} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md dark:text-white text-black py-2`}>{row?.cc_rendimiento.goma} grs</span>
        </div>
      </TableCell>
    </>
  )
}

export default FilaControlRendimientoPepa
