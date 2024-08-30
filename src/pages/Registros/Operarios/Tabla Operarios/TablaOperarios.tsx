import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { TOperarios } from "../../../../types/TypesRegistros.types";
import { FC, useState } from "react";
import useDarkMode from "../../../../hooks/useDarkMode";
import ModalForm from "../../../../components/ModalForm.modal";
import { HeroEye, HeroXMark } from "../../../../components/icon/heroicons";
import Tooltip from "../../../../components/ui/Tooltip";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { deleteOperario } from "../../../../redux/slices/operarioSlice";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import FieldWrap from "../../../../components/form/FieldWrap";
import Icon from "../../../../components/icon/Icon";
import Input from "../../../../components/form/Input";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../../components/ui/Card";
import Badge from "../../../../components/ui/Badge";
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template";
import FormularioRegistroOperario from "../Formularios/RegistroOperario";
import { RootState } from "../../../../redux/store";
import DetalleOperario from "../DetalleOperario";
import { useAuth } from "../../../../context/authContext";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../components/ui/Button";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";



const columnHelper = createColumnHelper<TOperarios>();


interface IOperarioProps {
  data: TOperarios[] | []
}


const TablaOperarios: FC<IOperarioProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [modalStatus, setModalStatus] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { isDarkTheme } = useDarkMode();
  const token = useAppSelector((state: RootState) => state.auth.authTokens) 
  const { verificarToken } = useAuth()
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)

  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);
  


  const columns = [
    columnHelper.accessor('rut', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.rut}`}
        </div>
      ),
      header: 'Rut '
    }),
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className='font-bold '>
          {`${info.row.original.nombre}`}
        </div>
      ),
      header: 'Nombre',
    }),
    columnHelper.accessor('apellido', {
      cell: (info) => (
        <div className='font-bold truncate'>
          {`${info.row.original.apellido}`}
        </div>
      ),
      header: 'Apellido',
    }),
    columnHelper.accessor('activo', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.activo ? 'Si' : 'No'}`}
        </div>
      ),
      header: 'Estado',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const id = info.row.original.id;
        const [detalleModalStatus, setDetalleModalStatus] = useState(false);
        const [selectedId, setSelectedId] = useState<number>(0);
				const [deleteModalStatus, setDeleteModalStatus] = useState(false);
				const confirmDelete = (id: number) => {
					dispatch(deleteOperario({ id, token, verificar_token: verificarToken }));
					setDeleteModalStatus(false); 
				  };
        return (
          <div className='h-full w-full flex gap-2 flex-wrap justify-center'>
            <ModalForm
              open={detalleModalStatus}
              setOpen={setDetalleModalStatus}
              textTool='Detalle'
              variant='solid'
              title='Detalle Operario'
              size={700}
              modalAction={true}
              width={`hover:scale-105`}
              icon={<HeroEye style={{ fontSize: 25 }} />}
            >
              <DetalleOperario id={id} setOpen={setDetalleModalStatus}/>
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
									message="¿Estás seguro de que deseas eliminar este productor?"
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
    <PageWrapper name='Lista Operarios'>
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
              placeholder='Busca al operario...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <ModalForm
            open={modalStatus}
            setOpen={setModalStatus}
            title='Registro Operario'
            variant='solid'
            textButton='Agregar Operario'
            size={900}
            width={`w-full h-11 md:w-full px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
          >
            <FormularioRegistroOperario setOpen={setModalStatus} />
          </ModalForm>
        </SubheaderRight>
      </Subheader>
      <Container breakpoint={null} className="w-full">
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Operarios</CardTitle>
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

export default TablaOperarios;
