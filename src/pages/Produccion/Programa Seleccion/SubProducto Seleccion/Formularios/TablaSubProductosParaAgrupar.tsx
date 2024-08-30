import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { TBinBodega, TSubproducto, TTarjaSeleccionada } from '../../../../../types/TypesSeleccion.type';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiPlusCircle } from 'react-icons/bi';
import { GUARDAR_SUBPRODUCTO_A_AGRUPAR, QUITAR_SUBPRODUCTO_EN_LISTA, VACIAR_TABLA } from '../../../../../redux/slices/seleccionSlice';
import Button from '../../../../../components/ui/Button';
import Label from '../../../../../components/form/Label';
import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact';
import { optionsTipoSubProducto } from '../../../../../utils/options.constantes';
import { fetchOperarios } from '../../../../../redux/slices/operarioSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const TablaSubProductos = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const subproductos = useAppSelector((state: RootState) => state.seleccion.subproducto_list)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()


  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)

	useEffect(()  => {
		//@ts-ignore
		dispatch(fetchOperarios({ token, verificar_token: verificarToken }))
	}, [])

  const optionsOperarios: TSelectOptions = operarios.map((operario) => ({
		value: String(operario.id),
		label: `${operario.nombre} ${operario.apellido}`
	}))

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

  const columnHelper = createColumnHelper<TSubproducto>();

  const columns = [
    columnHelper.accessor('id', {
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
        cell: (info) => (
          <div className='font-bold text-center'>
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
  
                <Tooltip text='Agregar A Selección'>
                  <Button
                    variant='solid'
                    onClick={() => {
                      dispatch(QUITAR_SUBPRODUCTO_EN_LISTA(info.row.original.id))
                      dispatch(GUARDAR_SUBPRODUCTO_A_AGRUPAR(info.row.original))
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
    data: subproductos,
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
              className='relative top-4 w-72'
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
                className='h-12'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>

            <div className='w-full lg:w-7/12 flex lg:flex-row flex-col gap-5'>
              <div className="w-full flex-col">
                <Label htmlFor="calle">Operario: </Label>
                <SelectReact
                    options={[{ value: '', label: 'Selecciona un operario' }, ...optionsOperarios]}
                    id='operario'
                    placeholder='Operario'
                    name='operario'
                    className='w-full h-12 py-2'
                    onChange={(selectedOption: any) => {
                      if (selectedOption && selectedOption.value === '') {
                        setGlobalFilter('')
                      } else {
                        setGlobalFilter(selectedOption.label);
                      }
                    }}
                  />
              </div>

              <div className="w-full flex-col">
                <Label htmlFor="calle">Sub Productos: </Label>
                <SelectReact
                  options={[{ value: '', label: 'Selecciona un Sub Producto' }, ...optionsTipoSubProducto]}
                  id='tipo_subproducto'
                  placeholder='Tipo Sub Producto'
                  name='tipo_subproducto'
                  className='w-full h-12 py-2'
                  onChange={(selectedOption: any) => {
                    if (selectedOption && selectedOption.value === '') {
                      setGlobalFilter('')
                    } else {
                      setGlobalFilter(selectedOption.label);
                    }
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

export default TablaSubProductos;


