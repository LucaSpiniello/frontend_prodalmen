import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { TFrutaDespacho, TFrutaEnPedido } from '../../../../types/TypesPedidos.types';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import Button from '../../../../components/ui/Button';
import { HeroPlus, HeroXMark } from '../../../../components/icon/heroicons';
import { useAuth } from '../../../../context/authContext';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AÑADIR_FICTICIO_FRUTA_PEDIDO, ELIMINAR_FRUTA_DESPACHO_PARCIAL, fetchFrutaEnPedido, registrarFrutaADespacho } from '../../../../redux/slices/pedidoSlice';

interface IFrutaPedidoExportacionProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const TablaFrutaPedidoExportacion: FC<IFrutaPedidoExportacionProps> = ({ setOpen }) => {
  const columnHelper = createColumnHelper<TFrutaDespacho>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho)
  const fruta_en_despacho_parcial = useAppSelector((state: RootState) => state.pedidos.fruta_en_despacho_parcial)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  

  const columns = [
    columnHelper.accessor('codigo_fruta', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.codigo_fruta}`}
        </div>
      ),
      header: 'Código Fruta'
    }),
    columnHelper.accessor('tipo_fruta', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_fruta}`}
        </div>
      ),
      header: 'Tipo Fruta'
    }),
    columnHelper.accessor('cantidad', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.cantidad}`}
        </div>
      ),
      header: 'Cantidad / Unidades'
    }),
    columnHelper.display({
      id: 'acciones',
      cell: (info) => (
        <div className='w-full flex items-center justify-center'>
          <Button
            variant='solid'
            color='red'
            colorIntensity='700'
            className='hover:scale-105'
            onClick={() => {
              dispatch(ELIMINAR_FRUTA_DESPACHO_PARCIAL(info.row.original.id))
              dispatch(AÑADIR_FICTICIO_FRUTA_PEDIDO(info.row.original))
            }}
            >
              <HeroXMark style={{ fontSize: 25 }}/>
          </Button>
        </div>
      ),
      header: 'Acciones'
    }),
  ];

  const table = useReactTable({
    data: fruta_en_despacho_parcial,
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

  console.log(despacho)

  return (
    <Container breakpoint={null} className="w-full">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Fruta En Pedido</CardTitle>
          {
            fruta_en_despacho_parcial.length >= 1
              ? (
                <Button
                  variant='solid'
                  color='emerald'
                  colorIntensity='700'
                  onClick={() => {
                    dispatch(registrarFrutaADespacho({ id: despacho?.id,
                    action: setOpen,
                    data: 
                    {
                      frutas: fruta_en_despacho_parcial
                    }, token, verificar_token: verificarToken }))
                    }}
                  >
                    Agregar Fruta al Despacho
                </Button>
              )
              : null
          }
        </CardHeader>
        <CardBody className='overflow-auto'>
          {
            fruta_en_despacho_parcial.length >= 1
              ? <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
              : (
                <div className='w-full py-5 flex items-center justify-center'>
                  <h1 className='text-center'>No se ha seleccionado fruta para este despacho</h1>
                </div>
              )
          }
        </CardBody>
        {
          fruta_en_despacho_parcial.length >= 1
            ? <TableCardFooterTemplate table={table} />
            : null
        }
      </Card>
    </Container>
  );
}

export default TablaFrutaPedidoExportacion;
