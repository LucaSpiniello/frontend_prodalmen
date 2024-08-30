import { useEffect, useState } from 'react';
import { TRendimientoMuestra } from '../../../../types/TypesControlCalidad.type';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card';
import TableTemplate from '../../../../templates/common/TableParts.template';
import Container from '../../../../components/layouts/Container/Container';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { useAuth } from '../../../../context/authContext';
import { fetchMuestraControlDeCalidad, fetchMuestrasControlCalidad } from '../../../../redux/slices/controlcalidadSlice';
import { useParams } from 'react-router-dom';
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"


const columnHelper = createColumnHelper<TRendimientoMuestra>();


const TablaMuestrasDetalle = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const rendimiento_muestra = useAppSelector((state: RootState) => state.control_calidad.cc_muestras)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()
	
	

  const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Muestra',
		}),
		columnHelper.accessor('peso_muestra', {
			cell: (info) => (
				<div className='font-bold '>
					{`${(info.row.original.peso_muestra ?? 0).toFixed(2)}`}
				</div>
			),
			header: 'Peso Muestra',
		}),
		columnHelper.display({
      id: 'basura',
      cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{(info.row.original.basura ?? 0).toFixed(2)}</p>
					</div>
				)
			},
			header: 'Basura',
		}),
		columnHelper.display({
      id: 'pelon',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{(info.row.original.pelon ?? 0).toFixed(2)}</p>
					</div>
				)
			},
			header: 'Pelón',
		}),
    columnHelper.display({
      id: 'ciega',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{(info.row.original.ciega ?? 0).toFixed(2)}</p>
					</div>
				)
			},
			header: 'Ciega',
		}),
    columnHelper.display({
      id: 'cascara',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{(info.row.original.cascara ?? 0).toFixed(2)}</p>
					</div>
				)
			},
			header: 'Cascara',
		}),
    columnHelper.display({
      id: 'pepa_huerto',
			cell: (info) => {
				return (
					<div className='font-bold'>
						<p className=''>{(info.row.original.pepa_huerto ?? 0).toFixed(2)}</p>
					</div>
				)
			},
			header: 'Pepa Huerto',
		}),
    columnHelper.display({
      id: 'pepa',
			cell: (info) => {
        const row = info.row.original
        const pepaBruta = (row?.peso_muestra ?? 0) - (row?.basura ?? 0) - (row?.pelon ?? 0) - (row?.ciega ?? 0) - (row?.cascara ?? 0) - (row?.pepa_huerto ?? 0)

				return (
					<div className='font-bold'>
						<p className=''>{(pepaBruta ?? 0).toFixed(2)}</p>
					</div>
				)
			},
			header: 'Pepa Bruta',
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

export default TablaMuestrasDetalle;
