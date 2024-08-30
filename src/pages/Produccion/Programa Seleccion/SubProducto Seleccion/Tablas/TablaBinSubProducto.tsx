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

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { useAuth } from '../../../../../context/authContext';
import { RootState } from '../../../../../redux/store';
import { TBinSubProducto, TSeleccion, TSubproducto } from '../../../../../types/TypesSeleccion.type';
import { format } from '@formkit/tempo';
import Button from '../../../../../components/ui/Button';
import Tooltip from '../../../../../components/ui/Tooltip';
import { HeroEye, HeroPlusCircle, HeroXCircle } from '../../../../../components/icon/heroicons';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/form/Input';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import ModalForm from '../../../../../components/ModalForm.modal';
import FormularioInformeSeleccion from '../../Formularios/Formulario PDF\'s/FormularioInformeSeleccion';
import FormularioInformeKilosXOperario from '../../Formularios/Formulario PDF\'s/FormularioInformeKilosXOperario';
import TableTemplate, { TableCardFooterTemplate } from '../../../../../templates/common/TableParts.template';
import { fetchBinSubProductos, fetchSubProductoLista } from '../../../../../redux/slices/seleccionSlice';
import Label from '../../../../../components/form/Label';
import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact';
import { fetchOperario, fetchOperarios } from '../../../../../redux/slices/operarioSlice';
import { optionsTipoSubProducto } from '../../../../../utils/options.constantes';
import FormularioCreacionSubProducto from '../Formularios/CreacionBinSubProducto';
import Progress from '../../../../../components/ui/Progress';
import toast from 'react-hot-toast';
import { fetchWithTokenDelete } from '../../../../../utils/peticiones.utils';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const TablaBinSubProducto = ({ filtro, binSeleccionado, setBin, openModal, setOpenModal } : { 
  filtro?: string | undefined, 
  setBin?: Dispatch<SetStateAction<TBinSubProducto | null>>, 
  binSeleccionado?: TBinSubProducto,
  openModal?: boolean,
  setOpenModal?: Dispatch<SetStateAction<boolean>>,
  }) => {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const { pathname } = useLocation()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [createBinSub, setCreateBinSub] = useState<boolean>(false)
  const [hiddeButton, setHiddeButton] = useState<boolean>(false)

  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const bins_subproducos = useAppSelector((state: RootState) => state.seleccion.lista_bin_subproductos)
  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)

  useEffect(() => {
    if (typeof filtro === 'string'){
      setGlobalFilter(filtro)
    }
  }, [filtro])

  useEffect(()  => {
    dispatch(fetchOperarios({ token, verificar_token: verificarToken }))
  }, [])
  
  useEffect(()  => {
    dispatch(fetchBinSubProductos({ token, verificar_token: verificarToken }))
  }, [binSeleccionado, createBinSub, openModal])


  const optionsOperarios: TSelectOptions = operarios.map((operario) => ({
    value: String(operario.id),
    label: `${operario.nombre} ${operario.apellido}`
  }))


  const eliminarBinSubProducto = async (id_bin: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenDelete(`api/binsubproductoseleccion/${id_bin}/`, token_verificado)
    
    if (res.ok){
      toast.success(`Bin N° ${id_bin} ha sido eliminado exitosamente`)

      dispatch(fetchBinSubProductos({ token, verificar_token: verificarToken }))
    } else {
      toast.error(`No se ha podido eliminar el bin`)
    }
     
  }

  

  const columnHelper = createColumnHelper<TBinSubProducto>();

  const columns = [
    columnHelper.accessor('codigo_tarja', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.codigo_tarja}`}
        </div>
      ),
      header: 'Código Tarja',
    }),
    columnHelper.accessor('tipo_patineta_label', {
      cell: (info) => {

        return (
          <div className='font-bold'>
            <p className=''>{info.row.original.tipo_patineta_label}</p>
          </div>
        )
      },
      header: 'Tipo Patineta',
    }),
    columnHelper.accessor('tipo_subproducto_label', {
      cell: (info) => {

        return (
          <div className='font-bold'>
            <p className=''>{info.row.original.tipo_subproducto_label}</p>
          </div>
        )
      },
      header: 'Tipo SubProducto',
    }),
    columnHelper.accessor('peso', {
      cell: (info) => {

        return (
          <div className='font-bold'>
            <p className=''>{info.row.original.peso}</p>
          </div>
        )
      },
      header: 'Peso',
    }),
    pathname.includes('/pro/seleccion/programa-seleccion/programa')
      ? columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      : columnHelper.accessor('calidad_label', {
        cell: (info) => {
  
          return (
            <div className='font-bold'>
              <p className=''>{info.row.original.calidad_label}</p>
            </div>
          )
        },
        header: 'Calidad',
      }),  
      pathname.includes('/pro/seleccion/programa-seleccion/programa')
      ? columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      : columnHelper.accessor('calibre_label', {
        cell: (info) => {
  
          return (
            <div className='font-bold'>
              <p className=''>{info.row.original.calibre_label}</p>
            </div>
          )
        },
        header: 'Calibre',
      }),
      pathname.includes('/pro/seleccion/programa-seleccion/programa')
      ? columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      : columnHelper.accessor('variedad_label', {
        cell: (info) => {
  
          return (
            <div className='font-bold'>
              <p className=''>{info.row.original.variedad_label}</p>
            </div>
          )
        },
        header: 'Variedad',
      }),
      pathname.includes('/pro/seleccion/programa-seleccion/programa')
      ? columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      : columnHelper.accessor('fecha_creacion', {
        cell: (info) => {
          return (
            <div className='font-bold'>
              <p className=''>{format(info.row.original.fecha_creacion, { date: 'short', time: 'short' } , 'es' )}</p>
            </div>
          )
        },	
        header: 'Envases en Proc.',
      }),
    !pathname.includes('/pro/seleccion/programa-seleccion/programa')
      ? columnHelper.display({
          id:'hidden',
          cell: () => {
            <div>
            </div>
          },
          enableHiding: true
        })
      : columnHelper.display({
        id: 'porcentaje',
        cell: (info) => {
          const max = 500
          const porcentaje = (info.row.original.peso / max * 100 ?? 0).toFixed(2)

          return (
            <div className='font-bold'>
               <Progress value={Number(porcentaje)} rounded='rounded' className=''/>
            </div>
          )
        },	
        header: 'Nivel del Bin',
      }),
    columnHelper.display({
      id: 'acciones',
      cell: ({ cell }) => {
        const isSelected = binSeleccionado?.id === cell.row.original.id
        return (
          <div className='flex flex-wrap w-full justify-between'>

            {
              !pathname.includes('/pro/seleccion/programa-seleccion/programa')
                ? (
                  <>
                    <Tooltip text={`Detalle Bin SubProducto N° ${cell.row.original.id}`}>
                      <Link to={`/bin-subproducto-agrupado/${cell.row.original.id}`} state={{ pathname: '/bins-subproductos'}}>
                        <Button
                          variant='solid'
                          >
                            <HeroEye style={{ fontSize: 27 }}/>
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip text={`Eliminar Bin SubProducto N° ${cell.row.original.id}`}>
                        <Button
                          variant='solid'
                          color='red'
                          onClick={() => eliminarBinSubProducto(cell.row.original.id)}
                          >
                            <HeroXCircle style={{ fontSize: 27 }}/>
                        </Button>
                    </Tooltip>
                  </>
                  
                )
                : !hiddeButton
                    ? (
                      <Tooltip text={`Añadir Bin SubProducto N° ${cell.row.original.id}`}>
                          <Button
                            variant='solid'
                            color='emerald'
                            onClick={() => {
                              setBin!(cell.row.original)
                              setHiddeButton(true)
                              toast.success(`Bin ${cell.row.original.codigo_tarja} Seleccionado`)
                            }}
                            >
                              <HeroPlusCircle style={{ fontSize: 27 }}/>
                          </Button>
                      </Tooltip>
                      )
                    : !isSelected 
                       ? (
                      <Tooltip text={`Añadir Bin SubProducto N° ${cell.row.original.id}`}>
                        <Button
                          variant='solid'
                          color='emerald'
                          onClick={() => {
                            setBin!(cell.row.original)
                            setHiddeButton(true)
                            toast.success(`Bin ${cell.row.original.codigo_tarja} Seleccionado`)
                          }}
                          >
                            <HeroPlusCircle style={{ fontSize: 27 }}/>
                        </Button>
                      </Tooltip>
                      )
                      : null
            }

          </div>
        )
      },
      header: 'Acciones'
    })
  ];



  const table = useReactTable({
    data: bins_subproducos,
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
    <PageWrapper name='Lista SubProductos'>
      {
        !pathname.includes('/pro/seleccion/programa-seleccion/programa')
          ? (
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
                    placeholder='Busca programa...'
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                </FieldWrap>
              </SubheaderLeft>

              <SubheaderRight>
                <ModalForm
                  variant = 'solid'
                  open = {createBinSub}
                  setOpen = {setCreateBinSub}
                  textButton = 'Crear Bin SubProducto'
                  title = 'Creación Bin Sub Producto'
                  size={900}
                >
                  <FormularioCreacionSubProducto setOpen={setCreateBinSub}/>
                </ModalForm>

              </SubheaderRight>
            </Subheader>
          ) :
              <Subheader className='z-10'>
                <SubheaderRight>
                  <ModalForm
                    variant = 'solid'
                    open = {openModal!}
                    setOpen = {setOpenModal!}
                    textButton = 'Crear Bin SubProducto'
                    title = 'Creación Bin Sub Producto'
                    size={900}
                  >
                    <FormularioCreacionSubProducto setOpen={setOpenModal!} />
                  </ModalForm>
                </SubheaderRight>
              </Subheader>
      }

      
      <Container breakpoint={null} className={`w-full ${pathname.includes('/pro/seleccion/programa-seleccion/programa') ? '!p-0' : '' }`}>
        <Card className='h-full w-full'>
          {
            !pathname.includes('/pro/seleccion/programa-seleccion/programa')
              ? (
                <CardHeader>
                  <div className='w-full lg:w-7/12 flex lg:flex-row flex-col gap-5'>
                      
                      <div className="w-full flex-col">
                        <Label htmlFor="calle">Operario: </Label>
                        <SelectReact
                            options={[{ value: '', label: 'Selecciona un operario' }, ...optionsOperarios]}
                            id='operario'
                            placeholder='Operario'
                            name='operario'
                            className='w-full h-14 py-2'
                            onChange={(selectedOption: any) => {
                              if (selectedOption && selectedOption.value === '') {
                                setGlobalFilter('')
                              } else {
                                setGlobalFilter(selectedOption.label);
                              }
                            }}
                          />
                      </div>

                      <div className="w-full flex-col">
                        <Label htmlFor="calle">Sub Productos: </Label>
                        <SelectReact
                          options={[{ value: '', label: 'Selecciona un Sub Producto' }, ...optionsTipoSubProducto]}
                          id='tipo_subproducto'
                          placeholder='Tipo Sub Producto'
                          name='tipo_subproducto'
                          className='w-full h-14 py-2'
                          onChange={(selectedOption: any) => {
                            if (selectedOption && selectedOption.value === '') {
                              setGlobalFilter('')
                            } else {
                              setGlobalFilter(selectedOption.label);
                            }
                          }}
                        />
                      </div>

                    </div>
                </CardHeader>
              )
              : null
          }
          <CardHeader>
            {
              !pathname.includes('/pro/seleccion/programa-seleccion/programa')
                ? (
                  <CardHeaderChild>
                    <CardTitle>Bins de SubProductos</CardTitle>
                    <Badge
                      variant='outline'
                      className='border-transparent px-4'
                      rounded='rounded-full'>
                      {table.getFilteredRowModel().rows.length} registros
                    </Badge>
                  </CardHeaderChild>
                )
                : null
            }
            
          </CardHeader>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaBinSubProducto;

