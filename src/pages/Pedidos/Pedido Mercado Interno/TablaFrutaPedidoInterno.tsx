import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { TFrutaEnPedido } from '../../../types/TypesPedidos.types';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import ModalForm from '../../../components/ModalForm.modal';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import FormularioFrutaEnPedido from '../Formularios/FormularioFrutaEnPedido';
import Button from '../../../components/ui/Button';
import { HeroXMark } from '../../../components/icon/heroicons';
import { useAuth } from '../../../context/authContext';
import { eliminarFrutaEnPedido } from '../../../redux/slices/pedidoSlice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

const TablaFrutaPedidoInterno = () => {
  const columnHelper = createColumnHelper<TFrutaEnPedido>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [openModalFruta, setOpenModalFruta] = useState<boolean>(false);
  const fruta_en_pedido = useAppSelector((state: RootState) => state.pedidos.fruta_en_pedido)
  const pedido_interno = useAppSelector((state: RootState) => state.pedidos.pedido_interno)
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho)

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
    columnHelper.accessor('variedad', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.variedad}`}
        </div>
      ),
      header: 'Variedad'
    }),
    columnHelper.accessor('calibre', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calibre}`}
        </div>
      ),
      header: 'Calibre'
    }),
    columnHelper.accessor('calidad', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calidad}`}
        </div>
      ),
      header: 'Calidad'
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
            ['3', '4', '5'].includes(pedido_interno?.estado_pedido!)
              ? null
              : (
                <Button
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => {
                    dispatch(eliminarFrutaEnPedido({ id: pedido_interno?.id_pedido_padre, params: { id_fruta: info.row.original.id, id_despacho: despacho?.id }, token, verificar_token: verificarToken}))
                  }}
                  >
                    <HeroXMark style={{ fontSize: 25 }}/>
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
  });

  return (
    <Container breakpoint={null} className="w-full">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Fruta En Pedido</CardTitle>
          { ['3', '4', '5'].includes(pedido_interno?.estado_pedido!)
            ? null
            :
            <ModalForm
              open={openModalFruta}
              variant='solid'
              color='blue'
              colorIntensity='700'
              setOpen={setOpenModalFruta}
              textButton='Registrar Fruta en Pedido'
              title='Registro Fruta Pedido'
              size={900}
            >
              <FormularioFrutaEnPedido setOpen={setOpenModalFruta}/>
            </ModalForm>
            }
        </CardHeader>
        <CardBody className='overflow-auto'>
          {
            fruta_en_pedido.length >= 1
              ? <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
              : (
                <div className='w-full py-5 flex items-center justify-center'>
                  <h1>No se ha seleccionado fruta para este pedido</h1>
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

export default TablaFrutaPedidoInterno;
