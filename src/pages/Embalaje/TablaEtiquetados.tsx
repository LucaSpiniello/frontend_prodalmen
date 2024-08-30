import { ThunkDispatch } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/authContext';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import ModalForm from '../../components/ModalForm.modal';
import Container from '../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../templates/common/TableParts.template';
import Button from '../../components/ui/Button';
import { fetchWithTokenDelete } from '../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { HeroXMark } from '../../components/icon/heroicons';
import { TEtiquetado } from '../../types/TypesEmbalaje.type';
import FormularioEtiqueta from './Formularios/FormularioEtiquetado';
import { fetchEtiquetasEmbalaje } from '../../redux/slices/embalajeSlice';
import Tooltip from '../../components/ui/Tooltip';

const TablaTiposEmbajales = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()
	const [openModal, setOpenModal] = useState<boolean>(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const etiquetas = useAppSelector((state: RootState) => state.embalaje.etiquetas)

  // function downloadAndClose(url: string) {
  //   // Abrir una nueva pestaña
  //   const newTab = window.open('', '_blank');
  
  //   if (newTab) {
  //       // Crear un enlace temporal
  //       const tempLink = newTab.document.createElement('a');
  //       tempLink.href = url;
  //       tempLink.download = '';
  
  //       // Agregar el enlace temporal al documento de la nueva pestaña
  //       newTab.document.body.appendChild(tempLink);
  
  //       // Forzar la descarga
  //       tempLink.click();
  
  //       // Eliminar el enlace temporal
  //       newTab.document.body.removeChild(tempLink);
  
  //       // Cerrar la nueva pestaña
  //       newTab.close();
  //   } else {
  //       console.error('No se pudo abrir la nueva pestaña.');
  //   }
  // }

  useEffect(() => {
    dispatch(fetchEtiquetasEmbalaje({ token, verificar_token: verificarToken }))
  }, [token])

  const eliminacion_etiqueta = async (id: number) => {
    const token_verificado = await verificarToken(token)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenDelete(`api/etiqueta_embalaje/${id}/`, token_verificado)
    if (res.ok){
      toast.success('Eliminado exitosamente')
      dispatch(fetchEtiquetasEmbalaje({ token, verificar_token: verificarToken }))
    } else {
      toast.error('No se pudo eliminar')
    }
  }

  const columnHelper = createColumnHelper<TEtiquetado>();
	const columns = [
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.nombre}`}
				</div>
			),
			header: 'Nombre',
		}),
    columnHelper.accessor('archivo_impresora_cajas', {
			cell: (info) => (
				<div className='font-bold'>
          <Tooltip text='Descargar'>
					  <Button variant='solid' onClick={() => {
              // downloadAndClose(info.row.original.archivo_impresora_cajas)
              window.open(info.row.original.archivo_impresora_cajas)
              }}>{info.row.original.archivo_impresora_cajas && info.row.original.archivo_impresora_cajas.split('/etiquetas/')[1]}</Button>
          </Tooltip>
				</div>
			),
			header: 'Archivo Impresora Cajas',
		}),
    columnHelper.accessor('archivo_impresora_termica', {
			cell: (info) => (
				<div className='font-bold'>
					<Tooltip text='Descargar'>
					  <Button variant='solid' onClick={() => {
              // downloadAndClose(info.row.original.archivo_impresora_termica)
              window.open(info.row.original.archivo_impresora_termica)
              }}>{info.row.original.archivo_impresora_termica && info.row.original.archivo_impresora_termica.split('/etiquetas/')[1]}</Button>
          </Tooltip>
				</div>
			),
			header: 'Archivo Impresora Termica',
		}),
    columnHelper.display({
      id: 'acciones',
			cell: (info) => (
				<div className='flex items-center justify-center'>
          <Button
            variant='solid'
            color='red'
            onClick={() => eliminacion_etiqueta(info.row.original.id)}
            >
              <HeroXMark style={{ fontSize: 25 }}/>
          </Button>
        </div>
			),
			header: 'Acciones',
		})
  ]

  const table = useReactTable({
    data: etiquetas,
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
              placeholder='Busca etiqueta...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <ModalForm
            open={openModal}
            setOpen={setOpenModal}
            title='Registro Tipo Etiqueta'
            variant='solid'
            textButton='Agregar Tipo Etiqueta'
            size={900}
            color='blue'
            colorIntensity='700'
            width={`w-full py-3 hover:scale-105`}
          >
            <FormularioEtiqueta setOpen={setOpenModal}/>
          </ModalForm>
        </SubheaderRight>
      </Subheader> 
      <Container breakpoint={null} className="w-full">
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Etiquetas</CardTitle>
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
