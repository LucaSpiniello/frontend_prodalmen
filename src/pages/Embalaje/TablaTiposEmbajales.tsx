import { ThunkDispatch } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/authContext';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { TTipoEmbalaje } from '../../types/TypesPedidos.types';
import { format } from '@formkit/tempo';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import ModalForm from '../../components/ModalForm.modal';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../templates/common/TableParts.template';
import FormularioTipoEmbalaje from './Formularios/FormularioTipoEmbalaje';
import Button from '../../components/ui/Button';
import { fetchWithTokenDelete } from '../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { HeroXMark } from '../../components/icon/heroicons';
import { fetchTipoEmbalaje } from '../../redux/slices/embalajeSlice';

const TablaTiposEmbajales = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const [openModal, setOpenModal] = useState<boolean>(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const tipo_embalaje = useAppSelector((state: RootState) => state.embalaje.tipo_embalaje)

  useEffect(() => {
    dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
  }, [token])

  const eliminacion_tipo_tarja = async (id: number) => {
    const token_verificado = await verificarToken(token)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenDelete(`api/tipo_embalaje/${id}/`, token_verificado)
    if (res.ok){
      toast.success('Eliminado exitosamente')
      dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
    } else {
      toast.error('No se pudo eliminar')
    }
  }

  const columnHelper = createColumnHelper<TTipoEmbalaje>();
	const columns = [
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.nombre}`}
				</div>
			),
			header: 'Nombre',
		}),
    columnHelper.accessor('peso', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.peso}`}
				</div>
			),
			header: 'Peso',
		}),
    columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>
					{`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short'}, 'es' )}`}
				</div>
			),
			header: 'Fecha Creación',
		}),
    columnHelper.display({
      id: 'acciones',
			cell: (info) => (
				<div className='flex items-center justify-center'>
          <Button
            variant='solid'
            color='red'
            onClick={() => eliminacion_tipo_tarja(info.row.original.id)}
            >
              <HeroXMark style={{ fontSize: 25 }}/>
          </Button>
        </div>
			),
			header: 'Acciones',
		})
  ]

  const table = useReactTable({
    data: tipo_embalaje,
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
    <PageWrapper name='Lista Tipos Embalaje'>
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
              placeholder='Busca al operario...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <ModalForm
            open={openModal}
            setOpen={setOpenModal}
            title='Registro Tipo Embalaje'
            variant='solid'
            textButton='Agregar Tipo Embalaje'
            size={900}
            color='blue'
            colorIntensity='700'
            width={`w-full py-3 hover:scale-105`}
          >
            <FormularioTipoEmbalaje setOpen={setOpenModal}/>
          </ModalForm>
        </SubheaderRight>
      </Subheader> 
      <Container breakpoint={null} className="w-full">
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Tipo Embalajes</CardTitle>
          </CardHeader>
          <CardBody className='overflow-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default TablaTiposEmbajales
