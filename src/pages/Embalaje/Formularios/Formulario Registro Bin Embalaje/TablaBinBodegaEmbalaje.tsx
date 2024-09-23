import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { TBinBodega } from '../../../../types/TypesSeleccion.type';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../components/ui/Tooltip';
import { BiPlusCircle } from 'react-icons/bi';
import Button from '../../../../components/ui/Button';
import Checkbox, { CheckboxGroup } from '../../../../components/form/Checkbox';
import { QUITAR_BIN_BODEGA, fetchBinBodega, listaBinBodegaFiltroThunk } from '../../../../redux/slices/bodegaSlice';
import { GUARDAR_BIN_EMBALAJE, VACIAR_BINS_EMBALAJE } from '../../../../redux/slices/embalajeSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { HeroPlus } from '../../../../components/icon/heroicons';
import Label from '../../../../components/form/Label';
import SelectReact from '../../../../components/form/SelectReact';
import { optionsBodegasB, optionsCalibres, optionsVariedad } from '../../../../utils/options.constantes';
import { useAuth } from '../../../../context/authContext';
import { Modal } from 'antd';
import ModalConfirmacion from '../../../../components/ModalConfirmacion';
import ModalForm from '../../../../components/ModalForm.modal';


const TablaBinBodegaEmbalaje = ({refresh} : {refresh:boolean}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const bin_bodega = useAppSelector((state: RootState) => state.bodegas.bin_bodega)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const nuevos_bin_para_embalar = useAppSelector((state: RootState) => state.embalaje.nuevos_bin_para_embalar)
  const [listaBins, setListaBins] = useState<TBinBodega[]>([])
  const [filtroBodega, setFiltroBodega] = useState<string>('')

  useEffect(() => {
    // dispatch(fetchBinBodega({ params: { search: !filtroBodega ? 'g1,g2,g3,g4,g5,g6' : filtroBodega }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: !filtroBodega ? 'g4' : filtroBodega}))
  }, [filtroBodega, refresh])

  const validarTiposDePrograma = (nuevoBin: TBinBodega, listaBinbodegas: TBinBodega[]) => {
    const tiposValidosG1G5 = ['G1', 'G2', 'G3', 'G4', 'G5'];
    const tipoNuevoBin = nuevoBin.binbodega.split('-')[0];

    // Extraer los tipos de programa de la lista existente
    const tiposExistentes = listaBinbodegas.map(bin => bin.binbodega.split('-')[0]);
  
    // Condiciones
    if (tiposValidosG1G5.includes(tipoNuevoBin)) {
      if (tiposExistentes.some(tipo => tipo === 'G6' || tipo === 'G7')) {
        return 'No se puede agregar G1 a G5 cuando hay G6 o G7.';
      }
    } else if (tipoNuevoBin === 'G6') {
      if (tiposExistentes.some(tipo => tipo !== 'G6')) {
        return 'No se puede agregar G6 cuando hay otros tipos de bodega.';
      }
    } else if (tipoNuevoBin === 'G7') {
      if (tiposExistentes.some(tipo => tipo !== 'G7')) {
        return 'No se puede agregar G7 cuando hay otros tipos de bodega.';
      }
    }
    
    return null;
  }

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
    const lista: TBinBodega[] = []
    if (bin_bodega && bin_bodega.length > 0) {
      bin_bodega.forEach((element) => {
        if (!nuevos_bin_para_embalar.find(bin => bin.id === element.id) && 
            element.estado_binbodega !== "Procesado En Embalaje" && 
            element.estado_binbodega !== "Ingresado En Embalaje") {
          lista.push(element)
        }
      })
      setListaBins(lista)
    } else if (bin_bodega && bin_bodega.length === 0) {
      setListaBins([])
    }
  }, [bin_bodega, nuevos_bin_para_embalar])

  useEffect(() => {
    dispatch(VACIAR_BINS_EMBALAJE())
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
          const [confirmacion, setConfirmacion] = useState(false)
          const [open, setOpen] = useState(false)
          const error = validarTiposDePrograma(info.row.original, nuevos_bin_para_embalar)

        
          return (
            <div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

                {
                  error && !confirmacion
                    ? (
                      <ModalForm
                        open={open}
                        setOpen={setOpen}
                        width='-z-10 absolute'
                        >
                        <ModalConfirmacion
                          mensaje={error}
                          confirmacion={confirmacion}
                          setConfirmacion={setConfirmacion}
                          setOpen={setOpen}
                          aviso={true}
                        />
                      </ModalForm>
                    )
                    : null
                }

  
                <Tooltip text='Agregar A Embalaje'>
                  <Button
                    variant='solid'
                    color='emerald'
                    colorIntensity='600'
                    onClick={() => { 
                      if (error){
                        setOpen(true)
                      } else {
                        dispatch(QUITAR_BIN_BODEGA(info.row.original.id))
                        dispatch(GUARDAR_BIN_EMBALAJE(info.row.original))
                      } 
                    }}
                    className='hover:scale-105'>
                    <HeroPlus style={{ fontSize: 25, color: 'white' }}/>
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
    <Container breakpoint={null} className='w-full overflow-hidden p-0'>
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
            <div className='flex flex-col md:flex-row lg:flex-row gap-5'>
              <div className="w-full flex-col">
                <Label htmlFor="bodega">Bodegas: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona una bodega' }, ...optionsBodegasB]}
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
                      setGlobalFilter(value.label)
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
                      if (value.label === 'Selecciona un calibre'){
                        setGlobalFilter('')
                      } else {
                        setGlobalFilter(value.label)
                      }
                    }}
                  />
              </div>
            </div>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaBinBodegaEmbalaje;


