import { Dispatch, FC, SetStateAction, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FilaControlDetalleDescuento_1 from './FilaControlDetalleDescuento_1';
import FilaControlDetalleDescuento_2 from './FilaControlDetalleDescuento_2';
import FilaControlDetalleDescuento_total from './FilaControlDetalleDescuento_total';
import useDeviceScreen from '../../../../../hooks/useDeviceScreen';
import { TControlCalidad, TRendimiento, TRendimientoMuestra } from '../../../../../types/TypesControlCalidad.type';
import useDarkMode from '../../../../../hooks/useDarkMode';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import TableTemplate from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';


interface IRendimientoMuestra {
  ccLote?: TControlCalidad | null
}
const columnHelper = createColumnHelper<TRendimiento>();


const TablaDetalleDescuento: FC<IRendimientoMuestra> = ({ ccLote }) => {
  const { isDarkTheme } = useDarkMode();
  const { width } = useDeviceScreen()
  
  

  return (
    <div className='flex relative mx-auto'>
      <TableContainer>
        <Table className='table' aria-label="simple table">
          <TableHead className='table-header'>
            <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
              <TableCell className='table-cell-5' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Aporte Proporcional PEX más Desechos</TableCell>
              <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepa Exp más Desechos Kilos</TableCell>
              <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos a Lid Descontando la Merma</TableCell>
              <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>% A Liquidar Descontando la Merma</TableCell>
              <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Merma en Kilos</TableCell>
              <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Merma Porcentual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='table-body'>
            <TableRow className='table-col-body'>
                  <FilaControlDetalleDescuento_1
                    ccLote={ccLote}
                  />
            </TableRow>
            <TableRow>
              <FilaControlDetalleDescuento_2
                    ccLote={ccLote}
                  />
            </TableRow>
              <FilaControlDetalleDescuento_total
                    ccLote={ccLote}
                  />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TablaDetalleDescuento;
