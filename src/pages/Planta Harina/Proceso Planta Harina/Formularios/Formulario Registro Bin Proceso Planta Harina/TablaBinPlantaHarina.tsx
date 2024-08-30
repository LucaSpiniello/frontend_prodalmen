import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { TBinBodega } from '../../../../../types/TypesSeleccion.type';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../../components/ui/Tooltip';
import {BiXCircle } from 'react-icons/bi';
import ModalForm from '../../../../../components/ModalForm.modal';
import {fetchWithTokenPost } from '../../../../../utils/peticiones.utils';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchBinsPepaCalibrada } from '../../../../../redux/slices/seleccionSlice';
import Button from '../../../../../components/ui/Button';
import { AGREGAR_BIN_BODEGA } from '../../../../../redux/slices/bodegaSlice';
import ModalConfirmacion from '../../../../../components/ModalConfirmacion';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchBinEnProcesoPlantaHarina, LIMPIAR_BINS_PARA_PROCESO_PLANTA_HARINA, QUITAR_BIN_PARA_PROCESO_PLANTA_HARINA } from '../../../../../redux/slices/procesoPlantaHarina';
import { HeroXMark } from '../../../../../components/icon/heroicons';


const TablaBinProcesoPlantaHarina = ({refresh, setRefresh} : {refresh:boolean, setRefresh: Dispatch<SetStateAction<boolean>>}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [openButton, setOpenButton] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [seleccionConfirm, setSeleccionConfirm] = useState(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const bins_para_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.bins_para_proceso_planta_harina)


  useEffect(() => {
    dispatch(LIMPIAR_BINS_PARA_PROCESO_PLANTA_HARINA())
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

  const columnHelper = createColumnHelper<TBinBodega>();

  const columns = [
    columnHelper.accessor('binbodega', {
      cell: (info) => (
          <div className='font-bold text-center'>
            {`${info.row.original.binbodega}`}
          </div>
        ),
        header: 'Código Tarja',
      }),
      columnHelper.accessor('programa', {
        cell: (info) => (
          <div className='font-bold text-center'>
            {`Programa N° ${info.row.original.programa}`}
          </div>
        ),
        header: 'Programa',
      }),
      columnHelper.accessor('variedad', {
        cell: (info) => (
          <div className='font-bold text-center'>
            <span>{`${info.row.original.variedad}`}</span>
          </div>
        ),
        header: 'Variedad',
		  }),
      columnHelper.accessor('calibre', {
        cell: (info) => (
          <div className='font-bold text-center'>
            <span>{`${info.row.original.calibre}`}</span>
          </div>
        ),
        header: 'Calibre',
		  }),
      columnHelper.accessor('kilos_bin', {
        cell: (info) => (
          <div className='font-bold text-center'>
            {`${info.row.original.kilos_bin}`}
          </div>
        ),
        header: 'Kilos Fruta',
		  }),columnHelper.display({
        id: 'actions',
        cell: (info) => {
          const id = info.row.original.id;
        
          return (
            <div className='w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>
  
                <Tooltip text='Agregar A Proceso Planta Harina'>
                  <Button
                    variant='solid'
                    color='red'
                    colorIntensity='700'
                    onClick={() => {
                      dispatch(QUITAR_BIN_PARA_PROCESO_PLANTA_HARINA(id))
                      // dispatch(AGREGAR_BIN_BODEGA(info.row.original))
                      setRefresh(refresh)
                    }}
                    
                    className='hover:scale-105'>
                    <HeroXMark style={{ fontSize: 25, color: 'white' }}/>
                  </Button>
                </Tooltip>
            
  
            </div>
          );
        },
        header: 'Acciones'
      }),
	];
  
  const table = useReactTable({
    data: bins_para_proceso_planta_harina,
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

  const agregarBinAProceso = async () => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/procesos/${id}/bines-para-proceso/registrar_bins/`, 
      {"bins": bins_para_proceso_planta_harina}, token_verificado)
    if (response.ok){
      toast.success('Bins fueron ingresados exitosamente!!')
      dispatch(fetchBinEnProcesoPlantaHarina({ token, verificar_token: verificarToken, id }))
      navigate(`/ph/ph-proc/${id}/`, { replace: true })
    } else {
      toast.error('No se pudieron ingresar los bines')
    }
  }

  useEffect(() => {
    if (seleccionConfirm){
      agregarBinAProceso()
    }
  }, [seleccionConfirm])

  const columnas: TableColumn[] = [
    // { id: 'peso', header: 'Fruta Neta', className: 'w-32' },
    // { id: 'id', header: 'Código Tarja', className: 'w-40' },
    { id: 'actions', header: '', className: 'w-28' },
    { id: 'kilos_bin', header: '', className: 'w-32' },
    { id: 'calibre', header: '', className: 'w-32' },
  ]

  

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
                placeholder='Busca bin...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>

            {
              bins_para_proceso_planta_harina.length >= 1
                ? (
                  <ModalForm
                    open={openButton}
                    setOpen={setOpenButton}
                    textTool='Agregar A Proceso Planta Harina'
                    variant="solid"
                    color='blue'
                    colorIntensity='700'
                    width={`w-auto hover:scale-105`}
                    textButton={`Agregar A Proceso Planta Harina N° ${id}`}
                  >
                    <ModalConfirmacion 
                      mensaje={`¿Estas seguro de agregar estos bines al Proceso Planta Harina N° ${id}?`}
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
            
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaBinProcesoPlantaHarina;


