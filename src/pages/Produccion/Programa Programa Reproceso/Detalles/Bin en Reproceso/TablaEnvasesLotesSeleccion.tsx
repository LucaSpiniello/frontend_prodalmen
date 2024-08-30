import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { fetchWithTokenDelete, fetchWithTokenDeleteAction, fetchWithTokenPost, fetchWithTokenPut } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { fetchBinsEnReproceso } from '../../../../../redux/slices/reprocesoSlice';
import { TBinEnReproceso } from '../../../../../types/TypesReproceso.types';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiCheckDouble } from 'react-icons/bi';
import { FaForward } from 'react-icons/fa';
import { HeroXMark } from '../../../../../components/icon/heroicons';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../../../components/ui/Button';
import { fetchProgramaReproceso } from "../../../../../redux/slices/reprocesoSlice";



interface IProduccionProps {
}


const TablaEnvasesLotes: FC<IProduccionProps> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const bins_en_reproceso = useAppSelector((state: RootState) => state.reproceso.bins_reproceso)
  const programa_reproceso = useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)

  const hoy = new Date()

  const actualizarEstadoEnvase = async (id_bin: number, id_binbodega: number) => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    
    const res = await fetchWithTokenPut(`api/reproceso/${id}/bins_en_reproceso/${id_bin}/`,
      {
        bin_procesado: true,
        binbodega: id_binbodega,
        reproceso: id,
        fecha_procesado: hoy
      },
      token_verificado
    )
    if (res.ok){
      toast.success("Bin Procesado Correctamente")
      //@ts-ignore
      dispatch(fetchBinsEnReproceso({ id, token, verificar_token: verificarToken }))
    } else {
      toast.error("No se pudo procesar el lote, vuelve a intentarlo")
    }
  }

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchProgramaReproceso({ id, token, verificar_token: verificarToken }))
  }, [])


  const columnHelper = createColumnHelper<TBinEnReproceso>();

  const columns = [
    columnHelper.accessor('codigo_tarja', {
      cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.codigo_tarja}`}
          </div>
        ),
        header: 'Código Tarja',
      }),
      columnHelper.accessor('calle_bodega', {
        cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.calle_bodega}`}
          </div>
        ),
        header: 'Ubicación',
      }),
      // columnHelper.accessor('kilos_fruta', {
      //   cell: (info) => (
      //     <div className='font-bold'>
      //       {`${info.row.original.kilos_fruta}`}
      //     </div>
      //   ),
      //   header: 'Kilos Fruta',
      // }),
      // columnHelper.accessor('variedad', {
      //   cell: (info) => (
      //     <div className='font-bold'>
      //       <span>{info.row.original.variedad}</span>
      //     </div>
      //   ),
      //   header: 'Variedad',
      // }),
    columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id_bin = info.row.original.id;
        const estado = info.row.original.bin_procesado
        // console.log(id, info.row.original.id_bin_bodega!, info.row.original.tipo_bin_bodega!)
        return (
          <div className='w-full flex justify-center gap-5'>
          {
            estado
              ? (
                <Button
                  title='Envase Procesado en Reproceso'
                  variant='solid'
                  color='emerald'
                  colorIntensity='700'
                  className='w-20 rounded-md h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                  >
                    <BiCheckDouble style={{ fontSize: 35 }}/>
                </Button>
                )
              : !(programa_reproceso?.estado! === '0' || programa_reproceso?.estado! !== '2' && programa_reproceso?.estado! <= '3')
                ?
                  (
                    <Button
                      title='Procesar Bin en Reproceso'
                      variant='solid'
                      color='amber'
                      colorIntensity='600'
                      onClick={() =>actualizarEstadoEnvase(id_bin, info.row.original.binbodega)}
                      className='w-20 rounded-md h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                      >
                        <FaForward style={{ fontSize: 25 }}/>
                    </Button>
                    )
                : null
          }
          {
            estado || (programa_reproceso?.estado! === '0' || programa_reproceso?.estado! !== '2' && programa_reproceso?.estado! <= '3')
              ? null
              : (
                <Button
                  title='Eliminar Bin de Reproceso'
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  className='w-20 rounded-md h-12 text-white flex items-center justify-center p-2 hover:scale-105'
                  onClick={ async () => {
                    try {
                      const token_verificado = await verificarToken(token!)
                      if (!token_verificado) throw new Error('Token no verificado')
                      const res = await fetchWithTokenDelete(`api/reproceso/${id}/bins_en_reproceso/${id_bin}/`, token_verificado)
                      if (res.ok){
                        toast.success("Bin Eliminado Correctamente")
                        dispatch(fetchBinsEnReproceso({ id: id, token, verificar_token: verificarToken }))
                      } else {
                        toast.error("No se pudo eliminar el bin, vuelva a intentarlo")
                      }
                    } catch (error: any) {
                      toast.error(error)
                    }
                  }}
                  >
                    <HeroXMark style={{ fontSize: 35 }}/>
                </Button>
              )
          }

          
        </div>
        )
      },
      header: 'Acciones'
    })
    
	];
  
  const table = useReactTable({
		data: bins_en_reproceso ? bins_en_reproceso : [],
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
    <Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
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
                placeholder='Busca Bin...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );
};

export default TablaEnvasesLotes;
