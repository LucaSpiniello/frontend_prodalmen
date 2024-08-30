import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useEffect, useState } from "react";
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { RootState } from "../../../../redux/store";
import { VACIAR_TABLA } from "../../../../redux/slices/seleccionSlice";
import { TBinBodega } from "../../../../types/TypesSeleccion.type";
import Tooltip from "../../../../components/ui/Tooltip";
import Button from "../../../../components/ui/Button";
import { GUARDAR_BIN_AGRUPADO, QUITAR_BIN_BODEGA } from "../../../../redux/slices/bodegaSlice";
import { BiPlusCircle } from "react-icons/bi";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader } from "../../../../components/ui/Card";
import FieldWrap from "../../../../components/form/FieldWrap";
import Icon from "../../../../components/icon/Icon";
import Checkbox, { CheckboxGroup } from "../../../../components/form/Checkbox";
import Input from "../../../../components/form/Input";
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";



const TablaBinAgrupado = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [open, setOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const bin_bodega_agrupacion = useAppSelector((state: RootState) => state.bodegas.bin_bodega)



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
  
                <Tooltip text='Agregar A Selección'>
                  <Button
                    variant='solid'
                    onClick={() => {
                      dispatch(QUITAR_BIN_BODEGA(info.row.original.id))
                      dispatch(GUARDAR_BIN_AGRUPADO(info.row.original))
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
    data: bin_bodega_agrupacion,
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
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaBinAgrupado;


