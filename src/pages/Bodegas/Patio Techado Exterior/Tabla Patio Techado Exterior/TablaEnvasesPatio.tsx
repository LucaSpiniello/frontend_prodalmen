import { Dispatch, FC, SetStateAction, useState } from 'react';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TEnvasePatio } from '../../../../types/TypesBodega.types';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TEnvasePatio[] | []
  refresh?: Dispatch<SetStateAction<boolean>>
  total_envases: number

}


const TablaEnvasesPatio: FC<IRendimientoMuestra> = ({ data, id_lote, total_envases }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const columnHelper = createColumnHelper<TEnvasePatio>();

  const columns = [
		columnHelper.accessor('id', {
			cell: () => (
				<div className='font-bold truncate'>
					{id_lote}
				</div>
			),
			header: 'N° Lote'
		}),
		columnHelper.accessor('numero_bin', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.numero_bin} / ${total_envases}`}
				</div>
			),
			header: 'N° Bin',
		}),
		columnHelper.accessor('kilos_fruta', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${(info.row.original.kilos_fruta ?? 0).toLocaleString()}`}
				</div>
			),
			header: 'Kilos Fruta',
		}),
		columnHelper.accessor('estado_envase_label', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.estado_envase_label}`}
				</div>

			),
			header: 'Estado Envase',
		}),
    columnHelper.accessor('variedad', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.variedad}`}
				</div>

			),
			header: 'Variedad',
		}),
  ]


  const table = useReactTable({
		data: data ? data : [],
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
			pagination: { pageSize: 8 },
		},
	});

  return (
    <Container breakpoint={null} className='w-full'>
      <Card className='h-full w-full'>
        <CardBody className='overflow-x-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  );
};

export default TablaEnvasesPatio;
