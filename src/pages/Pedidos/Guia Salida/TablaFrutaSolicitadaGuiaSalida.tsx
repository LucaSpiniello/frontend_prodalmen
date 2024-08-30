import React, { useState } from 'react'
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { format } from '@formkit/tempo';
import { TFrutaDespacho } from '../../../types/TypesPedidos.types';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { TFrutaSolicitadaGuia } from '../../../types/TypesGuiaSalida.type';
import Button from '../../../components/ui/Button';
import { TPalletProductoTerminadoMIN } from '../../../types/TypesEmbalaje.type';
import ModalForm from '../../../components/ModalForm.modal';
import FormularioFrutaSolicitadaGuia from './FormularioFrutaSolicitadaGuia';



const TablaFrutaSolicitadaGuiaSalida = () => {
  const columnHelper = createColumnHelper<TFrutaSolicitadaGuia>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const fruta_solicitada = useAppSelector((state: RootState) => state.guia_salida.frutas_solicitadas)
  const guia_salida = useAppSelector((state: RootState) => state.guia_salida.guia_de_salida)
  const [openModal, setOpenModal] = useState<boolean>(false)

  const todos_pallets_producto_terminados = useAppSelector((state: RootState) => state.embalaje.todos_los_pallets_productos_terminados)
  

  const columns = [
    columnHelper.accessor('nombre_producto_label', {
      id: 'nombre_producto',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.nombre_producto_label}`}
        </div>
      ),
      header: 'Producto'
    }),
    columnHelper.accessor('calidad_label', {
      id: 'calidad',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calidad_label}`}
        </div>
      ),
      header: 'Calidad'
    }),
    columnHelper.accessor('variedad_label', {
      id: 'variedad',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.variedad_label}`}
        </div>
      ),
      header: 'Variedad'
    }),
    columnHelper.accessor('calibre_label', {
      id: 'calibre',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calibre_label}`}
        </div>
      ),
      header: 'Calibre'
    }),
    columnHelper.accessor('formato_label', {
      id: 'formato',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.formato_label}`}
        </div>
      ),
      header: 'Formato'
    }),
    columnHelper.accessor('precio_kilo_neto', {
      id: 'precio_kilo',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`$${(info.row.original.precio_kilo_neto ?? 0).toLocaleString()}`}
        </div>
      ),
      header: 'Precio Kilo Neto (CLP)'
    }),
    columnHelper.accessor('kilos_solicitados', {
      id: 'kilos_solicitado',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`$${(info.row.original.kilos_solicitados ?? 0).toLocaleString()}`}
        </div>
      ),
      header: 'Kilos Solicitados'
    }),
    columnHelper.display({
      id: 'subtotal_neto',
      cell: (info) => (
        <div className='font-bold text-center'>
          {`$${(info.row.original.kilos_solicitados * info.row.original.precio_kilo_neto ?? 0).toLocaleString()}`}
        </div>
      ),
      header: 'SubTotal Neto'
    }),

    columnHelper.display({
      id: 'acciones',
      cell: (info) => {
        const row = info.row.original
        const pallet_encontrado: TPalletProductoTerminadoMIN = todos_pallets_producto_terminados?.
          find(pallet => pallet.calibre === row.calibre_label && pallet.calidad === row.calidad_label
            && pallet.variedad === row.variedad_label)! ?? []

        return  (
          <div className='font-bold text-center'>
            {
              row.kilos_solicitados > pallet_encontrado.peso_pallet
                ? (
                  <Button
                      variant='solid'
                      color='amber'
                      colorIntensity='700'
                      >
                      No hay suficiente Fruta Embalada
                    </Button>
                )
                : row.kilos_solicitados < pallet_encontrado.peso_pallet
                  ? (
                    <Button
                      variant='solid'
                      color='emerald'
                      colorIntensity='600'
                      >
                      Hay fruta embalada
                    </Button>
                  )
                  : (
                    <Button
                      variant='solid'
                      color='red'
                      colorIntensity='600'
                      >
                      Necesita Embalaje
                    </Button>
                  )
            }
          </div>
        )
      },
      header: 'Disponibilidad'
    }),
  ]
  
  const table = useReactTable({
    data: fruta_solicitada,
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
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Fruta Solicitada</CardTitle>
          {
            ['3', '4', '2'].includes(guia_salida?.estado_guia_salida!)
              ? null
              : (
                <ModalForm
                open={openModal}
                variant='solid'
                color='blue'
                colorIntensity='700'
                setOpen={setOpenModal}
                textButton='Registrar Fruta en Pedido'
                title='Registro Fruta Pedido'
              >
                  <FormularioFrutaSolicitadaGuia setOpen={setOpenModal}/>
              </ModalForm>
              )
            }
        </CardHeader>
        <CardBody className='overflow-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaFrutaSolicitadaGuiaSalida
