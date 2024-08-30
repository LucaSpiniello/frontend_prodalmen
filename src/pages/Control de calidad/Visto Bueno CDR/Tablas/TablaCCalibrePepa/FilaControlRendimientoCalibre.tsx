import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { format } from "@formkit/tempo"
import { TControlCalidad, TRendimiento, TRendimientoMuestra } from "../../../../../types/TypesControlCalidad.type"
import useDarkMode from "../../../../../hooks/useDarkMode"
import { RootState } from "../../../../../redux/store"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
import { TableCell } from "@mui/material"
import { useAuth } from "../../../../../context/authContext"
import { fetchWithTokenPostAction } from "../../../../../utils/peticiones.utils"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface Resultados {
  kilos: string;
  porcentaje: string;
}

interface ILoteCompletadoProps {
  muestra?: TRendimientoMuestra | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  ccLote?: TControlCalidad | null

}

const FilaControlRendimientoCalibre: FC<ILoteCompletadoProps> = ({ ccLote }) => {
  const rendimiento = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)
  const { isDarkTheme } = useDarkMode()

  function calcularValores(precalibre: number, pesoMuestraCalibre: number): Resultados {
    const kilos = ((precalibre * pesoMuestraCalibre) / 100).toFixed(1);
    const porcentaje = precalibre.toFixed(1);
  
    return { kilos, porcentaje };
  }


  const lote_calibrado = ccLote?.control_rendimiento.find(lote => lote.cc_calibrespepaok === true)
  const sumPrecalibre = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].precalibre!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre18_20 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_18_20!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre20_22 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_20_22!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre23_25 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_23_25!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre25_27 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_25_27!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre27_30 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_27_30!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre30_32 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_30_32!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre32_34 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_32_34!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre34_36 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_34_36!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre36_40 = parseInt(calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_36_40!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumCalibre40_mas = parseInt( calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_40_mas!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).kilos)
  const sumTotal = lote_calibrado?.cc_rendimiento.peso_muestra_calibre!
  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, padding: 5 }}>
        <div className=' h-full w-full flex items-center justify-center p-5'>
          <span className={`text-md text-center dark:text-white text-black`}>{lote_calibrado?.id}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumPrecalibre} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].precalibre!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre18_20} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_18_20!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre20_22} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_20_22!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre23_25} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_23_25!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre25_27} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_25_27!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre27_30} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_27_30!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre30_32} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_30_32!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre32_34} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_32_34!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre34_36} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_34_36!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre36_40} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_36_40!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumCalibre40_mas} grs = {calcularValores(rendimiento?.cc_pepa_calibre[0].calibre_40_mas!, lote_calibrado?.cc_rendimiento.peso_muestra_calibre!).porcentaje} %
          </span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md text-center dark:text-white text-black`}>
            {sumTotal} grs = 100%
          </span>
        </div>
      </TableCell>
      
    </>

  )
}

export default FilaControlRendimientoCalibre
