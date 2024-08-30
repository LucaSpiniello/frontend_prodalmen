import { useState } from 'react';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { format } from '@formkit/tempo';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../context/authContext';
import Button from '../../../../components/ui/Button';
import { HeroEye, HeroXCircle } from '../../../../components/icon/heroicons';
import toast from 'react-hot-toast';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { TOperarioEnEmbalaje } from '../../../../types/TypesEmbalaje.type';
import TablaDetalleDarioOperario from './TablaDetalleDiarioEmbalaje';
import { IoMdArrowRoundBack } from 'react-icons/io';
import DetalleDiasOperarioEmbalaje from './DetalleDiasOperarioEmbalaje';
import { fetchWithTokenDeleteAction } from '../../../../utils/peticiones.utils';
import { fetchOperariosProgramaEmbalaje } from '../../../../redux/slices/embalajeSlice';

const TablaOperarioEmbalaje= ( ) => {
  const { id } = useParams()
  const operarios = useAppSelector((state: RootState) => state.embalaje.operarios_programa_embalaje)
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [openDetalle, setOpenDetalle] = useState(false)

  const [rutOperario, setRutOperario] = useState<string | undefined>()

  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')



  const columnHelper = createColumnHelper<TOperarioEnEmbalaje>();
  const columns = [
		columnHelper.accessor('nombres',{
      id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold'>
					{info.row.original.nombres}
				</div>
			),
			header: 'Nombres',
		}),
    columnHelper.accessor('rut_operario',{
      id: 'ubicacion',
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.rut_operario}`}
				</div>
			),
			header: 'Rut',
		}),
    columnHelper.accessor('tipo_operario_label',{
      id: 'tipo_operario',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold'>
            {info.row.original.tipo_operario_label}
          </div>
        )
      },
			header: 'Tipo Operario',
		}),
    columnHelper.display({
      id: 'acciones',
      cell: (props) => {
        const [openModalDetalle, setOpenModalDetalle] = useState<boolean>(false)
        return (
          <>
            <div className="font-bold">
              <DetalleDiasOperarioEmbalaje datosOperario={props.row.original} open={openModalDetalle} setOpen={setOpenModalDetalle}></DetalleDiasOperarioEmbalaje>
              <Button color='red' className='ml-2' icon="HeroMinus" variant='solid' onClick={ async () => {
                try {
                  const token_verificado = await verificarToken(token)
                  if (!token_verificado) throw new Error('Token no verificado')
                  const response = await fetchWithTokenDeleteAction(`api/embalaje/${id}/eliminar_operario/`, {operario_id: props.row.original.id},token_verificado)
                  if(response.ok){
                    toast.success('Operario Eliminado')
                    dispatch(fetchOperariosProgramaEmbalaje({token: token, verificar_token: verificarToken, id: id}))
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
		data: operarios,
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
      {
        openDetalle
          ? (
            <Button
              onClick={() => setOpenDetalle(false)}
              className='flex items-center justify-between gap-2'
              >
              <IoMdArrowRoundBack style={{ fontSize: 25 }}/> Volver al tabla general
            </Button>
            )
          : null
      }
      {
        openDetalle
          ? <TablaDetalleDarioOperario rut={rutOperario}/>
          : (
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
          )
      }
    </Container>
  );
};

export default TablaOperarioEmbalaje;


