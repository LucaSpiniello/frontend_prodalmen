import React, { FC, useState } from 'react'
import { TCajasEnPalletProductoTerminado } from '../../../types/TypesEmbalaje.type'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template'
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import Button from '../../../components/ui/Button'
import ModalForm from '../../../components/ModalForm.modal'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'

interface ICajasPalletProps {
  cajas_pallet: TCajasEnPalletProductoTerminado[] | undefined
  id_pallet?: number
}
const TablaCajasPalletProductoTerminado: FC<ICajasPalletProps> = ({ cajas_pallet }) => {
  const columnHelper = createColumnHelper<TCajasEnPalletProductoTerminado>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const columns = [
    columnHelper.accessor('tipo_caja_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_caja_label}`}
        </div>
      ),
      header: 'Tipo Caja'
    }),
    columnHelper.accessor('cantidad_cajas', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {(info.row.original.cantidad_cajas ?? 0).toLocaleString()}
        </div>
      ),
      header: 'Cantidad Cajas'
    }),
    columnHelper.accessor('peso_x_caja', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {(info.row.original.peso_x_caja ?? 0).toLocaleString()} kgs
        </div>
      ),
      header: 'Peso Por Caja'
    }),
  ]

  const table = useReactTable({
    data: cajas_pallet ? cajas_pallet : [],
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
      pagination: { pageSize: 3 },
    },
  })


  return (
    <Container breakpoint={null} className="w-full">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Detalle Cajas Pallet Producto Terminado</CardTitle>
        </CardHeader>
        <CardBody className='overflow-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaCajasPalletProductoTerminado
