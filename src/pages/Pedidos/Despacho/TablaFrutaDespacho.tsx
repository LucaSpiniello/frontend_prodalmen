import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react'
import { TFrutaDespacho } from '../../../types/TypesPedidos.types';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import { format } from '@formkit/tempo';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import ModalForm from '../../../components/ModalForm.modal';




const TablaFrutaDespacho = () => {
  const columnHelper = createColumnHelper<TFrutaDespacho>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const frutadespachos = useAppSelector((state: RootState) => state.pedidos.fruta_en_despacho)

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
    ]
  
    const table = useReactTable({
      data: frutadespachos,
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
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card className='h-full'>
        <CardBody className='overflow-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaFrutaDespacho
