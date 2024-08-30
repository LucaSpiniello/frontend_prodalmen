import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useAuth } from "../../../../context/authContext";
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { RootState } from "../../../../redux/store";
import { TAgrupacion, TBodegaNeutro } from "../../../../types/TypesBodega.types";
import { fetchWithTokenPost } from "../../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import TableTemplate, { TableCardFooterTemplate, TableColumn } from "../../../../templates/common/TableParts.template";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader } from "../../../../components/ui/Card";
import FieldWrap from "../../../../components/form/FieldWrap";
import Icon from "../../../../components/icon/Icon";
import Input from "../../../../components/form/Input";
import ModalForm from "../../../../components/ModalForm.modal";
import ModalConfirmacion from "../../../../components/ModalConfirmacion";
import { TBinBodega } from "../../../../types/TypesSeleccion.type";
import Tooltip from "../../../../components/ui/Tooltip";
import Button from "../../../../components/ui/Button";
import { AGREGAR_BIN_BODEGA, QUITAR_BIN_AGRUPADO, VACIAR_TABLA_BIN_AGRUPADO } from "../../../../redux/slices/bodegaSlice";
import { BiXCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";



interface IRendimientoMuestra {

}


const TablaBinParaAgrupar: FC<IRendimientoMuestra> = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [openButton, setOpenButton] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [seleccionConfirm, setSeleccionConfirm] = useState(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState<{ [key: string]: boolean }>({});
  const bins_en_agrupacion = useAppSelector((state: RootState) => state.bodegas.bines_en_agrupacion)


  useEffect(() => {
    dispatch(VACIAR_TABLA_BIN_AGRUPADO())
  }, [])

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxSeleccionados(prevState => {
      // Si se está marcando un checkbox, desmarca todos los demás
      const newState = { [id]: checked };
      if (checked) {
        for (const key in prevState) {
          if (key !== id) {
            newState[key] = false;
          }
        }
      }
      return newState;
    });
  };

  useEffect(() => {
    // Actualiza los filtros de columna solo cuando cambian los checkboxes seleccionados
    const newColumnFilters = Object.entries(checkboxSeleccionados)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => ({ id: 'binbodega', value: id }));
    setColumnFilters(newColumnFilters);
  }, [checkboxSeleccionados]);

  const columnHelper = createColumnHelper<TBinBodega>();

  const columns = [
    columnHelper.accessor('binbodega', {
      cell: (info) => (
          <div className='font-bold text-center'>
            {`${info.row.original.binbodega}`}
          </div>
        ),
        header: 'Código Tarja',
      }),
      columnHelper.accessor('programa', {
        cell: (info) => (
          <div className='font-bold text-center'>
            {`Programa N° ${info.row.original.programa}`}
          </div>
        ),
        header: 'Programa',
      }),
      columnHelper.accessor('variedad', {
        cell: (info) => (
          <div className='font-bold text-center'>
            <span>{`${info.row.original.variedad}`}</span>
          </div>
        ),
        header: 'Variedad',
		  }),
      columnHelper.accessor('calibre', {
        cell: (info) => (
          <div className='font-bold text-center'>
            <span>{`${info.row.original.calibre}`}</span>
          </div>
        ),
        header: 'Calibre',
		  }),
      columnHelper.accessor('kilos_bin', {
        cell: (info) => (
          <div className='font-bold text-center'>
            {`${info.row.original.kilos_bin}`}
          </div>
        ),
        header: 'Kilos Fruta',
		  }),columnHelper.display({
        id: 'actions',
        cell: (info) => {
          const id = info.row.original.id;
        
          return (
            <div className='w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>
  
              <Tooltip text='Quitar Bin'>
                <Button
                  variant='solid'
                  onClick={() => {
                    dispatch(QUITAR_BIN_AGRUPADO(id))
                    dispatch(AGREGAR_BIN_BODEGA(info.row.original))
                  }}
                  className='w-full  rounded-md h-12 bg-red-600 hover:bg-red-500 border-none flex items-center justify-center hover:scale-105'>
                  <BiXCircle style={{ fontSize: 40, color: 'white' }}/>
                </Button>
              </Tooltip>
            
  
            </div>
          );
        },
        header: 'Acciones'
      }),
	];
  
  const table = useReactTable({
    data: bins_en_agrupacion,
		columns,
		state: {
			sorting,
			globalFilter,
      columnFilters
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
	})


  const agregarBinAgrupacion = async () => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/agrupacion/${id}/add_bin/`, 
      {"bins": bins_en_agrupacion}, token_verificado)
    if (response.ok){
      toast.success('Bins fueron ingresados exitosamente!!')
    } else {
      toast.error('No se pudieron ingresar los bines')
    }
  }

  useEffect(() => {
    if (seleccionConfirm){
      agregarBinAgrupacion()
      navigate(`/bdg/acciones/agrupaciones/agrupacion/${id}/`, { replace: true })

    } 

    return () => {
      setSeleccionConfirm(false)
    }
  }, [seleccionConfirm])

  const columnas: TableColumn[] = [
    // { id: 'peso', header: 'Fruta Neta', className: 'w-32' },
    // { id: 'id', header: 'Código Tarja', className: 'w-40' },
    { id: 'actions', header: '', className: 'w-28' },
    { id: 'kilos_bin', header: '', className: 'w-32' },
    { id: 'calibre', header: '', className: 'w-32' },
  ]

  

  return (
    <Container breakpoint={null} className='w-full overflow-auto p-0'>
				<Card className='h-full w-full p-0'>
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
              bins_en_agrupacion.length >= 1
                ? (
                  <ModalForm
                    open={openButton}
                    setOpen={setOpenButton}
                    textTool='Agregar A Agrupación'
                    variant="solid"
                    width={`w-56 h-12 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105 border-none`}
                    textButton={`Agregar a Agrupacion de Bin N° ${id}`}
                  >
                    <ModalConfirmacion 
                      mensaje='¿Estas seguro de agregar estos bines a selección?'
                      confirmacion={seleccionConfirm}
                      setConfirmacion={setSeleccionConfirm}
                      setOpen={setOpenButton} 
                      />
                  </ModalForm>
                  )
                : null
            }
          </CardHeader>
					<CardBody className='overflow-x-auto'>
            
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
  );

};

export default TablaBinParaAgrupar;


