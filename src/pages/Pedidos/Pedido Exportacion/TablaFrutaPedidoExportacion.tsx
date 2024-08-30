import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { FC, useState } from 'react'
import { TFrutaPedido, TPedidoExportacion, TPedidoInterno } from '../../../types/TypesPedidos.types';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader from '../../../components/layouts/Subheader/Subheader';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../templates/common/TableParts.template';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import Button from '../../../components/ui/Button';
import ModalForm from '../../../components/ModalForm.modal';
import FormularioFrutaEnPedidoMercadoInterno from '../Formularios/FormularioFrutaEnPedidoMercadoInterno';
import { TPalletProductoTerminado, TPalletProductoTerminadoMIN } from '../../../types/TypesEmbalaje.type';
import { useAuth } from '../../../context/authContext';
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { actualizar_estado_pedido_exportacion, fetchPedidoInterno } from '../../../redux/slices/pedidoSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import FormularioFrutaPedidoExportacion from '../Formularios/FormularioFrutaPedidoExportacion';

interface TablaFrutaProps {
  // fruta_pedido_exportacion: TFrutaPedido[] | undefined,
  // pedido_exportacion: TPedidoExportacion | null
}

const TablaFrutaPedidoExportacion: FC<TablaFrutaProps> = () => {
  const [openModal, setOpenModal] = useState(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const { id } = useParams()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const columnHelper = createColumnHelper<TFrutaPedido>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const pedido_exportacion = useAppSelector((state: RootState) => state.pedidos.pedido_exportacion)


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
    data: pedido_exportacion?.frutas ? pedido_exportacion?.frutas : [],
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

  const columnas: TableColumn[] = [
    {id: 'nombre_producto', className: 'lg:w-32'},
    {id: 'calidad', className: 'w-auto  lg:w-40'},
    {id: 'variedad', className: 'w-auto  lg:w-40'},
    {id: 'calibre', className: 'w-auto lg:w-40'},
    {id: 'formato', className: 'w-auto lg:w-40'},
    {id: 'precio_kilo', className: 'w-full lg:w-48 text-start'},
    {id: 'kilos_solicitado', className: 'w-auto lg:w-40'},
  ]


  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card className='w-full h-full'>
        <CardHeader>
          <CardTitle>Fruta Exportación</CardTitle>
        </CardHeader>
        <CardBody className='overflow-auto flex flex-col gap-2'>
          <article className='w-full flex justify-between'>
            <div className='w-3/12'>
              <FieldWrap
                firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
                lastSuffix={
                  globalFilter && (
                    <Icon
                      icon='HeroXMark'
                      color='red'
                      className='mx-2 cursor-pointer'
                      onClick={() => {
                        setGlobalFilter('');
                      }}
                    />
                  )
                }>
                <Input
                  id='search'
                  name='search'
                  placeholder='Busca al operario...'
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </FieldWrap>
            </div>
              
            <div className='flex flex-row-reverse gap-5'>
              {
                pedido_exportacion?.estado_pedido! >= '1' 
                  ? (
                    <ModalForm
                      variant='solid'
                      open={openModal}
                      setOpen={setOpenModal}
                      title='Añadir fruta al pedido'
                      textButton='Añadir fruta al pedido'
                      size={700}
                    >
                      <FormularioFrutaPedidoExportacion setOpen={setOpenModal}/>
                    </ModalForm>
                  )
                  : null
              }

              {
                pedido_exportacion?.frutas.length! > 2
                ? (
                  <Button
                    variant='solid'
                    color='emerald'
                    colorIntensity='700'
                    onClick={() => actualizar_estado_pedido_exportacion({ id: parseInt(id!), data: {
                      estado_pedido: '2'
                    },
                    token,
                    verificar_token: verificarToken
                  })}
                  >
                    Confirmar Pedido y Solicitar
                  </Button>
                )
                : null
              }
            </div>
          </article>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
};

export default TablaFrutaPedidoExportacion
