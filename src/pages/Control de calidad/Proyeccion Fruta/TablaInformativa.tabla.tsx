import { useEffect, useState, useMemo } from 'react';
import { TControlCalidad } from '../../../types/TypesControlCalidad.type';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../components/ui/Card';
import TableTemplate, { TableColumn } from '../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { BiCheckDouble } from 'react-icons/bi';
import { IoWarning } from 'react-icons/io5';



const columnHelper = createColumnHelper<TControlCalidad>();

const TablaInformativa = ({ filtroVariedad, filtroProductor }: { filtroVariedad: string, filtroProductor: string }) => {  
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.controles_calidad_visto_bueno)
  const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
	const [dataControles, setDataControles] = useState<TControlCalidad[]>([])

  const hasComercializador = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);

	useEffect(() => {
			setGlobalFilter(filtroVariedad || filtroProductor);

			if (hasComercializador(['comercializador']) && !hasComercializador(['dnandres'])) {
				setDataControles(filterByComercializador('Pacific Nut'))
			} else{
				setDataControles(filterByComercializador('Prodalmen'))
			}
		}, [filtroVariedad, filtroProductor])

	const dataControlesFiltrados = useMemo(() => {
		return dataControles.filter(control => {
			const coincideVariedad = filtroVariedad ? control.variedad.includes(filtroVariedad) : true;
			const coincideProductor = filtroProductor ? control.productor.includes(filtroProductor) : true;
			return coincideVariedad && coincideProductor;
		});
	}, [dataControles, filtroVariedad, filtroProductor]);

	const filterByComercializador= (name : string ) => {
		return control_calidad.filter((control: any) => control.comercializador.toLowerCase() === name.toLowerCase());
	}

  const columns = [
		columnHelper.display({
      id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_lote}`}
				</div>
			),
			header: 'N° Lote',
		}),
		columnHelper.display({
      id: 'kilos_recepcion',
			cell: (info) => (
				<div className='font-bold text-center'>
					{(info.row.original.kilos_totales_recepcion ?? 0).toFixed(2)}
				</div>
			),
			header: 'Kilos Neto',
		}),
    columnHelper.accessor('variedad',	{
      id: 'variedad',
			cell: (info) => (
				<div className='font-bold text-center'>
					{info.row.original.variedad}
				</div>
			),
			header: 'Variedad',
		}),
	columnHelper.accessor('productor',	{
			  id: 'productor',	
			cell: (info) => (
				<div className='font-bold text-center'>
					{info.row.original.productor}
				</div>
			),
		}),
    columnHelper.display({
      id: 'rendimientos',
			cell: (info) => {
        const rendimientos = info.row.original.control_rendimiento.length ? info.row.original.control_rendimiento.length : 0
        return (
          <div className='font-bold text-center'>
            {rendimientos}
          </div>
        )
      },
			header: 'Cantidad de Muestras',
		}),
		columnHelper.display({
      id: 'rendimientos_estado_pepa',
      cell: (info) => {
        const row = info.row.original
				return (
					<div className=' h-full w-full flex items-center justify-center'>
            <div className={`p-2 rounded-full ${row?.control_rendimiento.some(cc => cc.cc_ok === true) ? 'bg-green-800' : 'bg-orange-400'} text-white`}>
              {
                row?.control_rendimiento.some(cc => cc.cc_ok === true)
                  ? <BiCheckDouble style={{ fontSize: 35 }}/>
                  : <IoWarning style={{ fontSize: 35 }}/>
              }
            </div>
          </div>
				)
			},
			header: 'Control Calidad Pepa',
		}),
    columnHelper.display({
      id: 'rendimiento_estado_calibracion',
      cell: (info) => {
        const row = info.row.original
				return (
					<div className=' h-full w-full flex items-center justify-center'>
            <div className={`p-2 rounded-full ${row?.control_rendimiento.some(cc => cc.cc_ok === true) ? 'bg-green-800' : 'bg-orange-400'} text-white`}>
              {
                row?.control_rendimiento.some(cc => cc.cc_calibrespepaok === true)
                  ? <BiCheckDouble style={{ fontSize: 35 }}/>
                  : <IoWarning style={{ fontSize: 35 }}/>
              }
            </div>
          </div>
				)
			},
			header: 'Control Calidad Calibre',
		}),
  ]

  const table = useReactTable({
		data: dataControlesFiltrados,
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

  const columnas: TableColumn[] = [
    // { id: 'id', header: '', className: 'w-24 lg:w-32 text-center' },
    // { id: 'fecha_registro', header: '', className: 'lg:w-72' },
  ]

  return (
    <PageWrapper name='Lista Programas Selección'>
      <Container breakpoint={null} className='w-full overflow-auto'>
        <Card className='h-full w-full'>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaInformativa;
