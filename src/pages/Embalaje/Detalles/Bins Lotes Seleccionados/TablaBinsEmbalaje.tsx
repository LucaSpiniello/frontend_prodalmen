import { FC, HTMLProps, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { TPepaParaSeleccion } from '../../../../types/TypesSeleccion.type';
import Tooltip from '../../../../components/ui/Tooltip';
import { BiCheckDouble } from 'react-icons/bi';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../templates/common/TableParts.template';
import { useAuth } from '../../../../context/authContext';
import { useParams } from 'react-router-dom';
import { HeroXMark } from '../../../../components/icon/heroicons';
import toast from 'react-hot-toast';
import { fetchWithTokenDelete, fetchWithTokenPatch } from '../../../../utils/peticiones.utils';
import { FaForward } from 'react-icons/fa';
import { TBinEnEmbalaje } from '../../../../types/TypesEmbalaje.type';
import Checkbox from '../../../../components/form/Checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Button from '../../../../components/ui/Button';
import { fetchBinEnEmbalaje } from '../../../../redux/slices/embalajeSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const TablaBinsEmbalaje = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const programa_embalaje = useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual )

  const bins_en_embalaje = useAppSelector((state: RootState) => state.embalaje.bin_en_programa)

  const actualizarEstadoEnvase = async (id_bin: number) => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/embalaje/${id}/fruta_bodega/${id_bin}/`,
      {procesado: true}, token_verificado)
    if (res.ok){
      toast.success("Bin Procesado Correctamente")
      dispatch(fetchBinEnEmbalaje({ id: parseInt(id!), token, verificar_token: verificarToken }))
    } else {
      toast.error("No se pudo procesar el lote, vuelve a intentarlo")
    }
  }

  const eliminarBinEmbalaje = async (id_bin: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenDelete(`api/embalaje/${id}/fruta_bodega/${id_bin}/`, token_verificado)

    if (res.ok){
      toast.success("Bin devuelto con exito a bodega")
      //@ts-ignore
      dispatch(fetchBinEnEmbalaje({ id, token, verificar_token: verificarToken }))

    } else {
      toast.error("No se pudo devolver el envase, vuelve a intentarlo")
    }
  }

  const [rowSelection, setRowSelection] = useState({});
  const [binSeleccionadosParaMasivo, setBinSeleccionadoParaMasivo] = useState<TBinEnEmbalaje[]>([])


  useEffect(() => {
    const selectedKeys = Object.keys(rowSelection);
    const selectedIndexes = selectedKeys.map(key => parseInt(key));
    const bin_procesados = bins_en_embalaje.filter(bin => bin.procesado !== true)
    const lotes_encontrados = bins_en_embalaje.filter((_item, index) => selectedIndexes.includes(index))


    if (lotes_encontrados.length > 0) {
      setBinSeleccionadoParaMasivo(lotes_encontrados)
    } else {
      const temporal_list = binSeleccionadosParaMasivo.filter(bin => lotes_encontrados.some(lote => lote.id === bin.id))
      setBinSeleccionadoParaMasivo(temporal_list)
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
        className={className + 'w-40  cursor-pointer'}
        //@ts-ignore
        onChange={handleChange}
      />
    );
  }



  const columnHelper = createColumnHelper<TBinEnEmbalaje>();

  const columns = [
    columnHelper.display({
      id: 'checkboxes',
			cell: (info) => (
				<div>
            {
              !info.row.original.procesado
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
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        )
		}),
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
        cell: (info) => (
          <div className='font-bold truncate'>
            {`${info.row.original.programa}`}
          </div>
        ),
        header: 'Programa',
      }),
      columnHelper.accessor('cc_tarja', {
        id: 'cc_tarja',
        cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.cc_tarja  }`}
          </div>
        ),
        header: 'CC Tarja',
      }),
      columnHelper.accessor('kilos_fruta', {
        cell: (info) => (
          <div className='font-bold'>
            <span>{info.row.original.kilos_fruta}</span>
          </div>
        ),
        header: 'Kilos Fruta',
      }),
    columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
        const estado = info.row.original.procesado

        return (
          <div className='w-full flex justify-center gap-5'>
          {
            estado 
              ? (
                <Tooltip text='Envase en Embalaje'>
                  <Button
                    title='Bin Procesado en Embalaje'
                    variant='solid'
                    color='emerald'
                    colorIntensity='600'
                    className='w-20 rounded-md h-12 flex items-center text-white  justify-center hover:scale-105'
                    >
                      <BiCheckDouble style={{ fontSize: 35 }}/>
                  </Button>
                </Tooltip>
                )
              : !(programa_embalaje?.estado_embalaje === '0' || programa_embalaje?.estado_embalaje !== '2' && programa_embalaje?.estado_embalaje! <= '3')
                  ? (
                    <Button
                      title='Procesar Bin'
                      variant='solid'
                      color='amber'
                      colorIntensity='600'
                      onClick={() => actualizarEstadoEnvase(id)}
                      className='w-20 h-12  flex items-center  text-white justify-center p-2 hover:scale-105'
                      >
                        <FaForward style={{ fontSize: 30 }}/>
                    </Button>
                    )
                  : null
          }
          {
            estado || (programa_embalaje?.estado_embalaje === '0' || programa_embalaje?.estado_embalaje !== '2' && programa_embalaje?.estado_embalaje! <= '3')
              ? null
              : (
                  <Button
                    variant='solid'
                    color='red'
                    colorIntensity='700'
                    onClick={() => eliminarBinEmbalaje(id)}
                    className='w-20 h-12 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <HeroXMark style={{ fontSize: 30 }}/>
                    </Button>
              )
          }

          
        </div>
        )
      },
      header: 'Acciones'
    })
	]

  const procesarMasivamente = async () => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/embalaje/${id}/bins_en_embalaje/`, 
    {
      "bins": binSeleccionadosParaMasivo
    }, token_verificado)
    if (res.ok){
      //@ts-ignore
      dispatch(fetchBinEnEmbalaje({ token, verificar_token: verificarToken, id: id }))
    } else {
      console.log("todo mal")
    }
  
  }

  
  const table = useReactTable({
		data: bins_en_embalaje,
		columns,
		state: {
			sorting,
			globalFilter,
      rowSelection,
		},
    enableRowSelection: true,
		onSortingChange: setSorting,
		enableGlobalFilter: true,
    onRowSelectionChange: setRowSelection,
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
    { id: 'checkboxes' , header: 'Código Tarja', className: 'lg:w-14'},
    { id: 'codigo_tarja' , header: '', className: 'lg:w-40 text-center'},
    { id: 'kilos_fruta' , header: '', className: 'lg:w-20 text-center'},
  ]

  return (
    <Container breakpoint={null} className='w-full overflow-auto !p-0'>
				<Card className='h-full w-full'>
          <CardHeader>
            <header className='flex w-full justify-between'>
              <div className='lg:w-4/12'>
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
              </div>

              {
                !bins_en_embalaje.every(bin => bin.procesado === true) && binSeleccionadosParaMasivo.length > 1
                  ? (
                    <Button
                      variant='solid'
                      onClick={async () => await procesarMasivamente()}
                      >
                        Procesar Masivo
                    </Button>
                    )
                  : null
              }
            </header>
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );
};

export default TablaBinsEmbalaje;
