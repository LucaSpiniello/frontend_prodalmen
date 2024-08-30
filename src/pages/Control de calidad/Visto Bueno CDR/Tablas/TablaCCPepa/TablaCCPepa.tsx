import { useState } from 'react';
import { TRendimientoMuestra } from '../../../../../types/TypesControlCalidad.type';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import TableTemplate from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';

const columnHelper = createColumnHelper<TRendimientoMuestra>();

const TablaMuestrasDetallePepa = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const rendimiento_muestra = useAppSelector((state: RootState) => state.control_calidad.cc_muestras)
	
  const columns = [
		columnHelper.display({
      id: 'id',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Muestra',
		}),
		columnHelper.display({
      id: 'pepa',
			cell: (info) => (
				<div className='font-bold'>
					{`${(info.row.original.pepa ?? 0).toFixed(2)}`}
				</div>
			),
			header: 'Pepa Bruta',
		}),
		columnHelper.display({
      id: 'pepa_exportable',
      cell: (info) => {
        const row = info.row.original
        const pepa_exportable = ((row?.pepa ?? 0) - ((row?.cc_rendimiento.muestra_variedad ?? 0) + (row?.cc_rendimiento.daño_insecto ?? 0) + (row?.cc_rendimiento.hongo ?? 0) + (row?.cc_rendimiento.doble ?? 0) + (row?.cc_rendimiento.fuera_color ?? 0) + (row?.cc_rendimiento.vana_deshidratada ?? 0) + (row?.cc_rendimiento.punto_goma ?? 0) + (row?.cc_rendimiento.goma ?? 0)))?.toFixed(1)

				return (
					<div className='font-bold'>
              {pepa_exportable}
					</div>
				)
			},
			header: 'Pepa Expor.',
		}),
		columnHelper.display({
      id: 'mezcla_variedades',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.muestra_variedad ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Pelón',
		}),
    columnHelper.display({
      id: 'daño_insecto',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.daño_insecto ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Daño Insecto',
		}),
    columnHelper.display({
      id: 'hongo',
			cell: (info) => {

				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.hongo ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Hongo',
		}),
    columnHelper.display({
      id: 'doble',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.doble ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Doble',
		}),
    columnHelper.display({
      id: 'fuera_color',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.fuera_color ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Fuera Color',
		}),
    columnHelper.display({
      id: 'vana',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.vana_deshidratada ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Vana Des.',
		}),
    columnHelper.display({
      id: 'punto_goma',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.punto_goma ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Punto Goma',
		}),
    columnHelper.display({
      id: 'goma',
			cell: (info) => {
				return (
					<div className='font-bold'>
						{(info.row.original.cc_rendimiento.goma ?? 0).toFixed(2)}
					</div>
				)
			},
			header: 'Goma',
		}),
  ]


  const table = useReactTable({
		data: rendimiento_muestra,
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
    <PageWrapper name='Lista Programas Selección'>
      <Container breakpoint={null} className='w-full overflow-auto'>
        <Card className='h-full w-full'>
          <CardHeader>
              <CardTitle>Detalle Control Calidad Pepa Bruta</CardTitle>
          </CardHeader>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaMuestrasDetallePepa;
