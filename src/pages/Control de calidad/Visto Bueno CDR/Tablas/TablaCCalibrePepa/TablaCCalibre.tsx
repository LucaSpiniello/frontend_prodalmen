import { Dispatch, FC, SetStateAction } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FilaControlRendimientoCalibre from './FilaControlRendimientoCalibre';
import FilaControlRendimientoCalibreFinal from './FilaControlRendimientoFinal';
import { TControlCalidad, TRendimientoMuestra } from '../../../../../types/TypesControlCalidad.type';
import useDarkMode from '../../../../../hooks/useDarkMode';


interface IRendimientoMuestra {
  ccLote?: TControlCalidad | null
}


const TablaCCalibrePepa: FC<IRendimientoMuestra> = ({ ccLote }) => {
  const { isDarkTheme } = useDarkMode();

  return (
    <div>
      <div
        className='p-5'>
        <TableContainer sx={{ height: 200}}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
              <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Muestra</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Pre Calibre</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>18/20</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>20/22</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>23/25</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>25/27</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>27/30</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>30/32</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>32/34</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>34/36</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>36/40</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>40/+</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Total</TableCell>


              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              <TableRow className='table-row-body'>
                <FilaControlRendimientoCalibre
                  ccLote={ccLote}
                />
              </TableRow>
              <TableRow className='table-row-body'>
                <FilaControlRendimientoCalibreFinal
                  ccLote={ccLote}
                />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >         
  );
};

export default TablaCCalibrePepa;
