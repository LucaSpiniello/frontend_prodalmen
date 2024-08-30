import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { TSubproducto } from '../../../../../types/TypesSeleccion.type';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiXCircle } from 'react-icons/bi';
import ModalForm from '../../../../../components/ModalForm.modal';
import { fetchWithTokenPost } from '../../../../../utils/peticiones.utils';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GUARDAR_SUBPRODUCTO_EN_LISTA, QUITAR_BIN_SELECCION, QUITAR_SUBPRODUCTO_EN_AGRUPACION, VACIAR_TABLA, fetchBinsPepaCalibrada, fetchTarjasSeleccionadas } from '../../../../../redux/slices/seleccionSlice';
import Button from '../../../../../components/ui/Button';
import ModalConfirmacion from '../../../../../components/ModalConfirmacion';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';




const TablaSubProductoABinBodega = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [openButton, setOpenButton] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [seleccionConfirm, setSeleccionConfirm] = useState(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const subproductos_a_agrupar = useAppSelector((state: RootState) => state.seleccion.subproductos_para_agrupar)


  useEffect(() => {
    dispatch(VACIAR_TABLA())
  }, [])

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxSeleccionados(prevState => {
      // Si se está marcando un checkbox, desmarca todos los demás
      const newState = { [id]: checked };
      if (checked) {
        for (const key in prevState) {
          if (key !== id) {
            newState[key] = false;
          }
        }
      }
      return newState;
    });
  };

  useEffect(() => {
    // Actualiza los filtros de columna solo cuando cambian los checkboxes seleccionados
    const newColumnFilters = Object.entries(checkboxSeleccionados)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => ({ id: 'binbodega', value: id }));
    setColumnFilters(newColumnFilters);
  }, [checkboxSeleccionados]);

  const columnHelper = createColumnHelper<TSubproducto>();

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      cell: (info) => (
          <div className='font-bold text-center'>
            {`${info.row.original.id}`}
          </div>
        ),
        header: 'N° SubProducto',
      }), 
      columnHelper.accessor('operario_nombres', {
        cell: (info) => (
          <div className='font-bold text-center'>
            {`${info.row.original.operario_nombres}`}
          </div>
        ),
        header: 'Nombre Operario',
      }),
      columnHelper.accessor('tipo_subproducto_label', {
        cell: (info) => (
          <div className='font-bold text-center'>
            <span>{`${info.row.original.tipo_subproducto_label}`}</span>
          </div>
        ),
        header: 'Tipo SubProducto',
		  }),
      columnHelper.accessor('peso', {
        id: 'peso',
        cell: (info) => (
          <div className='font-bold '>
            <span>{`${info.row.original.peso}`}</span>
          </div>
        ),
        header: 'Peso',
		  }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => {
          const id = info.row.original.id;
        
          return (
            <div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>
  
                <Tooltip text='Agregar A SubProducto'>
                  <Button
                    variant='solid'
                    onClick={() => {
                      dispatch(QUITAR_SUBPRODUCTO_EN_AGRUPACION(info.row.original.id))
                      dispatch(GUARDAR_SUBPRODUCTO_EN_LISTA(info.row.original))
                    }}
                    className='w-full rounded-md h-12 bg-red-600 hover:bg-red-500 border-none flex items-center justify-center p-2 hover:scale-105'>
                    <BiXCircle style={{ fontSize: 35, color: 'white' }}/>
                  </Button>
                </Tooltip>
            
  
            </div>
          );
        },
        header: 'Acciones'
      }),
	];
  
  const table = useReactTable({
    data: subproductos_a_agrupar,
		columns,
		state: {
			sorting,
			globalFilter,
      columnFilters
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


  const agregarBinASeleccion = async () => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/binsubproductoseleccion/${id}/agrupar_subproductos/`, 
      {"subproductos": subproductos_a_agrupar}, token_verificado)
    if (response.ok){
      toast.success('Bins fueron ingresados exitosamente!!')
      //@ts-ignore
      dispatch(fetchBinsPepaCalibrada({ token, verificar_token: verificarToken }))
      // navigate(`/seleccion/programa/${id}/`, { replace: true })
    } else {
      toast.error('No se pudieron ingresar los bines')
    }
  }

  useEffect(() => {
    if (seleccionConfirm){
      agregarBinASeleccion()
    }
  }, [seleccionConfirm])


  

  return (
    <Container breakpoint={null} className='w-full overflow-auto p-0'>
				<Card className='h-full w-full p-0'>
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
                placeholder='Busca programa...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>

            {
              subproductos_a_agrupar.length >= 1
                ? (
                  <ModalForm
                    open={openButton}
                    setOpen={setOpenButton}
                    textTool='Agregar A Programa'
                    variant="solid"
                    width={`w-56 h-12 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105 border-none`}
                    textButton={`Agregar a Programa N° ${id}`}
                  >
                    <ModalConfirmacion 
                      mensaje='¿Estas seguro de agregar estos bines a selección?'
                      confirmacion={seleccionConfirm}
                      setConfirmacion={setSeleccionConfirm}
                      setOpen={setOpenButton} 
                      />
                  </ModalForm>
                  )
                : null
            }
          </CardHeader>
					<CardBody className='overflow-x-auto'>
            
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaSubProductoABinBodega;


