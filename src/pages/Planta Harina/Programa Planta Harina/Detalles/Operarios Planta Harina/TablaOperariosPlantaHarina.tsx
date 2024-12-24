import { useEffect, useState } from 'react';
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
import { useAuth } from '../../../../../context/authContext';
import Button from '../../../../../components/ui/Button';
import { HeroEye } from '../../../../../components/icon/heroicons';

import FormularioRegistroOperarioPlantaHarina from '../../Formularios/FormularioRegistroOperarioPlantaHarina'
import { TOperarioPlantaHarina } from '../../../../../types/typesPlantaHarina'
import TablaDetalleDarioOperarioPlantaHarina from './TablaDetalleDiarioPlantaHarina'
import { fetchOperariosPlantaHarina, fetchOperariosPlantaHarinaPorDia, fetchProgramaPlantaHarina } from '../../../../../redux/slices/plantaHarinaSlice'
import { IoMdArrowRoundBack } from "react-icons/io";
import { optionsOperarios } from '../../../../../utils/options.constantes';
import toast from 'react-hot-toast';
import { fetchWithTokenDeleteAction, fetchWithTokenPost } from '../../../../../utils/peticiones.utils';
import DetalleDiasOperarioProgPH from './DetalleDiasOperarioProgPH';
import { useDispatch } from 'react-redux';

const TablaOperarioPlantaHarina= ( ) => {
  const { id } = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [openDetalle, setOpenDetalle] = useState(false)
  const operarios_planta_harina = useAppSelector((state: RootState) => state.planta_harina.operarios_planta_harina)
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const [rutOperario, setRutOperario] = useState<string>('')
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const dispatch = useDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()


  // useEffect(() => {
  //  if (rutOperario){
  //   dispatch(fetchOperariosPlantaHarinaPorDia({ id: parseInt(id!), data: { rut: rutOperario }, token, verificar_token: verificarToken }))
  //  }
  // }, [rutOperario])

  useEffect(() => {
		if (id){
			dispatch(fetchOperariosPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
		}
	}, [id])


  const columnHelper = createColumnHelper<TOperarioPlantaHarina>();
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
              <DetalleDiasOperarioProgPH datosOperario={props.row.original} open={openModalDetalle} setOpen={setOpenModalDetalle}></DetalleDiasOperarioProgPH>
              <Button color='red' className='ml-2' icon="HeroMinus" variant='solid' onClick={ async () => {
                try {
                  const token_verificado = await verificarToken(token)
                  if (!token_verificado) throw new Error('Token no verificado')
                  const response = await fetchWithTokenDeleteAction(`api/programas/${id}/eliminar_operario/`, {operario_id: props.row.original.id},token_verificado)
                  if(response.ok){
                    toast.success('Operario Eliminado')
                    dispatch(fetchOperariosPlantaHarina({token: token, verificar_token: verificarToken, id: id}))
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
		data: operarios_planta_harina,
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
                {
                  (programa_planta_harina?.estado_programa === '5' || programa_planta_harina?.estado_programa !== '2')
                    ? 
                    (null
                      )
                    : (
                      <>
                        <ModalForm
                          title={`Registro Operario al Programa `}
                          open={open}
                          setOpen={setOpen}
                          variant='solid'
                          width='bg-blue-800 hover:bg-blue-700 hover:scale-105 px-7 py-2 text-lg text-white border-none'
                          textButton={`Registrar Operarios al programa`}
                          >
                          <FormularioRegistroOperarioPlantaHarina setOpen={setOpen}/>
                        </ModalForm>
                        
                      </>
                    )
                }
              </CardHeader>
              <CardBody className='overflow-x-auto'>
                <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
              </CardBody>
              <TableCardFooterTemplate table={table} />
            </Card>
    </Container>
  );
};

export default TablaOperarioPlantaHarina;


