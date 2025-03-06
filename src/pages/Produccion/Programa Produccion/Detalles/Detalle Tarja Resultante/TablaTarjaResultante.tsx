import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {  TTarjaResultante } from '../../../../../types/TypesProduccion.types';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { useAuth } from '../../../../../context/authContext';
import { GUARDAR_TARJA, fetchProgramaProduccion, fetchTarjasResultantes } from '../../../../../redux/slices/produccionSlice';
import { Link, useLocation, useParams } from 'react-router-dom';
import { format } from '@formkit/tempo';
import Tooltip from '../../../../../components/ui/Tooltip';
import { HeroEye, HeroXMark } from '../../../../../components/icon/heroicons';
import FormularioControlCalidadTarja from '../../Formularios/FormularioControlCalidadTarja';
import ModalForm from '../../../../../components/ModalForm.modal';
import { BiCheckDouble } from 'react-icons/bi';
import { fetchWithTokenPatch, fetchWithTokenPut } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { RiErrorWarningFill } from 'react-icons/ri';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import Button from '../../../../../components/ui/Button';
import { IoIosBarcode } from 'react-icons/io';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';



const TablaTarjaResultante = () => {
  const { id } = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const tarjas_resultantes = useAppSelector((state: RootState) => state.programa_produccion.tarjas_resultantes)
  const produccion = useAppSelector((state: RootState) => state.programa_produccion.programa)
  const { pathname } = useLocation()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  // useEffect(() => {
  //     dispatch(fetchTarjasResultantes({ id: parseInt(id!), token, verificar_token: verificarToken }))
  //     dispatch(fetchProgramaProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
  // }, [])

  const eliminarTarja = async (id_lote: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/produccion/${id}/tarjas_resultantes/eliminar_tarja/`, 
      {
        id: id_lote,
        produccion: id,
        esta_eliminado: true
      },
      token_verificado
    )

    if (res.ok){
      toast.success("Tarja Eliminada Correctamente")
      dispatch(fetchTarjasResultantes({ id:  parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      
      setOpen(false)
    } else {
      toast.error("No se pudo eliminar la tarja, vuelve a intentarlo")
    }
  }

  const reemprimirEtiqueta = async (id_lote: number) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/produccion/${id}/tarjas_resultantes/${id_lote}/reemprimir_etiqueta/`,
        {
          cc_tarja: true,
          produccion: id
        },
        token_verificado
      )
    }

  const columnHelper = createColumnHelper<TTarjaResultante>();
  const columns = [
		columnHelper.accessor('codigo_tarja',{
      id: 'codigo_tarja',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.codigo_tarja}`}
				</div>
			),
			header: 'Código Tarja',
		}),
    columnHelper.accessor('peso',{
      id: 'peso_neto',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${(row?.peso! - row?.tipo_patineta!)?.toLocaleString()}`}
          </div>
        )
      },
			header: 'Peso Neto',
		}),
    columnHelper.accessor('tipo_patineta_label',{
      id: 'tipo_patineta',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${row.tipo_patineta_label}`}
          </div>
        )
      },
			header: 'Tipo Patineta',
		}),
    columnHelper.accessor('variedad',{
      id: 'variedad',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${row.variedad}`}
          </div>
        )
      },
			header: 'Variedad',
		}),
    columnHelper.accessor('fecha_creacion',{
      id: 'fecha_creacion',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${format(row?.fecha_creacion!, { date: 'short', time: 'short' }, 'es')}`}
          </div>
        )
      },
			header: 'Fecha Creción',
		}),
    columnHelper.display({
      id: 'actions',
			cell: (info) => {
        const row = info.row.original
        const [openModalCCTarja, setOpenModalCCTarja] = useState(false)

        return (
          <div className='w-full h-full flex justify-center flex-wrap gap-2'>
            {
            row?.cc_tarja
              ? (
                <>
                  <Button
                    title='Envase Procesado En Producción'
                    variant='solid'
                    color='emerald'
                    className='w-20 border-none rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <BiCheckDouble style={{ fontSize: 35 }}/>
                  </Button>

                  <Link to={`/cdc/cpro/tarjas-cc/${row.id}/`} state={{ pathname: pathname }}>
                    <Button
                      title='Detalle Control Calidad Tarja Seleccionada'
                      variant='solid'
                      color='blue'
                      className='w-20 border-none rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'
                      >
                        <HeroEye style={{ fontSize: 35 }}/>
                    </Button>
                  </Link>

                  <Button
                    title='Generación de código'
                    variant='solid'
                    color='sky'
                    className='w-20 border-none rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'
                    onClick={() => reemprimirEtiqueta(row?.id)}
                    >
                      <IoIosBarcode  style={{ fontSize: 35 }}/>
                  </Button>
                </>
                )
              : !(produccion?.estado === '5' || !['2', '4'].includes(produccion?.estado!))
                ? (
                  <ModalForm
                    open={openModalCCTarja}
                    setOpen={setOpenModalCCTarja}
                    textTool='CC Tarja Resultante'
                    title='Control Calidad Tarja Resultante'
                    variant='solid'
                    color='amber'
                    icon={<RiErrorWarningFill style={{ fontSize: 35 }}/>}
                    size={900}
                    width={`w-20 rounded-md h-12 flex text-white items-center justify-center p-2 hover:scale-105`}
                    >
                      <FormularioControlCalidadTarja id_lote={row?.id} isOpen={setOpenModalCCTarja} tipo_resultante={row?.tipo_resultante_label}/>
                  </ModalForm>
                  )
                : null
          }
          {
            //@ts-ignore
              !info.row.original.cc_tarja && (['2'].includes(produccion?.estado!))
                ? (
                  <>
                    <Button
                      variant='solid'
                      color='red'
                      onClick={() => eliminarTarja(row?.id)}
                      className='w-20 h-12 text-white'
                      >
                        <HeroXMark style={{ fontSize: 35 }}/>
                    </Button>
                  </>
                )
                : null
            }
            <>
          </>
          
        </div>
        )
      },
			header: 'Acciones',
		})
  ]

  const table = useReactTable({
		data: tarjas_resultantes,
    columns,
		state: {
			sorting,
			globalFilter,
		},
    enableRowSelection: true,
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

  const columnas: TableColumn[] = [
    { id: 'codigo_tarja', header: '', className: 'w-auto md:w-36 lg:w-auto' },
    { id: 'peso_neto', header: '', className: 'md:w-32 lg:w-auto' },
    { id: 'tipo_patineta', header: '', className: 'md:w-44 lg:w-auto' },
    { id: 'variedad', header: '', className: 'md:w-36 text-center lg:w-auto' },
    { id: 'fecha_creacion', header: '', className: 'md:w-44 text-center lg:w-auto' },
  ]
  

  return (
    <Container className='w-full !p-0'>
      <Card>
        <CardHeader>
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
              placeholder='Busca Tarja...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </CardHeader>
        <CardBody className='overflow-x-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  );
};

export default TablaTarjaResultante;
