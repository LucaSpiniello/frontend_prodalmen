import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TLoteGuia } from "../../../types/TypesRecepcionMP.types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { BiCheckDouble } from "react-icons/bi";
import TableTemplate, { TableColumn } from "../../../templates/common/TableParts.template";
import Card, { CardBody } from "../../../components/ui/Card";
import { DuoDoubleCheck } from "../../../components/icon/duotone";
import Container from "../../../components/layouts/Container/Container";
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from "../../../components/ui/Dropdown";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../context/authContext";
import { fetchLotesAprobadosGuiaRecepcion } from "../../../redux/slices/recepcionmp";
import { useParams } from "react-router-dom";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchCamiones } from "../../../redux/slices/camionesSlice";

const TablaDetalleGuiaFinalizada = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const columnHelper = createColumnHelper<TLoteGuia>();
  const { id } = useParams()

  const lotes = useAppSelector((state: RootState) => state.recepcionmp.lotes_aprobados)
  const guia = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)

  const camionAcoplado = camiones?.find(camion => camion?.id === Number(guia?.camion))?.acoplado
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    if (id) {
        dispatch(fetchLotesAprobadosGuiaRecepcion({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => {
    dispatch(fetchCamiones({ token, verificar_token: verificarToken }))
  }, [])



  const columns = [
		columnHelper.display({
      id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_lote}`}
				</div>
			),
			header: 'N° Lote',
		}),
		columnHelper.display({
      id: 'kilos_brutos__1_camion',
			cell: (info) => (
				<div className='font-bold text-center'>
					{(info.row.original.kilos_brutos_1 ?? 0).toLocaleString()}
				</div>
			),
			header: 'Kilos Brutos Camión',
		}),
    camionAcoplado 
    ? 
      columnHelper.display({
      id: 'kilos_brutos__2_camion',
			cell: (info) => {
        const kilos_acoplado = info.row.original.kilos_brutos_2
        return (
          <div className='font-bold text-center'>
            {`${(kilos_acoplado ?? 0).toLocaleString()}`}
          </div>
        )
      },
			header: 'Kilos Acoplado',
		})
    : columnHelper.display({
      id:'hidden',
      cell: () => {
        <div>
        </div>
      },
      enableHiding: true
    }),
    columnHelper.display({
      id: 'kilos_tara',
			cell: (info) => {
        const tara_camion = info.row.original.kilos_tara_1 + info.row.original.kilos_tara_2
        return (
          <div className='font-bold text-center'>
            {(tara_camion?? 0).toLocaleString()}
          </div>
        )
      },
			header: 'Kilos Tara',
		}),
    columnHelper.display({
      id: 'kilos_envase',
			cell: (info) => {
        return (
          <div className='font-bold text-center'>
            {(info.row.original.kilos_envases ?? 0).toLocaleString()}
          </div>
        )
      },
			header: 'Kilos Envases',
		}),
    columnHelper.display({
      id: 'kilos_fruta_neto',
			cell: (info) => {
    
        return (
          <div className='font-bold text-center'>
            {(info.row.original.kilos_neto_fruta ?? 0).toLocaleString()}
          </div>
        )
      },
			header: 'Kilos Fruta Neto',
		}),
    columnHelper.display({
      id: 'tipo_envase',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='w-full font-bold text-center'>
            <Dropdown className='relative w-full'>
              <DropdownToggle>
                <Button className='w-full h-full px-12 text-white justify-around text-lg'>
                  Envases
                </Button>
              </DropdownToggle>
              <DropdownMenu className='w-[200px] absolute'>
                {
                  row?.envases.map((envase) => {
                    const envasesList = envases?.find(envaseList => envaseList.id == envase.envase)
                    return (
                      <DropdownItem icon='HeroFolderOpen' className={`w-full text-md dark:text-white text-black`}>
                        <span>{`${envase.cantidad_envases} ${envasesList?.nombre}`}</span>
                      </DropdownItem>
                    )
                  })
                }
  
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      },
			header: 'Tipo Envase',
		}),
    columnHelper.display({
      id: 'variedad',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className=' h-full w-full flex items-center justify-center'>
            <span  className={`text-xl dark:text-white text-black`}>{row.variedad}</span>
          </div>
        )
      },
			header: 'Variedad',
		}),
    columnHelper.display({
      id: 'tipo_producto',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='h-full w-full flex items-center justify-center'>
            <span className={`text-xl dark:text-white text-black`}>{row.tipo_producto}</span>
          </div>
        )
      },
			header: 'Tipo Producto',
		}),
    columnHelper.display({
      id: 'estado',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='h-full w-full flex items-center justify-center'>
             {row?.estado_recepcion === '7' ? <BiCheckDouble className='text-4xl text-green-700'/> : <DuoDoubleCheck style={{ color: 'green', fontSize: 30 }}/> }
          </div>
        )
      },
			header: 'Estado',
		}),
  ]

  const table = useReactTable({
		data: lotes,
    //@ts-ignore
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
    { id: 'numero_lote', header: '', className: 'lg:w-32 text-center' },
    { id: 'kilos_brutos__1_camion', header: '', className: 'lg:w-48 text-center' },
    { id: 'kilos_brutos__2_camion', header: '', className: 'lg:w-48 text-center' },
    { id: 'kilos_tara', header: '', className: 'lg:w-48 text-center' },
    { id: 'kilos_tara_2', header: '', className: 'lg:w-48 text-center' },
    { id: 'kilos_envase', header: '', className: 'lg:w-48 text-center' },
    { id: 'kilos_fruta_neto', header: '', className: 'lg:w-48 text-center' },
    { id: 'variedad', header: '', className: 'w-20 lg:w-80 text-center' },
    { id: 'tipo_producto', header: '', className: 'lg:w-80 text-center' },
    { id: 'estado', header: '', className: 'lg:w-48 text-center' },
  ]

  return (
    <Container breakpoint={null} className='w-full'>
      <Card className='h-full w-full'>
        <CardBody className='overflow-x-auto w-full'>
          {
            lotes.length < 1
              ? <div className='text-center'>
                  <span className='text-4xl'>No hay lotes aprobados</span>
                </div>
              : <TableTemplate className='max-md:min-w-[70rem]' table={table} columnas={columnas}/>
          }
        </CardBody>
      </Card>
    </Container>
  );
}

export default TablaDetalleGuiaFinalizada 