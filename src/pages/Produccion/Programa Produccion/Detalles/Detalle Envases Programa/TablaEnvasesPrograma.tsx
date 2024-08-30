import { FC, HTMLProps, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { TLoteProduccion,  } from '../../../../../types/TypesProduccion.types';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import { useParams } from 'react-router-dom';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { HeroXMark } from '../../../../../components/icon/heroicons';
import { BiCheckDouble } from 'react-icons/bi';
import { FaForward } from 'react-icons/fa';
import { fetchWithTokenDelete, fetchWithTokenPatchAction, fetchWithTokenPut, fetchWithTokenPost} from '../../../../../utils/peticiones.utils';
import { eliminar_envase_produccion, fetchEnvasesProduccion, fetchProgramaProduccion } from '../../../../../redux/slices/produccionSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Checkbox from '../../../../../components/form/Checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Button from '../../../../../components/ui/Button';



const TablaEnvasesPrograma = () => {
  const { id } = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([{id: 'bin_procesado', desc: false}]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const envases_programa = useAppSelector((state: RootState) => state.programa_produccion.lotes)
  const programa_produccion = useAppSelector((state: RootState) => state.programa_produccion.programa)

  const actualizarEstadoEnvase = async (id_lote: number, bodega_ext: number) => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPut(`api/produccion/${id}/lotes_en_programa/${id_lote}/`,
      {
        bin_procesado: true,
        bodega_techado_ext: bodega_ext,
        produccion: id
      },
      token_verificado
    )
    if (res.ok){
      toast.success("Lote Procesado Correctamente")
      dispatch(fetchEnvasesProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      if (id){
        asignarDiasKilos(parseInt(id))
      }
      
    } else {
      toast.error("No se pudo procesar el lote, vuelve a intentarlo")
    }
  }

  const [rowSelection, setRowSelection] = useState({});
  const [lotesParaMasivo, setLotesParaMasivo] = useState<TLoteProduccion[]>([])

  const asignarDiasKilos = async (id : any) => {
    try {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado)throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/produccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
      if (response.ok) {
        toast.success('Trabajo asignado a operarios')
      } else {
        toast.error('Error' + `${await response.json()}`)
      }
    } catch {
      console.log('Error dias asignados')
    }
  }

  useEffect(() => {
    const selectedKeys = Object.keys(rowSelection);
    const selectedIndexes = selectedKeys.map(key => parseInt(key));
    const bin_procesados = envases_programa.filter(bin => bin.bin_procesado !== true)
    const lotes_encontrados = envases_programa.filter((_item, index) => selectedIndexes.includes(index))


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
        className={className + 'w-40  cursor-pointer'}
        //@ts-ignore
        onChange={handleChange}
      />
    );
  }


  useEffect(() => {
    if (id) {
      dispatch(fetchProgramaProduccion({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  const columnHelper = createColumnHelper<TLoteProduccion>();
  const columns = [
    columnHelper.display({
      id: 'checkboxes',
			cell: (info) => (
				<div>
            {
              !info.row.original.bin_procesado && !(programa_produccion?.estado === '4' || programa_produccion?.estado === '5' || programa_produccion?.estado !== '2')
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
		columnHelper.accessor('id',{
      id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.numero_lote}`}
				</div>
			),
			header: 'N° Lote',
		}),
    columnHelper.accessor('envases.bin_procesado',{
      id: 'envases.bin_procesado',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.ubicacion}`}
				</div>
			),
			header: 'Ubicación',
		}),
    columnHelper.accessor('total_envases',{
      id: 'total_envases',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {`${(row?.numero_bin ?? 0)} / ${(row.total_envases ?? 0)}`}
          </div>
        )
      },
			header: 'Total Envases',
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
    columnHelper.display({
      id: 'acciones',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className=' h-full w-full flex items-center justify-center gap-5 flex-wrap'>
              {
                row?.bin_procesado
                  ? (
                    <Button
                      variant='solid'
                      color='emerald'
                      className='w-20 h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                      >
                        <BiCheckDouble style={{ fontSize: 35 }}/>
                    </Button>
                    )
                  : !(programa_produccion?.estado === '4' || programa_produccion?.estado !== '2')
                    ? (
                      <Button
                        variant='solid'
                        color='amber'
                        colorIntensity='600'
                        className='w-20 h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                        onClick={() => actualizarEstadoEnvase(row?.id!, row?.bodega_techado_ext!)}
                        >
                          <FaForward style={{ fontSize: 35 }}/>
                      </Button>
                      )
                    : null
              }
              {
                row?.bin_procesado ||  (['4', '5'].includes(programa_produccion?.estado!)  || programa_produccion?.estado !== '2')
                  ? null
                  : (
                    <Button
                      title='Eliminar de Programa Producción'
                      variant='solid'
                      color='red'
                      className='w-20 h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                      onClick={() => dispatch(eliminar_envase_produccion({
                        params: { 
                          id_programa: programa_produccion.id,
                          id_lote: row.id
                        }, 
                        token, 
                        verificar_token: verificarToken  }))}
                      >
                        <HeroXMark style={{ fontSize: 35 }}/>
                    </Button>
                  )
              }
          </div>
        )
      },
			header: 'Acciones',
		}),
  ]

  const table = useReactTable({
		data: envases_programa,
    columns,
		state: {
			sorting,
			globalFilter,
      rowSelection,
		},
    enableRowSelection: true,
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
    { id: 'numero_lote', header: '', className: 'w-auto md:w-20 lg:w-auto' },
    { id: 'ubicacion', header: '', className: 'w-auto md:w-40 lg:w-auto' },
    { id: 'total_envases', header: '', className: 'w-auto md:w-40 lg:w-auto' },
    
  ]

  const registrarLoteAProduccion = async () => {
    const token_verificado = await verificarToken(token!);
    const envases = lotesParaMasivo.map(lote => lote.bodega_techado_ext).join(',')
    if (!token_verificado) throw new Error('Token no verificado');
    const res = await fetchWithTokenPatchAction(`api/produccion/${id}/lotes_en_programa/actualizar_estados_lotes/${envases}/`, token_verificado);
    if (res.ok) {
      dispatch(fetchEnvasesProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaProduccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      toast.success('Envases procesados correctamente a producción');
      asignarDiasKilos(parseInt(id!))
    } else {
      toast.error("Ocurrió un error, vuelve a intentarlo");
    }
  }


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
              placeholder='Busca programa...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>

          {
                !envases_programa.every(bin => bin.bin_procesado === true) && lotesParaMasivo.length > 1
                  ? (
                    <Button
                      variant='solid'
                      onClick={async () => await registrarLoteAProduccion()}
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

export default TablaEnvasesPrograma;
