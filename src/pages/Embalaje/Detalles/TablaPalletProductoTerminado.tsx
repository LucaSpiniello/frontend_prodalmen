import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { TPalletProductoTerminado } from '../../../types/TypesEmbalaje.type';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { format } from '@formkit/tempo';
import Button from '../../../components/ui/Button';
import Tooltip from '../../../components/ui/Tooltip';
import { HeroEye } from '../../../components/icon/heroicons';
import { IoIosBarcode } from 'react-icons/io';
import ModalForm from '../../../components/ModalForm.modal';
import DetallePalletProductoTerminado from './DetallePalletProductoTerminado';
import { useParams } from 'react-router-dom';
import { fetchPalletProductoTerminado, fetchPalletsProductoTerminados, fetchProgramaEmbalajeIndividual } from '../../../redux/slices/embalajeSlice';
import { useAuth } from '../../../context/authContext';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import FormularioPalletProductoTerminado from '../Formularios/RegistroPalletProductoTerminado';
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal';


const TablaPalletProductoTerminado = () => {
  const { id } = useParams()
  const columnHelper = createColumnHelper<TPalletProductoTerminado>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [openModalPallet, setOpenModalPallet] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

	const pallet_producto_terminado = useAppSelector((state: RootState) => state.embalaje.pallets_producto_terminados)
  const programa_embalaje = useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual)

  useEffect(() => {
    if (id){
      dispatch(fetchProgramaEmbalajeIndividual({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchPalletsProductoTerminados({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.id}`}
        </div>
      ),
      header: 'Numero Pallet'
    }),
    columnHelper.accessor('codigo_pallet', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.codigo_pallet}`}
        </div>
      ),
      header: 'Código Pallet'
    }),
		columnHelper.accessor('calle_bodega_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.calle_bodega_label}`}
        </div>
      ),
      header: 'Calle Bodega'
    }),
		columnHelper.accessor('peso_pallet', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.peso_pallet}`}
        </div>
      ),
      header: 'Peso Pallet'
    }),
    columnHelper.accessor('info_pallet', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.variedad_programa} - ${info.row.original.calibre_programa} - ${info.row.original.calidad_programa}`}
        </div>
      ),
      header: 'Info Fruta'
    }),
		columnHelper.accessor('registrado_por_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.registrado_por_label}`}
        </div>
      ),
      header: 'Registrado Por'
    }),
		columnHelper.accessor('fecha_creacion', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short'}, 'es' )}`}
        </div>
      ),
      header: 'Registrado El'
    }),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id
				const [openDetailModal, setOpenDetailModal] = useState<boolean>(false)
				return (
					<div className='flex justify-center flex-wrap gap-4'>

							{/* <ModalForm  
								variant='solid'
								open = {openDetailModal}
								setOpen={setOpenDetailModal}
								icon={<HeroEye style={{ fontSize: 25 }}/>}
                size={800}
                title='Detalle Pallet Producto Terminado'
                modalAction={true}
								>
									<DetallePalletProductoTerminado id_pallet={info.row.original.id}/>
							</ModalForm> */}
            <Modal
              isOpen={openDetailModal}
              setIsOpen={setOpenDetailModal}
              isCentered={true}
              isStaticBackdrop={true}
            >
              <ModalHeader>Detalle Pallet Producto Terminado N° {info.row.original.id}</ModalHeader>
              <ModalBody>
                <DetallePalletProductoTerminado id_pallet={info.row.original.id}/>
              </ModalBody>
            </Modal>
            <Button color="blue" colorIntensity="600" className="hover:scale-105" variant="solid" title="Detalle Pallet"
              onClick={() => {setOpenDetailModal(true); dispatch(fetchPalletProductoTerminado({ id, params: { id_pallet: info.row.original.id }, token, verificar_token: verificarToken  }))}}
            > <HeroEye style={{ fontSize: 25 }}/></Button>


						<Tooltip text=''>
							<Button
								variant='solid'
                color='violet'
                colorIntensity='600'
								className='w-20 border-none rounded-md h-14 bg-blue-600 hover:bg-blue-500 flex items-center justify-center p-2 hover:scale-105'
								>
									<IoIosBarcode  style={{ fontSize: 35 }}/>
							</Button>
						</Tooltip>
					</div>
				)},
			header: 'Acciones'
			})
  ]

  const table = useReactTable({
    data: pallet_producto_terminado,
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
		<Container breakpoint={null} className="w-full !p-0">
			<Card className='w-full h-full'>
				<CardHeader>
					<CardTitle>Pallet Producto Terminado</CardTitle>
          <CardHeaderChild>
          {
							programa_embalaje && programa_embalaje.estado_embalaje == '2'
							? (
								<ModalForm
								variant='solid'
								color='sky'
								colorIntensity="800"
								open={openModalPallet}
								setOpen={setOpenModalPallet}
								textButton={`Registrar Pallet Producto Terminado`}
								width="w-full md:w-auto lg:w-auto"
								title='Registro Pallet Producto Terminado'
								>
									<FormularioPalletProductoTerminado setOpen={setOpenModalPallet}/>
								</ModalForm>
							)
							: null
						}
          </CardHeaderChild>
				</CardHeader>
				<CardBody className='overflow-auto'>
					<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
				</CardBody>
				<TableCardFooterTemplate table={table} />
			</Card>
		</Container>
  )
};


export default TablaPalletProductoTerminado
