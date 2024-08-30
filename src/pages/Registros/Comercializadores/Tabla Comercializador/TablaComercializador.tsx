import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { appPages } from '../../../../config/pages.config';
import Card, {
  CardBody,
  CardHeader,
  CardHeaderChild,
  CardTitle,
} from '../../../../components/ui/Card';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, {
  TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';

import Subheader, {
  SubheaderLeft,
  SubheaderRight,
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import { format } from "@formkit/tempo"
import useDarkMode from '../../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../../components/icon/heroicons'
import DetalleComercializador from '../DetalleComercializador';
import FormularioEdicionComercializador from '../Formularios/EdicionComercializadores';
import FormularioRegistroComercializador from '../Formularios/RegistroComercializadores';
import Tooltip from '../../../../components/ui/Tooltip';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { TComercializador } from '../../../../types/TypesRegistros.types';
import ModalForm from '../../../../components/ModalForm.modal';
import { deleteComercializador } from '../../../../redux/slices/comercializadores';
import { useAuth } from '../../../../context/authContext';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../../components/ui/Button';
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";

const columnHelper = createColumnHelper<TComercializador>();


interface IFormComercializadorProps {
  data: TComercializador[] | [],
}


const TablaComercializadores: FC<IFormComercializadorProps> = ({ data, }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [modalStatus, setModalStatus] = useState<boolean>(false)
  const { isDarkTheme } = useDarkMode();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const userGroup = useAppSelector((state: RootState) => state.auth.grupos)

  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);




  const columns = [
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className='font-bold '>
          {
            info.row.original.nombre
              ? <span>{`${info.row.original.nombre}`}</span>
              : <span>No hay registros aún</span>
          }
        </div>
      ),
      header: 'Nombre',
    }),
    columnHelper.accessor('razon_social', {
      cell: (info) => (
        <div className='font-bold truncate'>
          {
            info.row.original.razon_social
              ? <span>{`${info.row.original.razon_social}`}</span>
              : <span>No hay registros aún</span>
          }

        </div>
      ),
      header: 'Razón Social',
    }),
    columnHelper.accessor('giro', {
      cell: (info) => (
        <div className='font-bold'>
          {
            info.row.original.giro
              ? <span>{`${info.row.original.giro}`}</span>
              : <span>No hay registros aún</span>
          }

        </div>
      ),
      header: 'Giro',
    }),
    columnHelper.accessor('email_comercializador', {
      cell: (info) => {
        return (
          <div className='font-bold truncate'>
          {
            info.row.original.email_comercializador
              ? <span>{`${info.row.original.email_comercializador}`}</span>
              : <span>No hay registros aún</span>
          }
        </div>
        )
      },
      header: 'Email',
    }),
    columnHelper.accessor('direccion', {
      cell: (info) => (
        <div className='font-bold'>
          {
            info.row.original.direccion
              ? <span>{`${info.row.original.direccion}`}</span>
              : <span>No hay registros aún</span>
          }
        </div>
      ),
      header: 'Dirección',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const id = info.row.original.id;
        const [detalleModalStatus, setDetalleModalStatus] = useState(false)
        const [selectedId, setSelectedId] = useState<number>(0);
				const [deleteModalStatus, setDeleteModalStatus] = useState(false);
				const confirmDelete = (id: number) => {
					dispatch(deleteComercializador({ id, token, verificar_token: verificarToken }));
					setDeleteModalStatus(false); 
				  };
        return (
          <div className='h-full w-full justify-center flex gap-2 flex-wrap'>
            <ModalForm
              open={detalleModalStatus}
              setOpen={setDetalleModalStatus}
              textTool='Detalle'
              title='Detalle Comercializador'
              variant='solid'
              color='blue'
              colorIntensity='700'
              size={900}
              width={`hover:scale-105`}
              icon={<HeroEye style={{ fontSize: 25 }} />}
            >
              <DetalleComercializador id={id} setOpen={setDetalleModalStatus} />
            </ModalForm>

            {hasGroup(['registros-admin']) && (
							<>
								<Tooltip text='Eliminar'>
								<Button onClick={() => {
									setSelectedId(id);
									setDeleteModalStatus(true);
								}}
									variant="solid"
									color="red"
									colorIntensity="700"
									className={`hover:scale-105`}>
									<HeroXMark style={{ fontSize: 25 }} />
								</Button>
								</Tooltip>
								<DeleteConfirmationModal
									isOpen={deleteModalStatus}
									onClose={() => setDeleteModalStatus(false)}
									onConfirm={() => confirmDelete(selectedId)}
									message="¿Estás seguro de que deseas eliminar este comercializador?"
								/>
							</>
							)}
          </div>
        );
      },
      header: 'Acciones'
    }),

  ];




  const table = useReactTable({
    data,
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
    <PageWrapper name='Lista Comercializadores'>
      <Subheader>
        <SubheaderLeft>
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
              placeholder='Busca al comercializador ...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <ModalForm
            open={modalStatus}
            setOpen={setModalStatus}
            title='Registro Comercializador'
            variant='solid'
            textButton='Agregar Comercializador'
            width={`px-6 py-3 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105`}
            size={900}
          >
            <FormularioRegistroComercializador setOpen={setModalStatus} />
          </ModalForm>
        </SubheaderRight>
      </Subheader>
      <Container breakpoint={null} className='w-full'>
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Comercializador</CardTitle>
              <Badge
                variant='outline'
                className='border-transparent px-4'
                rounded='rounded-full'>
                {table.getFilteredRowModel().rows.length} registros
              </Badge>
            </CardHeaderChild>
            <CardHeaderChild>
            </CardHeaderChild>
          </CardHeader>
          <CardBody className='overflow-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaComercializadores;
