import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useAuth } from '../../../context/authContext';
import { fetchLoteRechazadosGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import TableTemplate from '../../../templates/common/TableParts.template';
import Card, { CardBody } from '../../../components/ui/Card';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { TLoteRechazado } from '../../../types/TypesRecepcionMP.types';
import Container from '../../../components/layouts/Container/Container';
import SelectReact from '../../../components/form/SelectReact';
import { optionResultados } from '../../../utils/options.constantes';
import { useParams } from 'react-router-dom';
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { OPTIONS_GUIA, TTabsguia } from './Detalle Guia/ButtonsFooterDetalleGuia';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IFooterDetalleRechazadoProps {
  setActiveTab: Dispatch<SetStateAction<TTabsguia>>
}
const FooterDetalleRechazado: FC<IFooterDetalleRechazadoProps> = ({ setActiveTab }) => {
  const lotes_rechazados = useAppSelector((state: RootState) => state.recepcionmp.lotes_rechazados)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { id } = useParams()

  useEffect(() => {
    if (id){
      //@ts-ignore
      dispatch(fetchLoteRechazadosGuiaRecepcion({ id, token, verificar_token: verificarToken }))
    }
  }, [id])

  const cambioMotivoRechazo = async (id_lote: number ,motivo: string) => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/lotes/actualizar_lote_rechazado/`, {
      [`${id_lote}`]: {resultado_rechazo: motivo}
    }, token_verificado)
    if (res.ok){
      toast.success('Se ha actualizado el rechazo exitosamente')
      //@ts-ignore
      // dispatch(fetchLoteRechazadosGuiaRecepcion({ id, token, verificar_token: verificarToken }))
      setActiveTab(OPTIONS_GUIA.LA)
    } else {
      toast.error('No se ha podido actualizar el rechazo')
    }
  }

  const columnHelper = createColumnHelper<TLoteRechazado>();
  const columns = [
		columnHelper.display({
      id: 'numero_lote_rechazado',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_lote_rechazado}`}
				</div>
			),
			header: 'N° Lote Rechazado',
		}),
		columnHelper.display({
      id: 'kilos_brutos_1_camion',
			cell: (info) => (
				<div className='font-bold text-center'>
					{info.row.original.resultado_rechazo_label}
				</div>
			),
			header: 'Motivo del Rechazo',
		}),
    columnHelper.display({
      id: 'kilos_tara',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold text-center'>
            <SelectReact
                options={optionResultados}
                id='camion'
                name='camion' 
                placeholder='Selecciona un envase'
                value={optionResultados.find(option => option?.value === row?.resultado_rechazo)}
                className='h-14 w-full'
                onChange={(value: any) => {
                  cambioMotivoRechazo(row.id, value.value)
                }}
              />
          </div>
        )
      },
			header: 'Resultado',
		}),
  ]

  const table = useReactTable({
		data: lotes_rechazados,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
	});

  return (
    <Container breakpoint={null} className='w-full'>
      <Card className='h-full w-full'>
        <CardBody className='overflow-x-auto'>
          {lotes_rechazados && lotes_rechazados.length === 0 ? (<div className='text-center'>
              <span className='text-4xl'>No hay lotes rechazados</span>
            </div>) 
          :
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
          }
        </CardBody>
      </Card>
    </Container>
  );
};

export default FooterDetalleRechazado;