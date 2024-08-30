import React, { useEffect, useState } from 'react'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template'
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { TCuentasCorrientes } from '../../../../types/TypesRegistros.types'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { fetchCuentasCorrientes } from '../../../../redux/slices/clientes'
import ModalForm from '../../../../components/ModalForm.modal'
import FormularioCuentaCorriente from '../Formularios/Cliente Interno/FormularioCuentaCorriente'

const DetalleCuentasCorrientes = () => {
  const columnHelper = createColumnHelper<TCuentasCorrientes>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)
  const cuentas_corrientes = useAppSelector((state: RootState) => state.clientes.cuentas_corrientes_cliente)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchCuentasCorrientes({ params: { rut: cliente?.rut_cliente }, token, verificar_token: verificarToken }))
  }, [])


  const columns = [
    columnHelper.accessor('numero_cuenta', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.numero_cuenta}`}
        </div>
      ),
      header: 'Número Cuenta'
    }),
    columnHelper.accessor('banco_nombre', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.banco_nombre}`}
        </div>
      ),
      header: 'Banco'
    }),
    columnHelper.accessor('tipo_cuenta_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_cuenta_label}`}
        </div>
      ),
      header: 'Tipo Cuenta'
    }),
  ]


  const table = useReactTable({
    data: cuentas_corrientes,
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
          <CardTitle>Cuentas Corrientes</CardTitle>
          <ModalForm
            open={openModal}
            setOpen={setOpenModal}
            variant='solid'
            width='w-auto hover:scale-105'
            textButton={'Agregar Cuenta Corriente'}
            title={'Agregar Cuenta Corriente'}
            size={800}
            >
              <FormularioCuentaCorriente setOpen={setOpenModal} />
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

export default DetalleCuentasCorrientes
