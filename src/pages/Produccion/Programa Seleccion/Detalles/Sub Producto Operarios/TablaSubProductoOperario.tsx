import { FC, useEffect, useState } from 'react';
import useDarkMode from '../../../../../hooks/useDarkMode';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import { TSubProductoMetrica, TSubproducto } from '../../../../../types/TypesSeleccion.type';
import ModalForm from '../../../../../components/ModalForm.modal';
import { fetchSubProductosOperarios } from '../../../../../redux/slices/seleccionSlice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../../context/authContext';


interface IProduccionProps {
}


const TablaSubProductoOperario: FC<IProduccionProps> = () => {

	const programa_seleccion = useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  	const subproducto = useAppSelector((state: RootState) => state.seleccion.sub_productos_operarios)
  	const metricas = useAppSelector((state: RootState) => state.seleccion.subproducto_metricas)

  	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const columnHelper = createColumnHelper<TSubproducto>();


  const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'ID',
		}),
    columnHelper.accessor('operario_nombres', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.operario_nombres}`}
				</div>
			),
			header: 'Operario',
		}),
		columnHelper.accessor('peso', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.peso}`}
				</div>
			),
			header: 'Peso',
		}),
		columnHelper.accessor('en_bin', {
			cell: (info) => (
				<div className="font-bold">{`${info.row.original.en_bin ? 'Sí' : 'No'}`}</div>
			),
			header: 'En Bin'
		}),
		columnHelper.accessor('tipo_subproducto_label', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.tipo_subproducto_label}`}
				</div>
			),
			header: 'Tipo SubProducto',
		})
	];

	const columnas: TableColumn[] = [
    { id: 'id', header: '', className: 'lg:w-20' },

  ]
  
  const table = useReactTable({
		data: subproducto,
		columns,
		state: {
			sorting,
			globalFilter,
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
	});

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
                placeholder='Busca programa...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>

						
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );
};

export default TablaSubProductoOperario;
