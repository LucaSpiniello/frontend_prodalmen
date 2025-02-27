import { FC, SetStateAction, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { TGuia, TLoteGuia } from '../../../types/TypesRecepcionMP.types';
import Card, { CardBody } from '../../../components/ui/Card';
import TableTemplate from '../../../templates/common/TableParts.template';
import Container from '../../../components/layouts/Container/Container';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown';
import Button from '../../../components/ui/Button';
import ModalForm from '../../../components/ModalForm.modal';
import { HeroEye, HeroPencilSquare } from '../../../components/icon/heroicons';
import FooterDetalleEnvase from './FooterDetalleEnvase';
import FooterFormularioEdicionEnvase from '../Formularios/Formulario Edicion Guia Recepcion Mp/FooterFormularioEdicionEnvase';
import ModalRecepcion from '../Modals/ModalRecepcion';
import ModalBodega from '../Modals/ModalBodega';
import ModalControlCalidad from '../Modals/ModalControlCalidad';
import { FaForward, FaIndustry, FaWeight } from 'react-icons/fa';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { estadoRecepcion } from '../../../utils/generalUtil';
import { useAuth } from '../../../context/authContext';
import { BiLoaderCircle } from 'react-icons/bi';
import { eliminarLoteRecepcionThunk, fetchGuiaRecepcion, fetchLotesPendientesGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Tooltip from '../../../components/ui/Tooltip';



interface IFooterProps {
  data: TGuia
}

const FooterDetalleGuia: FC<IFooterProps> = ({ data }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const base_url = process.env.VITE_BASE_URL
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [estadoActivo, setEstadoActivo] = useState<string | null>(null)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const [loading, setLoading] = useState(true)
  const lotes = useAppSelector((state: RootState) => state.recepcionmp.lotes_pendientes)
  const { id } = useParams()
  const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()

  useEffect(() => {
    if(id){
      dispatch(fetchLotesPendientesGuiaRecepcion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      if (lotes && lotes.length === 0) {
        dispatch(fetchGuiaRecepcion({ id: parseInt(id!), token, verificar_token: verificarToken }))
      }
    }
  }, [id])

  useEffect(() => {
    if (loading){
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  }, [loading])

  const initialRows = [
    {
      envase: null,
      variedad: null,
      tipo_producto: '1',
      cantidad_envases: null
    },
  ]
  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
  );
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)
  const formik = useFormik({
    initialValues: {
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      kilos_tara_1: 0,
      kilos_tara_2: 0,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null,
    },
    onSubmit: async (values: any) => {
      const formData = new FormData()
      const lotesData = rows.map((row: any) => ({
        numero_lote: row.id,
        kilos_brutos_1: values.kilos_brutos_1,
        kilos_brutos_2: values.kilos_brutos_2,
        kilos_tara_1: 0,
        kilos_tara_2: 0,
        estado_recepcion: '1',
        guiarecepcion: data.id,
        creado_por: data.creado_por,
      }))
      formData.append('lotes', JSON.stringify(lotesData))
      const envasesData = rows.map((row: any) => ({
        envase: row.envase,
        variedad: row.variedad,
        tipo_producto: row.tipo_producto,
        cantidad_envases: row.cantidad_envases,
      }));
      formData.append('envases', JSON.stringify(envasesData));
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/${data.id}/lotes/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        if (res.ok) {
          toast.success("la guia de recepción fue registrado exitosamente!!", {
            className: 'h-[200px]'
          })
          navigate(`/app/recepciomp`, { state: { pathname: pathname }})
        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const columnHelper = createColumnHelper<TLoteGuia>();

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
      ? (
        columnHelper.display({
          id: 'kilos_brutos_2_camion',
          cell: (info) => (
            <div className='font-bold text-center'>
              {(info.row.original.kilos_brutos_2 ?? 0).toLocaleString()}
            </div>
          ),
          header: 'Kilos Acoplado',
        })
      )
      : (
        columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      ),
    columnHelper.display({
      id: 'tipo_envase',
			cell: (info) => {
        const row = info.row.original
        return (
          <div className='font-bold text-center'>
            <Dropdown className='relative w-full'>
              <DropdownToggle>
                <Button className='w-full h-full px-12 text-white justify-around text-lg'>
                  Envases
                </Button>
              </DropdownToggle>
              <DropdownMenu className='w-[300px] absolute'>
                {
                  row?.envases.map((envase) => {
                    const envasesList = envases?.find(envaseList => envaseList.id == envase.envase)
                    return (
                      <DropdownItem icon='HeroFolderOpen' className={`text-md dark:text-white text-black`}>{envase.cantidad_envases} {envasesList?.nombre} </DropdownItem>
                    )
                  })
                }
  
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      },
			header: 'Envases',
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
            <span  className={`text-xl dark:text-white text-black`}>{row.tipo_producto}</span>
          </div>
        )
      },
			header: 'Tipo Producto',
		}),
    columnHelper.display({
      id: 'acciones',
			cell: (info) => {
        const row = info.row.original
        const estadoActivoCoincide = estadoRecepcion.find((estado) => estado.value === (row?.estado_recepcion! ? row?.estado_recepcion! : '1'))
        const [openModalRows, setOpenModalRows] = useState(false)
        const [openModalEdicion, setOpenModalEdicion] = useState(false)
        const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)


        return (
          <div className='flex gap-5 items-center justify-center flex-wrap w-full h-full'>
          <ModalForm
            open={openModalRows}
            setOpen={setOpenModalRows}
            title='Detalle Envases'
            textTool='Detalle'
            variant='solid'
            color='blue'
            colorIntensity='700'
            size={1200}
            width={`w-20 h-16 md:h-16 lg:h-11 px-2 text-white hover:scale-105`}
            icon={ <HeroEye style={{ fontSize: 25 }}/> }
          >
            <FooterDetalleEnvase id_lote={row?.id!} id_guia={data?.id!} />
          </ModalForm>

          {
            loading
              ? null
              : (
                (hasGroup(['recepcion-mp']) || hasGroup(['bodega']) || hasGroup(['controlcalidad'])) && row?.estado_recepcion! >= '2'
                    ? null
                    : hasGroup(['recepcion-mp']) && comercializador === 'Prodalmen'
                      ? (
                        // <ModalForm
                        //   open={openModalEdicion}
                        //   setOpen={setOpenModalEdicion}
                        //   title='Detalle Envases'
                        //   textTool='Edicion'
                        //   size={900}
                        //   variant='solid'
                        //   color='zinc'
                        //   colorIntensity='500'
                        //   width={`w-20 h-16 md:h-16 lg:h-11 px-2 text-white hover:scale-105`}
                        //   icon={<HeroPencilSquare style={{ fontSize: 25 }}
                        //   />}
                        // >
                        //   <FooterFormularioEdicionEnvase 
                        //     id_lote={row?.id!} 
                        //     id_guia={data?.id!}
                        //     />
                        // </ModalForm>
                        <Tooltip text='Eliminar Lote' className='bg-white dark:bg-black'>
                          <Button variant='solid' color='red' colorIntensity='600' className={`w-20 h-16 md:h-16 lg:h-11 px-2 text-white hover:scale-105`} icon='HeroXMark' onClick={async () => {
                            dispatch(eliminarLoteRecepcionThunk({token: token, verificar_token: verificarToken, id_lote: info.row.original.id, id_recepcion: id}))
                          }}></Button>
                        </Tooltip>
                      )          
                      : null
              )
          }

          {
           (hasGroup(['recepcion-mp']) ||  hasGroup(['controlcalidad']) || hasGroup(['bodega'])) && (
              <>
                {
                  row?.estado_recepcion! <= '2' && hasGroup(['controlcalidad'])
                    ? (
                      <>
                        {
                          loading
                            ? <BiLoaderCircle />
                            : (
                              <ModalForm
                              open={openModalConfirmacion}
                              setOpen={setOpenModalConfirmacion}
                              title={'Registrar Control de Calidad'}
                              textTool='Accion'
                              variant='solid'
                              color='emerald'
                              colorIntensity='600'
                              size={450}
                              width={`w-20 h-16 md:h-16 lg:h-11 text-white hover:scale-105`}
                              icon={<>
                                {
                                  row.estado_recepcion === '1'
                                    ? <FaForward className='text-3xl'/>
                                    : row.estado_recepcion === '2'
                                      ? <HiOutlineClipboardDocumentList className='text-3xl' />
                                      : null
                                }
                              </>}
                            >
                              {
                                hasGroup(['controlcalidad'])
                                  ?
                                    <>
                                      {
                                        row?.estado_recepcion! <= '3'
                                          ? <ModalControlCalidad 
                                              id={row?.id!}
                                              estadoActivo={setEstadoActivo!}
                                  
                                              // @ts-ignores
                                              setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} lote={row} guia_id={data?.id!} id_lote={0} usuario={undefined} />
                                          : null

                                      }
                                    </> 
                                  : null
                              }
                            </ModalForm>
                            )
                        }
                      </>

                      )
                    : row?.estado_recepcion! === "5" && hasGroup(['recepcion-mp'])
                      ? (
                        <ModalForm
                          open={openModalConfirmacion}
                          setOpen={setOpenModalConfirmacion}
                          title={'Registrar Tara Camión'}
                          textTool='Registrar Tara camión'
                          variant='solid'
                          color='sky'
                          colorIntensity='700'
                          size={700}
                          width={`w-20 h-16 md:h-16 lg:h-11 text-white hover:scale-105`}
                          icon={ 
                            loading
                              ? <BiLoaderCircle className='text-2xl animate-spin'/>
                              : <FaWeight className='text-2xl' />
                          }
                        >
                          {
                           hasGroup(['recepcion-mp'])
                                ? <ModalRecepcion
                                    id={row?.id!}
                                    estadoActivo={setEstadoActivo!}
                                    setOpen={setOpenModalConfirmacion}
                                    numero_estado={`${estadoActivoCoincide?.value}`}
                                    lote={row}
                                    //@ts-ignore
                                    guia={data!}/>
                                  : null
                          
                          }
                        </ModalForm>                  
                      )
                      : row?.estado_recepcion === "3" && hasGroup(['bodega'])
                        ? (
                          <ModalForm
                            open={openModalConfirmacion}
                            setOpen={setOpenModalConfirmacion}
                            title={'Asignar Ubicacion en Bodega Exterior'}
                            textTool='Ubicación bodega'
                            color='blue'
                            colorIntensity='700'
                            size={450}
                            variant='solid'
                            width={`w-20 h-16 md:h-16 lg:h-11 text-white hover:scale-105`}
                            icon={<FaIndustry className='text-2xl' />}
                          >
                            {
                               hasGroup(['bodega'])
                                  ? <ModalBodega
                                      id={row?.id!}
                                      setOpen={setOpenModalConfirmacion!}
                                      numero_estado={`${estadoActivoCoincide?.value}`}
                                      lote={row}/>
                                    : null
                              
                            }
                          </ModalForm>
                          )
                        : null
                }
              </>
            )
          }

        </div>
			)},
			header: 'Acciones',
		}),
  ]


  const table = useReactTable({
		data: lotes,
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
    <Container breakpoint={null} className='w-full'>
      <Card className='h-full w-full'>
        <CardBody className='overflow-x-auto'>
          {
            lotes && lotes.length === 0 ? 
              <div className='text-center'>
                <span className='text-4xl'>No hay lotes por aprobar</span>
              </div>
            :
              <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          }
        </CardBody>
      </Card>
    </Container>
  );
};

export default FooterDetalleGuia;
