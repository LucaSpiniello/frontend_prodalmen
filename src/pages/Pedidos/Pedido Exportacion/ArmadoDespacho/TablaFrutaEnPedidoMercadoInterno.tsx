import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { TFrutaEnPedido } from '../../../../types/TypesPedidos.types';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import Button from '../../../../components/ui/Button';
import { HeroPlus } from '../../../../components/icon/heroicons';
import { useAuth } from '../../../../context/authContext';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { DESCUENTO_FICTICIO_FRUTA_PEDIDO, GUARDAR_FRUTA_DESPACHO_PARCIAL } from '../../../../redux/slices/pedidoSlice';

const TablaFrutaPedidoMercadoInterno = () => {
  const columnHelper = createColumnHelper<TFrutaEnPedido>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const fruta_en_pedido = useAppSelector((state: RootState) => state.pedidos.fruta_en_pedido)
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
    columnHelper.accessor('tipo_fruta_en_pedido', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_fruta_en_pedido}`}
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
          {
            fruta_en_despacho_parcial.some(fruta => fruta.id === info.row.original.id)
              ? null
              : (
                <Button
                  variant='solid'
                  color='emerald'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => {
                    dispatch(GUARDAR_FRUTA_DESPACHO_PARCIAL(info.row.original))

                  }}
                  >
                    <HeroPlus style={{ fontSize: 25 }}/>
                </Button>
              )
          }
        </div>
      ),
      header: 'Acciones'
    }),
  ];

  const table = useReactTable({
    data: fruta_en_pedido,
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
  })

  return (
    <Container breakpoint={null} className="w-full">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Fruta En Pedido</CardTitle>
        </CardHeader>
        <CardBody className='overflow-auto'>
          {
            fruta_en_pedido.length >= 1
              ? <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
              : (
                <div className='w-full py-5 flex items-center justify-center'>
                  <h1 className='text-center'>Se ha seleccionado toda la fruta</h1>
                </div>
              )
          }
        </CardBody>
        {
          fruta_en_pedido.length >= 1
            ? <TableCardFooterTemplate table={table} />
            : null
        }
      </Card>
    </Container>
  );
}

export default TablaFrutaPedidoMercadoInterno;
