import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react'
import { TInventarios } from '../../../types/TypesBodega.types';
import Button from '../../../components/ui/Button';
import { HeroEye } from '../../../components/icon/heroicons';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../components/layouts/Subheader/Subheader';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import ModalForm from '../../../components/ModalForm.modal';
import FormularioInventario from './FormularioInventario';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useAuth } from '../../../context/authContext';
import { fetchInventarios } from '../../../redux/slices/bodegaSlice';
import { useNavigate } from 'react-router-dom';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown';
import { BODEGAS, CALLES_BODEGA_G4 } from '../../../utils/constante';
import { HiDatabase } from 'react-icons/hi';
import { FaFilePdf } from 'react-icons/fa';
import Tooltip from '../../../components/ui/Tooltip';

const TablaInventarios = () => {
  const columnHelper = createColumnHelper<TInventarios>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const inventarios = useAppSelector((state: RootState) => state.bodegas.inventarios)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchInventarios({ token, verificar_token: verificarToken }))
  }, [])


  const columns = [
    columnHelper.accessor('tipo_inventario_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_inventario_label}`}
        </div>
      ),
      header: 'Tipo de Inventario'
    }),
    columnHelper.accessor('bodegas', {
      cell: (info) => {
        const valores = info.row.original.bodegas.split(',')
        return (
          <>
            { info.row.original.tipo_inventario === '1' || info.row.original.tipo_inventario === '4' ?
              <div className='font-bold'>{BODEGAS.find(element => element.value === info.row.original.bodegas)?.label}</div>
            : info.row.original.tipo_inventario === '3' ?
              <div className="font-bold">Todas las Bodegas</div>
            :
              <Dropdown>
                  <DropdownToggle>
                    <Button variant='solid' color='blue'>Bodegas</Button>
                  </DropdownToggle>
                  <DropdownMenu>
                    { valores.map((bodega, index) => (
                      <DropdownItem key={index} className={`text-base dark:text-white text-black`}><HiDatabase /> {BODEGAS.find(element => element.value === bodega)?.label} </DropdownItem>
                    ))}
                  </DropdownMenu>
              </Dropdown>
            }
          </>
        )
      },
      header: 'Bodegas'
    }),
    columnHelper.accessor('calles', {
      cell: (info) => {
        const valores = info.row.original.calles.split(',')
        return (
          <>
            { info.row.original.tipo_inventario === '1' ?
              <div className='font-bold'>Todas las Calles de {BODEGAS.find(element => element.value === info.row.original.bodegas)?.label}</div>
              : info.row.original.tipo_inventario === '2' ?
                <Dropdown>
                  <DropdownToggle>
                    <Button variant='solid' color='blue'>Calles</Button>
                  </DropdownToggle>
                  <DropdownMenu>
                    { valores.map((calle, index) => (
                      <DropdownItem key={index} className={`text-base dark:text-white text-black`}><HiDatabase /> {CALLES_BODEGA_G4.find(element => element.value === calle)?.label} </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              : info.row.original.tipo_inventario === '3' ?
                <div className='font-bold'>Todas las Calles</div>
              : 
                <div className="font-bold">{CALLES_BODEGA_G4.find(element => element.value === info.row.original.calles)?.label}</div>
                
            }
          </>
        )
      },
      header: 'Calles'
    }),
    columnHelper.accessor('creado_por_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.creado_por_label}`}
        </div>
      ),
      header: 'Creado Por'
    }),
    columnHelper.display({
      id: 'acciones',
      cell: (info) => (
        <div className='font-bold w-full flex gap-2'>
          <Tooltip text='Detalle'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              onClick={() => navigate(`/bdg/acciones/inventario-bodega/${info.row.original.id}`, { state: { pathname: '/inventario-bodega'}})}
            >
              <HeroEye style={{ fontSize: 25 }}/>
            </Button>
          </Tooltip>
          { info.row.original.estado === '1' &&
            <>
              <Tooltip text='PDF Resumido'>
                <Button variant='solid' color="red" onClick={() => {navigate(`/bdg/acciones/inventario-bodega/${info.row.original.id}/pdf_resumido`)}}><FaFilePdf style={{ fontSize: 25 }} /></Button>
              </Tooltip>
              <Tooltip text='PDF Detallado'>
                <Button variant='solid' color="red" onClick={() => {navigate(`/bdg/acciones/inventario-bodega/${info.row.original.id}/pdf_detallado`)}}><FaFilePdf style={{ fontSize: 25 }} /></Button>
              </Tooltip>
            </>
          }
        </div>
      ),
      header: 'Acciones'
    }),
  ]

  const table = useReactTable({
    data: inventarios,
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
  <PageWrapper name='Lista Inventarios'>
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
            placeholder='Busca al inventario...'
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </FieldWrap>
      </SubheaderLeft>
      <SubheaderRight>
        <ModalForm
          open={openModal}
          setOpen={setOpenModal}
          title='Generar Inventario'
          variant='solid'
          color='blue'
          colorIntensity='700'
          textButton='Generar Inventario'
          size={900}
          width='hover:scale-105'
        >
          <FormularioInventario setOpen={setOpenModal} />
        </ModalForm>
      </SubheaderRight>
    </Subheader> 
    <Container breakpoint={null} className="w-full">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Inventarios</CardTitle>
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

export default TablaInventarios
