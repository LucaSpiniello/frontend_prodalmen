import { FC, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useDarkMode from '../../../hooks/useDarkMode';
import { TEnvaseEnGuia } from '../../../types/TypesRecepcionMP.types';
import { tipoFrutaFilter, variedadFilter } from '../../../utils/options.constantes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useAuth } from '../../../context/authContext';
import { fetchLoteGuiaRecepcionIndividual } from '../../../redux/slices/recepcionmp';
import { useParams } from 'react-router-dom';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface Row {
  kilos_brutos_1: null,
  kilos_brutos_2: null,
  kilos_tara_1: null,
  kilos_tara_2: null,
  estado_recepcion: null,
  guiarecepcion: null,
  creado_por: null
}

interface IFooterProps {
  id_lote: number,
  id_guia: number
}

const FooterDetalleEnvase: FC<IFooterProps> = ({ id_lote }) => {
  const { id } = useParams() 

  const { isDarkTheme } = useDarkMode();

  const initialRows = [
    {
      envase: null,
      variedad: null,
      tipo_producto: '1',
      cantidad_envases: null
    },
  ]

  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
    
  );

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const loteEnGuia = useAppSelector((state: RootState) => state.recepcionmp.lote)
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchLoteGuiaRecepcionIndividual({ id, params: { id_lote: id_lote }, token, verificar_token: verificarToken }))
  }, [])


  return (
    <div>
      <div
        className='relative'>
        <TableContainer sx={{ height: 350, overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750, borderRadius: 5, background: `${isDarkTheme ? '#18181b' : 'white'}` }} aria-label="simple table">
            <TableHead className='bg-[#18181b] flex rounded-md'>
              <TableRow className='flex flex-wrap'>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Envase</TableCell>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Cantidad Envases</TableCell>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Variedad</TableCell>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Producto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loteEnGuia?.envases.map((row: TEnvaseEnGuia) => {
                const nombre_envase = envases?.find(envaseList => envaseList.id === row.envase)?.nombre
                const nombre_variedad = variedadFilter.find(variedad => variedad.value === row.variedad)?.label;
                const nombre_producto = tipoFrutaFilter.find(producto => producto.value === row.tipo_producto)?.label

                return (
                  <TableRow key={row.id} style={{ background: `${isDarkTheme ? '#18181b' : 'c0c0c6'}`, position: 'relative',}}>
                    
                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center  dark:text-white text-zinc-800 `}>{nombre_envase}</span>
                      </div>
                    </TableCell>

                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center  dark:text-white text-zinc-800`}>{row.cantidad_envases}</span>
                      </div>
                    </TableCell>

                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center dark:text-white text-zinc-800`}>{nombre_variedad}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1 }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center dark:text-white text-zinc-800`}>{nombre_producto}</span>
                      </div>
                    </TableCell>

                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default FooterDetalleEnvase;
