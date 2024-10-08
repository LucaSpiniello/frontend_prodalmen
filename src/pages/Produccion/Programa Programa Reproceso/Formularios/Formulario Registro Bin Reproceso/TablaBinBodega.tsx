import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { TBinBodega, TTarjaSeleccionada } from '../../../../../types/TypesSeleccion.type';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiCheckDouble, BiPlus, BiPlusCircle } from 'react-icons/bi';
import ModalForm from '../../../../../components/ModalForm.modal';
import { RiErrorWarningFill } from 'react-icons/ri';
import { fetchWithTokenPatch } from '../../../../../utils/peticiones.utils';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HeroXMark } from '../../../../../components/icon/heroicons';
import { GUARDAR_BIN_SELECCION, VACIAR_TABLA, fetchTarjasSeleccionadas } from '../../../../../redux/slices/seleccionSlice';
import Button from '../../../../../components/ui/Button';
import Checkbox, { CheckboxGroup } from '../../../../../components/form/Checkbox';
import { QUITAR_BIN_BODEGA, fetchBinBodega, listaBinBodegaFiltroThunk } from '../../../../../redux/slices/bodegaSlice';
import { GUARDAR_BIN_REPROCESO } from '../../../../../redux/slices/reprocesoSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Label from '../../../../../components/form/Label';
import SelectReact from '../../../../../components/form/SelectReact';
import { optionsBodegas, optionsBodegasB, optionsCalibres, optionsVariedad } from '../../../../../utils/options.constantes';



const TablaBinBodegaReproceso = ({refresh} : {refresh: boolean}) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [filtroBodega, setFiltroBodega] = useState<string>('')
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const bin_bodega_g1_g2 = useAppSelector((state: RootState) => state.bodegas.bin_bodega)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [listaBins, setListaBins] = useState<TBinBodega[]>([])
  const nuevo_bin_reproceso = useAppSelector((state: RootState) => state.reproceso.nuevos_bin_reproceso)


  useEffect(() => {
    // dispatch(fetchBinBodega({ params: { search: !filtroBodega ? 'g1,g2' : filtroBodega }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: !filtroBodega ? 'g1,g2' : filtroBodega}))
  }, [filtroBodega, refresh])

  useEffect(() => {
    const lista: TBinBodega[] = []
    if (bin_bodega_g1_g2 && bin_bodega_g1_g2.length > 0) {
      bin_bodega_g1_g2.forEach((element) => {
        if (nuevo_bin_reproceso.find(bin => bin.id === element.id)) {
        } else {
          lista.push(element)
        }
      })
      setListaBins(lista)
    } else if (bin_bodega_g1_g2 && bin_bodega_g1_g2.length === 0) {
      setListaBins([])
    }
  }, [bin_bodega_g1_g2])

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

  useEffect(() => {
    dispatch(VACIAR_TABLA())
  }, [])

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
            <div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>
  
                <Tooltip text='Agregar A Reproceso'>
                  <Button
                    variant='solid'
                    onClick={() => {
                      dispatch(QUITAR_BIN_BODEGA(info.row.original.id))
                      dispatch(GUARDAR_BIN_REPROCESO(info.row.original))
                    }}
                    className='w-full rounded-md h-12 bg-green-600 hover:bg-green-500 border-none flex items-center justify-center p-2 hover:scale-105'>
                    <BiPlusCircle style={{ fontSize: 35, color: 'white' }}/>
                  </Button>
                </Tooltip>
            
  
            </div>
          );
        },
        header: 'Acciones'
      }),
	];
  
  const table = useReactTable({
    data: listaBins ,
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

            <div className='w-full flex flex-col md:flex-row lg:flex-row justify-between gap-3'>
              <div className="w-full flex-col">
                <Label htmlFor="bodega">Bodegas: </Label>
                <SelectReact
                    options={[
                      { value: '', label: 'Selecciona una bodega' },
                      { value: 'g1', label: 'Bodega G1' },
                      { value: 'g2', label: 'Bodega G2' },
                    ]}
                    id='bodega'
                    placeholder='Seleccione una bodega'
                    name='bodega'
                    className='w-full py-2'
                    onChange={(value: any) => {
                      setFiltroBodega(value.value)
                    }}
                  />
              </div>

              <div className="w-full flex-col">
                <Label htmlFor="calle">Variedad: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona una variedad' }, ...optionsVariedad]}
                    id='variedad'
                    placeholder='Seleccione una variedad'
                    name='variedad'
                    className='w-full py-2'
                    onChange={(value: any) => {
                      setGlobalFilter(value.value)
                    }}
                  />
              </div>

              <div className="w-full flex-col">
                <Label htmlFor="calle">Calibre: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona un calibre' }, ...optionsCalibres]}
                    id='calibre'
                    placeholder='Seleccione un calibre'
                    name='calibre'
                    className='w-full py-2'
                    onChange={(value: any) => {
                      setGlobalFilter(value.value)
                    }}
                  />
              </div>
            </div>
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaBinBodegaReproceso;


