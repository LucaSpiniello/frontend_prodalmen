import { FC, HTMLProps, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { fetchWithTokenDelete, fetchWithTokenPut } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { fetchBinsEnReproceso } from '../../../../../redux/slices/reprocesoSlice';
import { TBinEnReproceso } from '../../../../../types/TypesReproceso.types';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiCheckDouble, BiSolidCheckboxChecked } from 'react-icons/bi';
import { FaForward } from 'react-icons/fa';
import { HeroXMark } from '../../../../../components/icon/heroicons';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../../../components/ui/Button';
import { TBinParaProgramaPlantaHarina } from '../../../../../types/typesPlantaHarina';
import { actualizar_estado_bin_para_planta_harina, eliminar_bin_para_planta_harina, procesado_masivo_bin_para_planta_harina } from '../../../../../redux/slices/plantaHarinaSlice';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Checkbox from '../../../../../components/form/Checkbox';
import { GiCheckedShield } from 'react-icons/gi';
import { ImRadioChecked } from 'react-icons/im';


const TablaBinsParaPlantaHarina = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const bins_para_planta_harina = useAppSelector((state: RootState) => state.planta_harina.bin_en_planta_harina)
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const columnHelper = createColumnHelper<TBinParaProgramaPlantaHarina>()
  
  const [rowSelection, setRowSelection] = useState({});
  const [lotesParaMasivo, setLotesParaMasivo] = useState<TBinParaProgramaPlantaHarina[]>([])


  useEffect(() => {
    const selectedKeys = Object.keys(rowSelection);
    const selectedIndexes = selectedKeys.map(key => parseInt(key));
    const bin_procesados = bins_para_planta_harina.filter(bin => bin.procesado !== true)
    const lotes_encontrados = bins_para_planta_harina.filter((_item, index) => selectedIndexes.includes(index))

    if (lotes_encontrados.length > 0) {
      setLotesParaMasivo(lotes_encontrados)
    } else {
      const temporal_list = lotesParaMasivo.filter(bin => lotes_encontrados.some(lote => lote.id === bin.id))
      setLotesParaMasivo(temporal_list)
    }
  }, [rowSelection]);

  function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (ref.current && typeof indeterminate === 'boolean') {
        ref.current.indeterminate = indeterminate;
      }
    }, [ref, indeterminate]);
  
    const handleChange = (e: CheckboxChangeEvent) => {
      const { checked } = e.target;
      if (rest.onChange) {
        rest.onChange({
          target: {
            ...rest,
            checked,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };
  
    return (
      <Checkbox
        {...rest}
        ref={ref}
        indeterminate={indeterminate}
        color='blue'
        className={className + 'w-40  cursor-pointer'}
        //@ts-ignore
        onChange={handleChange}
      />
    );
  }



  const columns = [
    !(programa_planta_harina?.estado_programa! === '0' || programa_planta_harina?.estado_programa! !== '2' && programa_planta_harina?.estado_programa! <= '3')
      ? (
        columnHelper.display({
          id: 'checkboxes',
          cell: (info) => (
            <div>
                {
                  !info.row.original.procesado && !(programa_planta_harina?.estado_programa === '5' || programa_planta_harina?.estado_programa !== '2')
                    ? (
                      <IndeterminateCheckbox
                        {...{
                          checked: info.row.getIsSelected(),
                          disabled: !info.row.getCanSelect(),
                          indeterminate: info.row.getIsSomeSelected(),
                          onChange:  info.row.getToggleSelectedHandler()
                        }}
                      />
                    )
                    : <BiSolidCheckboxChecked className='text-3xl text-emerald-700'/>
                }
              </div>
            ),
            header: ''
        })
      )
      : (
        columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      ),
    columnHelper.accessor('codigo_tarja', {
      id: 'codigo_tarja',
      cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.codigo_tarja}`}
          </div>
        ),
        header: 'Código Tarja',
      }),
      columnHelper.accessor('programa', {
        id: 'programa',
        cell: (info) => (
            <div className='font-bold'>
              {`${info.row.original.programa}`}
            </div>
          ),
          header: 'Programa',
        }),
      columnHelper.accessor('kilos_fruta', {
        id: 'kilos_fruta',
        cell: (info) => (
            <div className='font-bold'>
              {`${info.row.original.kilos_fruta}`}
            </div>
          ),
          header: 'Kilos Fruta',
        }),
      columnHelper.accessor('cc_tarja', {
        id: 'cc_tarja',
        cell: (info) => (
            <div className='font-bold'>
              {`${info.row.original.cc_tarja}`}
            </div>
          ),
          header: 'CC Tarja',
        }),      
    columnHelper.display({
			id: 'actions',
			cell: (info) => {
        const estado = info.row.original.procesado

        return (
          <div className='w-full flex justify-center gap-5'>
          {
            estado
              ? (
                <Button
                  title='Envase Procesado en Reproceso'
                  variant='solid'
                  color='emerald'
                  colorIntensity='700'
                  className='w-20 rounded-md h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                  >
                    <BiCheckDouble style={{ fontSize: 35 }}/>
                </Button>
                )
              : !(programa_planta_harina?.estado_programa! === '0' || programa_planta_harina?.estado_programa! !== '2' && programa_planta_harina?.estado_programa! <= '3')
                ?
                  (
                    <Button
                      title='Procesar Bin En Planta Harina'
                      variant='solid'
                      color='amber'
                      colorIntensity='600'
                      onClick={() => {
                        dispatch(actualizar_estado_bin_para_planta_harina({ id: parseInt(id!), params: { id_bin: info.row.original.id }, data: { procesado: true }, token, verificar_token: verificarToken }))
                      }}
                      className='w-20 rounded-md h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                      >
                        <FaForward style={{ fontSize: 25 }}/>
                    </Button>
                    )
                : null
          }
          {
            estado || (programa_planta_harina?.estado_programa! === '0' || programa_planta_harina?.estado_programa! !== '2' && programa_planta_harina?.estado_programa! <= '3')
              ? null
              : (
                <Button
                  title='Eliminar Bin de Planta Harina'
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  onClick={() => dispatch(eliminar_bin_para_planta_harina({ id: parseInt(id!), params: { id_bin: info.row.original.id }, token, verificar_token: verificarToken  }))}
                  className='w-20 rounded-md h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                  >
                    <HeroXMark style={{ fontSize: 35 }}/>
                </Button>
              )
          }

          
        </div>
        )
      },
      header: 'Acciones'
    })
    
	];
  
  const table = useReactTable({
		data: bins_para_planta_harina ? bins_para_planta_harina : [],
		columns,
		state: {
			sorting,
			globalFilter,
      rowSelection,

		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
	});

  const columnas: TableColumn[] = [
    { id: 'checkboxes', className: 'w-20' },
    { id: 'codigo_tarja', className: 'lg:w-40' },
    { id: 'programa', className: 'lg:w-56' },
    { id: 'kilos_fruta', className: 'lg:w-40' },
    { id: 'cc_tarja', className: 'lg:w-40' },
  ]

  return (
    <Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
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
                placeholder='Busca Envase...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>
            {
              !bins_para_planta_harina.every(bin => bin.procesado === true) && lotesParaMasivo.length > 1
                ? (
                  <Button
                    variant='solid'
                    onClick={() => dispatch(procesado_masivo_bin_para_planta_harina({ id: parseInt(id!), data: { bins: lotesParaMasivo }, token, verificar_token: verificarToken }))}
                    >
                      Procesar Masivo
                  </Button>
                  )
                : null
              }
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}  columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );
};

export default TablaBinsParaPlantaHarina;
