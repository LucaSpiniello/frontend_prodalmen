import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template'
import { useEffect, useState } from 'react';
import { TOperarioEnProduccion, TOperarioProduccion } from '../../../../../types/TypesProduccion.types';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { useAuth } from '../../../../../context/authContext';
import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/Button';
import { HeroXCircle } from '../../../../../components/icon/heroicons';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import { fetchWithTokenDeleteAction } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { format } from '@formkit/tempo';
import { TOperarioReproceso } from '../../../../../types/TypesReproceso.types';
import { fetchOperarioEnReproceso } from '../../../../../redux/slices/reprocesoSlice';
import { TOperarioSeleccion } from '../../../../../types/TypesSeleccion.type';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TOperarioPlantaHarina, TOperarioPlantaHarinaDiario, TOperarioProcesoPlantaHarina, TOperarioProcesoPlantaHarinaDiario } from '../../../../../types/typesPlantaHarina';
import { eliminar_dia_operario_planta_harina, fetchOperariosPlantaHarinaPorDia } from '../../../../../redux/slices/plantaHarinaSlice';
import { eliminar_dia_operario_proceso_planta_harina, fetchOperariosProcesoPlantaHarinaPorDia } from '../../../../../redux/slices/procesoPlantaHarina';

const TablaDetalleDarioOperarioProcesoPlantaHarina = ({ rut }: { rut: string | undefined } ) => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const operario = useAppSelector((state: RootState) => state.proceso_planta_harina.operarios_proceso_planta_harina_diario)
	const { id: id_programa } = useParams()


	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()

  useEffect(() => {
		if (rut){
		 dispatch(fetchOperariosProcesoPlantaHarinaPorDia({ id: parseInt(id_programa!), data: { rut: rut }, token, verificar_token: verificarToken }))
		}
	 }, [rut])

	console.log(operario)



  
  const columnHelper = createColumnHelper<TOperarioProcesoPlantaHarinaDiario>();
  const columns = [
		columnHelper.accessor('nombres',{
      id: 'nombre',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.nombres}`}
				</div>
			),
			header: 'Nombres',
		}),
    columnHelper.accessor('tipo_operario_label',{
      id: 'tipo_operario_label',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.tipo_operario_label}`}
				</div>
			),
			header: 'Tipo Operario',
		}),
    columnHelper.accessor('kilos',{
      id: 'kilos',
			cell: (info) => (
				<div className='font-bold'>
					{`${(info.row.original.kilos ?? 0).toLocaleString()} kgs`}
				</div>
			),
			header: 'Kilos por día',
		}),
		columnHelper.accessor('dia',{
      id: 'dia',
			cell: (info) => (
				<div className='font-bold'>
					{`${(format(info.row.original.dia, { date: 'long'}, 'es' ))}`}
				</div>
			),
			header: 'Día asistido',
		}),
    columnHelper.display({
      id: 'acciones',
			cell: (info) => {
        const row = info.row.original

        return (
          <div className=' h-full w-full flex items-center justify-center gap-5'>
            <Button
              variant='solid'
							color='red'
              className='hover:scale-105'
              onClick={() => dispatch(eliminar_dia_operario_proceso_planta_harina({ id: parseInt(id_programa!), data: { rut: row.rut_operario }, token, verificar_token: verificarToken }))}
              >
                <HeroXCircle style={{ fontSize: 25 }}/> 
            </Button>
        </div>
      )},
			header: 'Acciones',
		}),
  ]


  const table = useReactTable({
		data: operario,
    columns,
		state: {
			sorting,
			globalFilter,
		},
    enableRowSelection: true,
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 4 },
		},
	});
  return (
    <Container breakpoint={null} className='w-full h-full'>
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

				</CardHeader>
        <CardBody className='overflow-x-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaDetalleDarioOperarioProcesoPlantaHarina