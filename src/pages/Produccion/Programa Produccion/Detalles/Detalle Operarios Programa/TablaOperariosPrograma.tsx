import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormularioRegistroOperarioPrograma from '../../Formularios/FormularioRegistroOperario';
import { TablePagination } from '@mui/material';
import { TDetalleDiaOperario, TListaOperarioEnProduccion, TOperarioEnProduccion, TOperarioProduccion, TProduccion } from '../../../../../types/TypesProduccion.types';
import useDarkMode from '../../../../../hooks/useDarkMode';
import { GoQuestion } from 'react-icons/go';
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
import { format } from '@formkit/tempo';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../../context/authContext';
import { fetchListaOperariosEnPrograma, fetchOperarioPrograma, fetchProgramaProduccion } from '../../../../../redux/slices/produccionSlice';
import Button from '../../../../../components/ui/Button';
import { HeroEye, HeroXCircle, HeroXMark } from '../../../../../components/icon/heroicons';
import { fetchWithTokenDelete, fetchWithTokenDeleteAction, fetchWithTokenPost } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { optionsOperarios } from '../../../../../utils/options.constantes';
import TablaDetalleDarioOperario from './TablaDetalleDiarioOperarios';
import { BiLeftArrow } from 'react-icons/bi';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Modal, { ModalBody, ModalHeader } from '../../../../../components/ui/Modal';
import DetalleDiasOperario from './DetalleDiasOperario';
import { info } from 'console';

interface IRendimientoMuestra {
  programa_produccion: TProduccion
}


const TablaOperariosPrograma: FC<IRendimientoMuestra> = ( ) => {
  const { id } = useParams()
  const operarios = useAppSelector((state: RootState) => state.programa_produccion.listaOperarios)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    if (id) {
      dispatch(fetchListaOperariosEnPrograma({token: token, verificar_token: verificarToken, id_programa: id}))
    }
  }, [id])

  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const columnHelper = createColumnHelper<TListaOperarioEnProduccion>();
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
              <DetalleDiasOperario datosOperario={props.row.original} open={openModalDetalle} setOpen={setOpenModalDetalle}></DetalleDiasOperario>
              <Button color='red' className='ml-2' icon="HeroMinus" variant='solid' onClick={ async () => {
                try {
                  const token_verificado = await verificarToken(token)
                  if (!token_verificado) throw new Error('Token no verificado')
                  const response = await fetchWithTokenDeleteAction(`api/produccion/${id}/eliminar_operario/`, {operario_id: props.row.original.id},token_verificado)
                  if(response.ok){
                    toast.success('Operario Eliminado')
                    dispatch(fetchListaOperariosEnPrograma({token: token, verificar_token: verificarToken, id_programa: id}))
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
			pagination: { pageSize: 5 },
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
              placeholder='Busca operario...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
          {/* TOTAL KILOS POR OPERARIO */}
          {/* <div className="rounded-md flex flex-col bg-green-700 py-1 text-white  px-6 items-center">
            <label htmlFor="kilos">Kilos Totales Operarios</label>
            <span id="kilos">{operarios.reduce((acc, op) => op.total_kilos_producidos + acc, 0).toLocaleString()}</span>
          </div> */}
        </CardHeader>
        <CardBody className='overflow-x-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  );
};

export default TablaOperariosPrograma;


