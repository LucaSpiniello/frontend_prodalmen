import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { TPalletProductoTerminadoMIN } from '../../../types/TypesEmbalaje.type';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import {  useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { format } from '@formkit/tempo';
import Tooltip from '../../../components/ui/Tooltip';
import { HeroEye, HeroPlus, HeroPlusCircle, HeroXCircle, HeroXMark } from '../../../components/icon/heroicons';
import ModalForm from '../../../components/ModalForm.modal';
import { useAuth } from '../../../context/authContext';
import DetallePalletProductoTerminado from './DetallePalletProductoTerminado';
import { fetchTodosPalletsProductoTerminados } from '../../../redux/slices/embalajeSlice';
import Subheader, { SubheaderLeft } from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useLocation } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { AÑADADIR_PALLET_FRUTA_EN_PEDIDO, QUITAR_PALLE_FRUTA_EN_PEDIDO } from '../../../redux/slices/pedidoSlice';


interface ITablePalletProps {
  fruta?: number | null
  setFruta?: Dispatch<SetStateAction<number | null>>
}

const TablaPalletProductoTerminado: FC<ITablePalletProps> = ({ setFruta }) => {
  const columnHelper = createColumnHelper<TPalletProductoTerminadoMIN>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const { pathname } = useLocation()

   const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

	const todos_pallets_productos_terminados = useAppSelector((state: RootState) => state.embalaje.todos_los_pallets_productos_terminados)

  const pallets_seleccionados_fruta_pedido = useAppSelector((state: RootState) => state.pedidos.pallet_en_fruta_pedido)


  useEffect(() => {
    //@ts-ignore
    dispatch(fetchTodosPalletsProductoTerminados({ token, verificar_token: verificarToken }))
  }, [])


  const columns = [
    columnHelper.accessor('codigo_pallet', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.codigo_pallet}`}
        </div>
      ),
      header: 'Código Pallet'
    }),
		columnHelper.accessor('calidad', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calidad}`}
        </div>
      ),
      header: 'Calidad'
    }),
		
		columnHelper.accessor('calibre', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calibre}`}
        </div>
      ),
      header: 'Calibre'
    }),
		columnHelper.accessor('variedad', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {info.row.original.variedad}
        </div>
      ),
      header: 'Variedad'
    }),
    columnHelper.accessor('cantidad_cajas', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.cantidad_cajas}`}
        </div>
      ),
      header: 'Cantidad Cajas'
    }),
    columnHelper.accessor('peso_pallet', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.peso_pallet}`}
        </div>
      ),
      header: 'Peso Pallet'
    }),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const [openDetailModal, setOpenDetailModal] = useState<boolean>(false)
        const isSelected = pallets_seleccionados_fruta_pedido.some(pallet => pallet.id === info.row.original.id)

				return (
					<div className='flex justify-center flex-wrap gap-4'>
						{
              !(pathname.includes('pedido-interno') || pathname.includes('pedido-exportacion') || pathname.includes('guia-salida'))
                ? (
                  <Tooltip text='Detalle Pallet Producto Terminado'>
                    <ModalForm
                      variant='solid'
                      open = {openDetailModal}
                      setOpen={setOpenDetailModal}
                      icon={<HeroEye style={{ fontSize: 25 }}/>}
                      size={800}
                      title={`Historial del Pallet Producto Terminado ${info.row.original.codigo_pallet}`}
                      >
                        <DetallePalletProductoTerminado id_pallet = {info.row.original.id}/>
                    </ModalForm>
                  </Tooltip>
                      )
                : (
                  <>
                  {
                    isSelected 
                      ? (
                        <Button
                          variant='solid'
                          color='red'
                          colorIntensity='600'
                          onClick={() => {
                            dispatch(QUITAR_PALLE_FRUTA_EN_PEDIDO(info.row.original.id))
                          }}
                        >
                          <HeroXMark style={{ fontSize: 25 }}/>
                        </Button>
                      )
                      : pallets_seleccionados_fruta_pedido.length === 0
                          ? (
                            <Button
                              variant='solid'
                              color='emerald'
                              colorIntensity='600'
                              onClick={() => {
                                dispatch(AÑADADIR_PALLET_FRUTA_EN_PEDIDO(info.row.original))
                                setFruta!(info.row.original.id)
                              }}
                            >
                              <HeroPlus style={{ fontSize: 25 }}/>
                            </Button>
                              
                            )
                          : null
                  }
                  </>
                )
            }
					</div>
				)},
			header: 'Acciones'
			})
  ]

  const table = useReactTable({
    data: todos_pallets_productos_terminados,
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
    <PageWrapper name='Lista Guia Patio'>
      <Subheader>
        <SubheaderLeft>
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
              placeholder='Busca una guía...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
      </Subheader>
      <Container breakpoint={null} className="w-full ">
        <Card className='w-full h-full'>
          <CardHeader>
            <CardTitle>Pallet Producto Terminado</CardTitle>
          </CardHeader>
          <CardBody className='overflow-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  )
};


export default TablaPalletProductoTerminado


