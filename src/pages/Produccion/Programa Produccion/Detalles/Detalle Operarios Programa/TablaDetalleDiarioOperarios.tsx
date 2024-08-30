import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template'
import { useEffect, useState } from 'react';
import { TOperarioEnProduccion, TOperarioProduccion } from '../../../../../types/TypesProduccion.types';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { useAuth } from '../../../../../context/authContext';
import { fetchOperarioPrograma, fetchListaOperariosEnPrograma } from '../../../../../redux/slices/produccionSlice';
import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/Button';
import { HeroXCircle } from '../../../../../components/icon/heroicons';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import { fetchWithTokenDeleteAction } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { format } from '@formkit/tempo';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

const TablaDetalleDarioOperario = ({ rut }: { rut: string | undefined } ) => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const operario = useAppSelector((state: RootState) => state.programa_produccion.operario)
	const { id: id_programa } = useParams()

	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const { verificarToken } = useAuth()

	const eliminarDiaOperario = async (id: number) => {
		try {
		const token_verificado = await verificarToken(token!)
		
		if (!token_verificado) throw new Error('Token no verificado')
		
		const response = await fetchWithTokenDeleteAction(`api/produccion/${id_programa}/operarios/eliminar_registro_dia_por_rut_y_id/`, 
		{
			rut: rut,
			id: id
		}
		,token_verificado)

		if (response.ok){
			toast.success('Operario Eliminado correctamente')
			//@ts-ignore
			dispatch(fetchOperarioPrograma({ id: id_programa, params: { rut: rut }, token, verificar_token: verificarToken }))
			//@ts-ignore
			dispatch(fetchListaOperariosEnPrograma({ id_programa: id_programa, token, verificar_token: verificarToken }))
		} else if (response.status === 400){
			toast.error('No se pudo eliminar el operario')
		}
		} catch (error) {
		console.log("No se pudo completar la eliminacion")
		}
	}

  
  const columnHelper = createColumnHelper<TOperarioProduccion>();
  const columns = [
		columnHelper.accessor('nombre',{
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
              className='bg-red-800 hover:bg-red-700 border-red-700 hover:border-red-700 hover:scale-105'
              onClick={() => eliminarDiaOperario(row.id)}
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

export default TablaDetalleDarioOperario