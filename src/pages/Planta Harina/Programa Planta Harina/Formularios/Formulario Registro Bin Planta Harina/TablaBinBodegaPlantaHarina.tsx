import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { TBinBodega } from '../../../../../types/TypesSeleccion.type';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiPlusCircle } from 'react-icons/bi';
import Button from '../../../../../components/ui/Button';
import Checkbox, { CheckboxGroup } from '../../../../../components/form/Checkbox';
import { fetchBinBodega, listaBinBodegaFiltroThunk, QUITAR_BIN_BODEGA } from '../../../../../redux/slices/bodegaSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { AGREGAR_BIN_PARA_PLANTA_HARINA, LIMPIAR_BINS_PARA_PLANTA_HARINA } from '../../../../../redux/slices/plantaHarinaSlice';
import Label from '../../../../../components/form/Label';
import SelectReact from '../../../../../components/form/SelectReact';
import { optionsBodegasB, optionsCalibres, optionsVariedad } from '../../../../../utils/options.constantes';
import { useAuth } from '../../../../../context/authContext';


const TablaBinBodegaPlantaHarina = ({refresh}: {refresh: boolean}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const bin_bodega = useAppSelector((state: RootState) => state.bodegas.bin_bodega)
  const token = useAppSelector((state) => state.auth.authTokens)
  const {verificarToken} = useAuth()
  const [listaBins, setListaBins] = useState<TBinBodega[]>([])
  const bins_para_planta_harina = useAppSelector((state: RootState) => state.planta_harina.bins_para_planta_harina)

  const [filtroBodega, setFiltroBodega] = useState<string>('')

  // useEffect(() => {
  //   dispatch(fetchBinBodega({ params: { search: !filtroBodega ? 'g3,g4,g5,g6' : filtroBodega }, token, verificar_token: verificarToken }));
  // }, [filtroBodega])

  useEffect(() => {
    // dispatch(fetchBinBodega({ params: { search: !filtroBodega ? 'g1,g2' : filtroBodega }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: !filtroBodega ? 'g5' : filtroBodega}))
  }, [filtroBodega, refresh])

  useEffect(() => {
    const lista: TBinBodega[] = []
    if (bin_bodega && bin_bodega.length > 0) {
      bin_bodega.forEach((element : any) => {
        if (bins_para_planta_harina.find(bin => bin.id === element.id)) {
        } else {
          lista.push(element)
        }
      })
      setListaBins(lista)
    } else if (bin_bodega && bin_bodega.length === 0) {
      setListaBins([])
    }
  }, [bin_bodega])

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
    dispatch(LIMPIAR_BINS_PARA_PLANTA_HARINA())
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
            {`${info.row.original.programa}`}
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
  
                <Tooltip text='Agregar A Planta Harina'>
                  <Button
                    variant='solid'
                    color='emerald'
                    colorIntensity='600'
                    onClick={() => {
                      dispatch(QUITAR_BIN_BODEGA(info.row.original.id))
                      dispatch(AGREGAR_BIN_PARA_PLANTA_HARINA(info.row.original))
                    }}
                    className='hover:scale-105'>
                    <BiPlusCircle style={{ fontSize: 25, color: 'white' }}/>
                  </Button>
                </Tooltip>
            
  
            </div>
          );
        },
        header: 'Acciones'
      }),
	];
  
  const table = useReactTable({
    data: listaBins,
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
    <Container breakpoint={null} className='w-full h-full overflow-auto p-0'>
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
          </CardHeader>
					<CardBody className='overflow-x-auto'>
            <div className='w-full flex flex-col md:flex-row lg:flex-row gap-5'>
              <div className="w-full flex-col">
                <Label htmlFor="bodega">Bodegas: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona una bodega' },
                      { value: 'g5', label: 'Bodega G5' },
                    ]}
                    id='bodega'
                    placeholder='Seleccione una bodega'
                    name='bodega'
                    className='py-2'
                    onChange={(value: any) => {
                      if (value.value === ''){
                        setGlobalFilter('')
                        setFiltroBodega('')
                      } else {
                        setFiltroBodega(value.value)
                      }
                    }}
                  />
              </div>

              <div className="w-full flex-col">
                <Label htmlFor="calle">Variedad: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona una variedad' }, ...optionsVariedad
                    // .filter(variety => bin_bodega.some(bin => bin.variedad === variety?.label))
                  ]}
                    id='variedad'
                    placeholder='Seleccione una variedad'
                    name='variedad'
                    className=' py-2'
                    onChange={(value: any) => {
                      if (value.value === ''){
                        setGlobalFilter('')
                      } else {
                        setGlobalFilter(value.label)
                      }
                    }}
                  />
              </div>

              <div className="w-full flex-col">
                <Label htmlFor="calle">Calibre: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona un calibre' }, ...optionsCalibres
                    // .filter(calibre => bin_bodega.some(bin => bin.calibre === calibre.label))
                  ]}
                    id='calibre'
                    placeholder='Seleccione un calibre'
                    name='calibre'
                    className='py-2'
                    onChange={(value: any) => {
                      if (value.value === ''){
                        setGlobalFilter('')
                      } else {
                        setGlobalFilter(value.label)
                      }
                    }}
                  />
              </div>
            </div>
						<div className='overflow-hidden'>
              <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
            </div>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaBinBodegaPlantaHarina;


