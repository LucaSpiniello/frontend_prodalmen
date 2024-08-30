import { FC, HTMLProps, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { fetchWithTokenDelete, fetchWithTokenPut } from '../../../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { fetchBinsEnReproceso } from '../../../../../redux/slices/reprocesoSlice';
import { TBinEnReproceso } from '../../../../../types/TypesReproceso.types';
import Tooltip from '../../../../../components/ui/Tooltip';
import { BiCheckDouble, BiSolidCheckboxChecked } from 'react-icons/bi';
import { FaForward } from 'react-icons/fa';
import { HeroPencil, HeroPencilSquare, HeroXMark } from '../../../../../components/icon/heroicons';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../../../components/ui/Button';
import { TBinParaProgramaPlantaHarina, TRechazosPlantaHarina } from '../../../../../types/typesPlantaHarina';
import { actualizar_estado_bin_para_planta_harina, actualizar_tipo_rechazo_planta_harina, eliminar_bin_para_planta_harina, eliminar_rechazo_planta_harina, fetchMetricasRechazosPlantaHarina, fetchRechazosPlantaHarina, procesado_masivo_bin_para_planta_harina } from '../../../../../redux/slices/plantaHarinaSlice';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Checkbox from '../../../../../components/form/Checkbox';
import { GiCheckedShield } from 'react-icons/gi';
import { ImRadioChecked } from 'react-icons/im';
import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact';
import { optionTipoRechazoPlantaHarina } from '../../../../../utils/options.constantes';
import ModalForm from '../../../../../components/ModalForm.modal';
import FormularioTipoRechazoPlantaHarina from '../../Formularios/FormularioTipoRechazoPlantaHarina';



interface IProduccionProps {
}


const TablaRechazosPlantaHarina: FC<IProduccionProps> = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const rechazos_planta_harina = useAppSelector((state: RootState) => state.planta_harina.rechazos_planta_harina)
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  
  const columnHelper = createColumnHelper<TRechazosPlantaHarina>()
  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      cell: (info) => (
          <div className='font-bold'>
            {`${info.row.original.id}`}
          </div>
        ),
        header: 'ID',
      }),
      columnHelper.accessor('kilos_rechazo', {
        id: 'kilos_rechazo',
        cell: (info) => (
            <div className='font-bold'>
              {`${info.row.original.kilos_rechazo}`}
            </div>
          ),
          header: 'Kilos',
        }),
      columnHelper.accessor('tipo_rechazo_label', {
        id: 'tipo_rechazo',
        cell: (info) => (
            <div className='font-bold'>
             {
              editar
                ? (
                  <SelectReact
                    placeholder="Seleccione un año"
                    options={optionTipoRechazoPlantaHarina}
                    id='anio'
                    name='anio'
                    value={optionTipoRechazoPlantaHarina.find(option => option?.value === info.row.original.tipo_rechazo)}
                    onChange={(value: any) => {
                      dispatch(actualizar_tipo_rechazo_planta_harina({ 
                        id: parseInt(id!), 
                        params: { id_rechazo: info.row.original.id }, 
                        token, 
                        verificar_token: verificarToken,
                        data: { tipo_rechazo: value.value }
                      }))
                    }}
                  />
                )
                : <span>{`${info.row.original.tipo_rechazo_label}`}</span>
             }
            </div>
          ),
          header: 'Tipo Rechazo',
        }),
      columnHelper.accessor('registrado_por_nombre', {
        id: 'registrado_por',
        cell: (info) => (
            <div className='font-bold'>
              {`${info.row.original.registrado_por_nombre}`}
            </div>
          ),
          header: 'Registrado Por',
        }),      
    columnHelper.display({
			id: 'actions',
			cell: (info) => {

        return (
          <div className='w-full flex justify-center gap-5'>
            {
              !(programa_planta_harina?.estado_programa! === '0' || programa_planta_harina?.estado_programa! !== '2' && programa_planta_harina?.estado_programa! <= '3')
              ?
                (
                  <>
                  { editar ? 
                    <Button
                      variant='solid'
                      color='red'
                      onClick={() => {setEditar(false)}}
                      className='hover:scale-105'
                    >Cancelar</Button>
                    :
                    <Button
                      title='Editar Tipo Rechazo'
                      variant='solid'
                      color='sky'
                      colorIntensity='700'
                      onClick={() => { setEditar(true) }}  // Cambia entre true y false
                      className='hover:scale-105'
                    >
                      <HeroPencilSquare style={{ fontSize: 25 }}/>
                    </Button> 
                  }
                  </>
                )
            : null
      }
          {
            (programa_planta_harina?.estado_programa! === '0' || programa_planta_harina?.estado_programa! !== '2' && programa_planta_harina?.estado_programa! <= '3')
              ? null
              : (
                <Button
                  title='Eliminar Rechazo Planta Harina'
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  onClick={() => dispatch(eliminar_rechazo_planta_harina({ id: parseInt(id!), params: { id_rechazo: info.row.original.id }, token, verificar_token: verificarToken  }))}
                  className='hover:scale-105'
                  >
                    <HeroXMark style={{ fontSize: 25 }}/>
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
		data: rechazos_planta_harina ? rechazos_planta_harina : [],
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
    { id: 'id', className: 'w-10' },
    { id: 'kilos_rechazo', className: 'w-20'},
  ]

  return (
    <Container  className={`'w-full ${editar ? 'h-[400px]' : ''} overflow-auto !p-0'`}>
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
                placeholder='Busca Envase...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </FieldWrap>
            {
              programa_planta_harina?.estado_programa === '2'
                ? (
                  <ModalForm
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    open={openModal}
                    setOpen={setOpenModal}
                    textButton='Registrar Tipo Rechazo'
                    title='Registro Rechazo Planta Harina'
                    >
                      <FormularioTipoRechazoPlantaHarina setOpen={setOpenModal}/>
                  </ModalForm>
                )
                : null
            }
          </CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem] overflow-x-auto' table={table}  columnas={columnas}/>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );
};

export default TablaRechazosPlantaHarina;
