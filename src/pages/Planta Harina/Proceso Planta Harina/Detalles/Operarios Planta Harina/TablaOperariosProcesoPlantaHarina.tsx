import { FC, useEffect, useState } from 'react';
import ModalForm from '../../../../../components/ModalForm.modal';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { useParams } from 'react-router-dom';
import Button from '../../../../../components/ui/Button';
import { HeroEye } from '../../../../../components/icon/heroicons';
import { TOperarioPlantaHarina, TOperarioProcesoPlantaHarina } from '../../../../../types/typesPlantaHarina'
import TablaDetalleDarioOperarioPlantaHarina from './TablaDetalleDiarioProcesoPlantaHarina'
import { IoMdArrowRoundBack } from "react-icons/io";
import { fetchOperariosProcesoPlantaHarina, fetchOperariosProcesoPlantaHarinaPorDia } from '../../../../../redux/slices/procesoPlantaHarina';
import { useAuth } from '../../../../../context/authContext';
import { fetchWithTokenDeleteAction } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import DetalleDiasOperarioProcPH from './DetalleDiasOperarioProcPH';

const TablaOperariosProcesoPlantaHarina= ( ) => {
  const { id } = useParams()
  const operarios_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.operarios_proceso_planta_harina)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()



  const columnHelper = createColumnHelper<TOperarioProcesoPlantaHarina>();
  const columns = [
		columnHelper.accessor('nombres',{
			cell: (info) => (
				<div className='font-bold'>
					{info.row.original.nombres}
				</div>
			),
			header: 'Nombres',
		}),
    columnHelper.accessor('rut_operario',{
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.rut_operario}`}
				</div>
			),
			header: 'Rut',
		}),
    columnHelper.accessor('tipo_operario_label',{
      cell: (info) => (
        <div className="font-bold">{info.row.original.tipo_operario_label}</div>
      ),
      header: 'Tipo'
    }),
    columnHelper.display({
      id: 'acciones',
      cell: (props) => {
        const [openModalDetalle, setOpenModalDetalle] = useState<boolean>(false)
        return (
          <>
            <div className="font-bold ">
              <DetalleDiasOperarioProcPH datosOperario={props.row.original} open={openModalDetalle} setOpen={setOpenModalDetalle}></DetalleDiasOperarioProcPH>
              <Button color='red' className='ml-2' icon="HeroMinus" variant='solid' onClick={ async () => {
                try {
                  const token_verificado = await verificarToken(token)
                  if (!token_verificado) throw new Error('Token no verificado')
                  const response = await fetchWithTokenDeleteAction(`api/procesos/${id}/eliminar_operario/`, {operario_id: props.row.original.id},token_verificado)
                  if(response.ok){
                    toast.success('Operario Eliminado')
                    dispatch(fetchOperariosProcesoPlantaHarina({token: token, verificar_token: verificarToken, id: id}))
                  } else {
                    toast.error(`Error ${await response.json()}`)
                  }
                } catch (error: any) {
                  toast.error(error)
                }
              }}></Button>
            </div>
          </>
        )
      }
    })
  ]

  const table = useReactTable({
		data: operarios_proceso_planta_harina,
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
    <Container breakpoint={null} className='w-full !p-0'>
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
  );
};

export default TablaOperariosProcesoPlantaHarina;


