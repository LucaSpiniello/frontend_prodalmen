import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { 
  FaPlay,
  FaStop,
  FaPause,
  FaFilePdf,

} from "react-icons/fa";
import toast from 'react-hot-toast';

import { HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";
import { TbEqual } from "react-icons/tb";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { fetchWithTokenPost, fetchWithTokenPut } from '../../../../../utils/peticiones.utils';
import { TBinSubProducto, TSeleccion, TSubProductoEnBin, TSubproducto } from '../../../../../types/TypesSeleccion.type';
import { format } from '@formkit/tempo';
import Button from '../../../../../components/ui/Button';
import Tooltip from '../../../../../components/ui/Tooltip';
import { HeroEye } from '../../../../../components/icon/heroicons';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import ModalForm from '../../../../../components/ModalForm.modal';
import FormularioInformeSeleccion from '../../Formularios/Formulario PDF\'s/FormularioInformeSeleccion';
import FormularioInformeKilosXOperario from '../../Formularios/Formulario PDF\'s/FormularioInformeKilosXOperario';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { fetchBinSubProductos, fetchSubProductoLista } from '../../../../../redux/slices/seleccionSlice';
import Label from '../../../../../components/form/Label';
import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact';
import { fetchOperario, fetchOperarios } from '../../../../../redux/slices/operarioSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IDetalleSubProductosProps {
  subproductos: TSubProductoEnBin[] | undefined
}

const TablaDetalleSubProductosEnBin: FC<IDetalleSubProductosProps> = ({ subproductos }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)

  useEffect(()  => {
    //@ts-ignore
    dispatch(fetchOperarios({ token, verificar_token: verificarToken }))
  }, [])
  
  useEffect(()  => {
    //@ts-ignore
    dispatch(fetchBinSubProductos({ token, verificar_token: verificarToken }))
  }, [])


  const columnHelper = createColumnHelper<TSubProductoEnBin>();

  const columns = [
    columnHelper.accessor('programa', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.programa}`}
        </div>
      ),
      header: 'Programa',
    }),
    columnHelper.accessor('operario', {
      cell: (info) => {

        return (
          <div className='font-bold'>
            <p className=''>{info.row.original.operario}</p>
          </div>
        )
      },
      header: 'Operario',
    }),
    columnHelper.accessor('peso', {
      cell: (info) => {

        return (
          <div className='font-bold'>
            <p className=''>{info.row.original.peso}</p>
          </div>
        )
      },
      header: 'Peso',
    }),
    columnHelper.accessor('tipo_subproducto', {
      cell: (info) => {

        return (
          <div className='font-bold'>
            <p className=''>{info.row.original.tipo_subproducto}</p>
          </div>
        )
      },
      header: 'Tipo SubProducto',
    }),
    columnHelper.accessor('fecha_creacion', {
      cell: (info) => {
        return (
          <div className='font-bold'>
            <p className=''>{format(info.row.original.fecha_creacion, { date: 'short', time: 'short' } , 'es' )}</p>
          </div>
        )
      },	
      header: 'Envases en Proc.',
    }),
  ];



  const table = useReactTable({
    data: subproductos ? subproductos : [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    enableGlobalFilter: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return (
    <PageWrapper name='Lista SubProductos'>
      <Container breakpoint={null} className='w-full'>
        <Card className='h-full w-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>SubProductos en Bin</CardTitle>
              <Badge
                variant='outline'
                className='border-transparent px-4'
                rounded='rounded-full'>
                {table.getFilteredRowModel().rows.length} registros
              </Badge>
            </CardHeaderChild>
          </CardHeader>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaDetalleSubProductosEnBin;

