import React, { useEffect, useState } from 'react'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template'
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { TCuentasCorrientes, TRepresentantes } from '../../../../types/TypesRegistros.types'
import FormularioResponsableLegal from '../Formularios/Cliente Interno/FormularioResponsableLegal'
import ModalForm from '../../../../components/ModalForm.modal'
import { useAuth } from '../../../../context/authContext'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { fetchRepresentantes } from '../../../../redux/slices/clientes'

const DetalleRepresentantes = () => {
  const columnHelper = createColumnHelper<TRepresentantes>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)
  const representantes = useAppSelector((state: RootState) => state.clientes.representantes_legales_cliente)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState<boolean>(false)
  const [IDCuenta, setIDCuenta] = useState<number | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchRepresentantes({ params: { rut: cliente?.rut_cliente }, token, verificar_token: verificarToken }))
  }, [])

  const columns = [
    columnHelper.accessor('nombres', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.nombres}`}
        </div>
      ),
      header: 'Nombres'
    }),
    columnHelper.accessor('apellidos', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.apellidos}`}
        </div>
      ),
      header: 'Apellidos'
    }),
    columnHelper.accessor('telefono', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.telefono}`}
        </div>
      ),
      header: 'Telefono'
    }),
    columnHelper.accessor('direccion', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.direccion}`}
        </div>
      ),
      header: 'Dirección'
    }),
    columnHelper.accessor('email', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.email}`}
        </div>
      ),
      header: 'Email'
    }),
  ]


  const table = useReactTable({
    data: representantes,
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
          <CardTitle>Representantes</CardTitle>
          <ModalForm
            open={openModal}
            setOpen={setOpenModal}
            variant='solid'
            width='w-auto hover:scale-105'
            textButton={'Agregar Responsable Legal'}
            title={'Agregar Responsable Legal'}
            size={800}
            >
              <FormularioResponsableLegal setOpen={setOpenModal} />
          </ModalForm>
        </CardHeader>
        <CardBody className='overflow-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default DetalleRepresentantes
