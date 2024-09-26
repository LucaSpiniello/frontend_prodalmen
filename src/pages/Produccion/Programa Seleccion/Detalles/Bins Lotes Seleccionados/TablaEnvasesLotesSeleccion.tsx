import { FC, HTMLProps, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { TPepaParaSeleccion } from '../../../../../types/TypesSeleccion.type';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiCheckDouble } from 'react-icons/bi';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { useAuth } from '../../../../../context/authContext';
import { useParams } from 'react-router-dom';
import { HeroXMark } from '../../../../../components/icon/heroicons';
import toast from 'react-hot-toast';
import { fetchWithTokenDelete, fetchWithTokenPut, fetchWithTokenPost } from '../../../../../utils/peticiones.utils';
import { fetchBinsPepaCalibrada, registrar_bines_procesados_masivamente } from '../../../../../redux/slices/seleccionSlice';
import { FaForward } from 'react-icons/fa';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Checkbox from '../../../../../components/form/Checkbox';
import Button from '../../../../../components/ui/Button';

const TablaEnvasesLotes = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const bins_calibrados = useAppSelector((state: RootState) => state.seleccion.bins_pepas_calibradas)
  const programa_seleccion = useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)

  const hoy = new Date()

  const actualizarEstadoEnvase = async (id_lote: number, id_binbodega: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')
    
    const res = await fetchWithTokenPut(`api/seleccion/${id}/binspepacalibrada/${id_lote}/`,
      {
        bin_procesado: true,
        binbodega: id_binbodega,
        seleccion: id,
        fecha_procesado: hoy
      },
      token_verificado
    )
    if (res.ok){
      toast.success("Bin Procesado Correctamente")
      //@ts-ignore
      asignar_dias_kilos()
      dispatch(fetchBinsPepaCalibrada({ id, token, verificar_token: verificarToken }))
    } else {
      toast.error("No se pudo procesar el lote, vuelve a intentarlo")
    }
  }

  const asignar_dias_kilos = async () => {
    try {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/seleccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
      if (response.ok) {
        toast.success('Dias Asignados')
      } else {
        toast.error('Error' + `${await response.json()}`)
      }
    } catch {
      console.log('Error dias asignados')
    }
  }

  const eliminarEnvaseProduccion = async (id_lote: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenDelete(`api/seleccion/${id}/binspepacalibrada/${id_lote}/`, token_verificado)

    if (res.ok){
      toast.success("Envase devuelto con exito a bodega")
      //@ts-ignore
      dispatch(fetchBinsPepaCalibrada({ id, token, verificar_token: verificarToken }))

    } else {
      toast.error("No se pudo devolver el envase, vuelve a intentarlo")
    }
  }

  const [rowSelection, setRowSelection] = useState({});
  const [lotesParaMasivo, setLotesParaMasivo] = useState<TPepaParaSeleccion[]>([])

  useEffect(() => {
    const selectedKeys = Object.keys(rowSelection);
    const selectedIndexes = selectedKeys.map(key => parseInt(key));
    const bin_procesados = bins_calibrados.filter(bin => bin.bin_procesado !== true)
    const lotes_encontrados = bins_calibrados.filter((_item, index) => selectedIndexes.includes(index))


    if (lotes_encontrados.length > 0) {
      setLotesParaMasivo(lotes_encontrados)
    } else {
      const temporal_list = lotesParaMasivo.filter(bin => lotes_encontrados.some(lote => lote.id === bin.id))
      setLotesParaMasivo(temporal_list)
    }
  }, [rowSelection])

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
        className={className + 'w-40  cursor-pointer'}
        //@ts-ignore
        onChange={handleChange}
      />
    );
  }






  const columnHelper = createColumnHelper<TPepaParaSeleccion>();

  const columns = [
    columnHelper.display({
      id: 'checkboxes',
			cell: (info) => (
				<div>
            {
              !info.row.original.bin_procesado && programa_seleccion?.estado_programa === '2'
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
                : null
            }
          </div>
        ),
        header: ''
		}),
    columnHelper.accessor('codigo_tarja', {
      cell: (info) => (
        <Tooltip text={`${info.row.original.tipo_pepa_calibrada_label}`}>
          <div className='font-bold'>
            {`${info.row.original.codigo_tarja}`}
          </div>
        </Tooltip> 
        ),
        header: 'Código Tarja',
      }),
      // columnHelper.accessor('tipo_pepa_calibrada_label', {
      //   cell: (info) => (
      //     <div className='font-bold truncate'>
      //       {`${info.row.original.tipo_pepa_calibrada_label}`}
      //     </div>
      //   ),
      //   header: 'Desde',
      // }),
      columnHelper.accessor('kilos_fruta', {
        id: 'kilos_fruta',
        cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.kilos_fruta  }`}
          </div>
        ),
        header: 'Kilos Fruta',
      }),
      columnHelper.accessor('variedad', {
        cell: (info) => (
          <div className='font-bold'>
            <span>{info.row.original.variedad}</span>
          </div>
        ),
        header: 'Variedad',
      }),
    columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
        const estado = info.row.original.bin_procesado

        return (
          <div className='w-full flex justify-center gap-5'>
          {
            estado
              ? (
                <Button
                  variant='solid'
                  color='emerald'
                  colorIntensity='600'
                >
                  <BiCheckDouble style={{ fontSize: 25 }}/>
                </Button>
                )
              : !(programa_seleccion?.estado_programa! === '0' || programa_seleccion?.estado_programa! !== '2' && programa_seleccion?.estado_programa! <= '3')
                ?  (
                  <Button
                    variant='solid'
                    color='amber'
                    colorIntensity='600'
                    className='hover:scale-105'
                    onClick={() => actualizarEstadoEnvase(id, info.row.original.binbodega )}
                  >
                     <FaForward style={{ fontSize: 25 }}/>
                  </Button>
                  )
                : null
          }
          {/* {
            (programa_seleccion?.estado_programa! === '0' || programa_seleccion?.estado_programa! !== '2' && programa_seleccion?.estado_programa! <= '3') || estado 
              ? null
              : (
                <Button
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => eliminarEnvaseProduccion(id!)}
                  >
                    <HeroXMark style={{ fontSize: 25 }}/>
                </Button>
              )
          } */}

          
        </div>
        )
      },
      header: 'Acciones'
    })
  
	];
  
  const table = useReactTable({
		data: bins_calibrados ? bins_calibrados : [],
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
    { id: 'checkboxes', className: 'w-10'},
    { id: 'kilos_fruta' , header: '', className: 'lg:20 text-center'},
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
                placeholder='Busca Bin...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>

            {
              !bins_calibrados.every(bin => bin.bin_procesado === true) && lotesParaMasivo.length > 1
                ? (
                  <Button
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    onClick={() => dispatch(registrar_bines_procesados_masivamente({ id: parseInt(id!), data: {'bins': lotesParaMasivo }, token, verificar_token: verificarToken }))}
                    >
                      Procesar Masivo
                  </Button>
                  )
                : null
              }
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );
};

export default TablaEnvasesLotes;
