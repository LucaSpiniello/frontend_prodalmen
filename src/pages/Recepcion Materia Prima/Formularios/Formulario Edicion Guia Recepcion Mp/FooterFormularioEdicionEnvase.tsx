import { FC, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Switch } from 'antd';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TEnvaseEnGuia, TEnvases, TGuia, TLoteGuia } from '../../../../types/TypesRecepcionMP.types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import toast from 'react-hot-toast';
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact';
import Input from '../../../../components/form/Input';
import { fetchWithTokenPatch, fetchWithTokenPostWithFormData } from '../../../../utils/peticiones.utils';
import Button from '../../../../components/ui/Button';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../../context/authContext';
import { useFormik } from 'formik';
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../utils/constante';
import { FaCirclePlus } from 'react-icons/fa6';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { HeroPlayCircle, HeroPlus, HeroXMark } from '../../../../components/icon/heroicons';
import Label from '../../../../components/form/Label';
import { ACTUALIZAR_FILA_ENVASES_LOTE, AGREGAR_FILA_ENVASES_LOTE, ELIMINAR_FILA_ENVASES_LOTE, actualizar_envase, fetchEnvasesRecepcionMP, fetchGuiaRecepcion, fetchLoteGuiaRecepcionIndividual, registro_envase_lote } from '../../../../redux/slices/recepcionmp';
import { fetchEnvaseMateriaPrima } from '../../../../redux/slices/envasesSlice';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../templates/common/TableParts.template';


interface IFooterProps {
  id_lote?: number,
  id_guia?: number
}


const FooterFormularioEdicionEnvase: FC<IFooterProps> = ({ id_lote, id_guia }) => {
  const { isDarkTheme } = useDarkMode();
  const navigate = useNavigate()  
  const { pathname } = useLocation()
  const [iotBruto, setIotBruto] = useState<boolean>(false)
  const [iotBrutoAcoplado, setIotBrutoAcoplado] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()

  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const guia_recepcion = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const lotes_pendientes = useAppSelector((state: RootState) => state.recepcionmp.lotes_pendientes)
  const lote_recepcionmp = useAppSelector((state: RootState) => state.recepcionmp.lote)
  const envases_lote = useAppSelector((state: RootState) => state.recepcionmp.envases_lotes)

  const { id: id_guia_recepcion } = useParams()

  const [editar, setEditar] = useState<boolean>(false)
  const [editarEnvase, setEditarEnvase] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchLoteGuiaRecepcionIndividual({ id: parseInt(id_guia_recepcion!), params: { id_lote: id_lote }, token, verificar_token: verificarToken  }))
  }, [lotes_pendientes])

  useEffect(() => {
    dispatch(fetchEnvasesRecepcionMP({ id: parseInt(id_guia_recepcion!), params: { id_lote }, token, verificar_token: verificarToken }))
  }, [])

  const initialRows = {
    id: 0,
    variedad: '',
    tipo_producto: '',
    cantidad_envases: 0,
    envase: 0,
    recepcionmp: 0,
    envase_nombre: '',
    variedad_label: '',
    tipo_producto_label: ''
  }

  const actualizacionKilosLote = async (kilos_brutos_1: '', kilos_brutos_2?: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/recepcionmp/${id_guia}/lotes/${id_lote}/`, {
      kilos_brutos_1: kilos_brutos_1,
      kilos_brutos_2: camionAcoplado ? kilos_brutos_2 : 0
    }, token_verificado)

    if (res.ok){
      console.log("Bien hecho muchacho")
    } else {
      console.log("Revisa hubo un error")
    }
  }

  console.log(envases_lote, '2nvases')

  const formik = useFormik({
    initialValues: {
      id: id_lote,
      kilos_brutos_1: 0,
      kilos_brutos_2: 0
    },
    onSubmit: async (values: any) => {
      const formData = new FormData()
      const envasesData = envases_lote.map((row) => ({
        kilos_brutos_1: values.kilos_brutos_1,
        kilos_brutos_2: values.kilos_brutos_2,
        envase: row.envase,
        variedad: row.variedad,
        tipo_producto: row.tipo_producto,
        cantidad_envases: row.cantidad_envases,
        recepcionmp: id_lote
      }));
      formData.append('envases', JSON.stringify(envasesData));



      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithTokenPostWithFormData(`api/envaseguiamp/`, formData, token_verificado)
        if (res.ok) {
          actualizacionKilosLote(values.kilos_brutos_1, values.kilos_brutos_2)
          toast.success("la guia de recepción fue registrado exitosamente!!")
          navigate(`/recepcionmp`, { state: { pathname: pathname }})
        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const optionEnvases: TSelectOptions = envases
  .filter((envase: TEnvases) => !envases_lote.some(row => row.id === envase.id))
  .map((envase: TEnvases) => ({
    value: String(envase.id),
    label: envase.nombre
  }));

  const optionsVariedad: TSelectOptions = (envases_lote.length > 1) ?
    VARIEDADES_MP.filter(
      variedad => envases_lote.some(row => row.variedad === variedad.value)
    ).map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    })) 
    : VARIEDADES_MP
  
  const optionsTipoFruta: TSelectOptions = (envases_lote.length > 1) ?
    TIPO_PRODUCTOS_RECEPCIONMP.filter(
      producto => envases_lote.some(row => row.tipo_producto === producto.value)
    ).map((producto) => ({
      value: String(producto.value),
      label: producto.label
    })) : TIPO_PRODUCTOS_RECEPCIONMP

  const camionAcoplado = camiones?.find(camion => camion.id === Number(guia_recepcion?.camion))?.acoplado

  useEffect(() => {
    let isMounted = true;
  
    if (isMounted && guia_recepcion) {
      guia_recepcion.lotesrecepcionmp.forEach((lote: TLoteGuia) => {
        //@ts-ignore
        
        formik.setValues({
          kilos_brutos_1: lote.kilos_brutos_1,
          kilos_brutos_2: lote.kilos_brutos_2 
        });
      });
    }
  
    return () => {
      isMounted = false;
    };
  }, [guia_recepcion])


  const handleChangeRow = (id: number, key: any, value: any) => {
    dispatch(ACTUALIZAR_FILA_ENVASES_LOTE({ id, key, value }));
  };

  const columnHelper = createColumnHelper<TEnvaseEnGuia>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const columns = [
    columnHelper.accessor('envase_nombre', {
      id: 'nombre_envase',
      cell: (info) => (
        <div className='font-bold w-full'>
         {
          editarEnvase
            ? (
              <SelectReact
                options={optionEnvases}
                id='camion'
                name='camion'
                placeholder='Selecciona un envase'
                value={optionEnvases.find(option => option?.value === String(info.row.original.envase))}
                onChange={(value: any) => {
                  handleChangeRow(info.row.original.id, 'envase', value.value)
                }}
              />
            )
            : (
              <span> {`${info.row.original.envase_nombre}`}</span>
            )
         }
        </div>
      ),
      header: 'Nombre Envase'
    }),
    columnHelper.accessor('cantidad_envases', {
      id: 'cantidad_envases',
      cell: (info) => (
        <div className={`font-bold w-full ${editarEnvase ? 'text-center': 'text-start'}`}>
          {
            editarEnvase
              ? (
                <Input
                  type='number'
                  name='kilos_brutos_2'
                  min={0}
                  value={info.row.original.cantidad_envases!}
                  onChange={(e: any) => {
                    handleChangeRow(info.row.original.id, 'cantidad_envases', e.target.value)
                  }}
                />
              )
              : <span className=''>{info.row.original.cantidad_envases}</span>
            }
        </div>
      ),
      header: 'Cantidad Envases'
    }),
    columnHelper.accessor('variedad_label', {
      id: 'variedad',
      cell: (info) => (
        <div className='font-bold w-full'>
          {
            editarEnvase
              ? (
                <SelectReact
                  options={optionsVariedad}
                  id='variedad'
                  name='variedad'
                  placeholder='Variedad'
                  value={optionsVariedad.find(option => option?.value === String(info.row.original.variedad))}
                  onChange={(value: any) => {
                    handleChangeRow(info.row.original.id, 'variedad', value.value)
                  }}
                />
              )
              : <span className=''>{info.row.original.variedad_label}</span>
          }
        </div>
      ),
      header: 'Variedad'
    }),
    columnHelper.accessor('tipo_producto_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {
            editarEnvase
              ? (
                <SelectReact
                  options={optionsTipoFruta}
                  id='tipo_producto'
                  name='tipo_producto'
                  placeholder='Tipo Producto'
                  value={optionsTipoFruta.find(option => option?.value === String(info.row.original.tipo_producto))}
                  onChange={(value: any) => {
                    handleChangeRow(info.row.original.id, 'tipo_producto', value.value)
                  }}
                />
              )
              : <span className=''>{info.row.original.tipo_producto_label}</span>
          }
        </div>
      ),
      header: 'Tipo Producto'
    }),
    editar
      ? (
        columnHelper.display({
          id: 'acciones',
          cell: (info) => (
            <div className='flex items-center justify-center gap-2 flex-wrap'>
              {
                editarEnvase
                  ? (  
                    <>
                      <Button
                        variant='solid'
                        color='emerald'
                        colorIntensity='700'
                        onClick={() => {
                          dispatch(actualizar_envase({ id: parseInt(id_guia_recepcion!), data: info.row.original, params: { id_lote: id_lote, id_envase: info.row.original.id, setOpen: setEditar }, token, verificar_token: verificarToken }))
                        }}
                        className='hover:scale-105'>
                        Guardar
                      </Button>

                      <Button
                        variant='solid'
                        colorIntensity='700'
                        color='red'
                        className='hover:scale-110'
                        onClick={() => dispatch(ELIMINAR_FILA_ENVASES_LOTE(info.row.index))}
                        >
                        Eliminar
                      </Button>
                    </>
                  )
                  : (
                    <Button
                      variant='solid'
                      colorIntensity='700'
                      color='blue'
                      className='hover:scale-110'
                      onClick={() => setEditarEnvase(true)}
                      >
                      Editar Envase
                    </Button>
                  )
              }
            </div>
          ),
          header: 'Acciones'
        })
        )
      : (
        columnHelper.display({
          id:'hidden',
          cell: () => {
            <div className=' w-2/3'>
            </div>
          },
          enableHiding: true
        })
      )
  ]

  const columnas: TableColumn[] = [
    {id: 'nombre_envase', className: `${editar ? 'w-3/12' : 'w-auto'}`},
    {id: 'cantidad_envases', className: `${editar ? 'w-1/12' : 'w-auto'}`},
    {id: 'variedad', className: `${editar ? 'w-2/12' : 'w-auto'}`},
    {id: 'acciones', className: `text-center`}, 
  ]

  const table = useReactTable({
    data: envases_lote,
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
    <Container>
      <Card>
        <CardHeader>
          {
            editar
              ? (
                <div className='w-full flex justify-between'>
                  <Button
                    variant='solid'
                    color='red'
                    colorIntensity='700'
                    className='md:w-4/12 lg:w-3/12'
                    onClick={() => {
                      setEditar(false)
                      setEditarEnvase(false)
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    variant='solid'
                    color='emerald'
                    colorIntensity='700'
                    className='md:w-4/12 lg:w-3/12'
                    onClick={async () => {
                      dispatch(registro_envase_lote({ id: parseInt(id_guia_recepcion!), data: { envases: envases_lote }, params: { id_lote: id_lote, setOpen: setEditar }, token, verificar_token: verificarToken }))
                      await actualizacionKilosLote(formik.values.kilos_brutos_1, formik.values.kilos_brutos_2)
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              )
              : (
                <Button
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    className='w-full md:w-4/12 lg:w-3/12'
                    onClick={() => setEditar(true)}
                  >
                    Editar
                </Button>
              )
          }
        </CardHeader>
        <CardBody>
          <div>
            <div className='flex flex-col lg:flex-row w-full gap-10 justify-between mb-5'>
              <div className={`w-full flex flex-col justify-center`}>
                <Label htmlFor='kilos_brutos_1'>Kilos Brutos</Label>
                <div className='flex gap-5 items-center'>
                  {
                    editar
                      ? (
                        <Input
                          type='number'
                          name='kilos_brutos_1'
                          className='py-3 row-start-2 col-span-3 w-56'
                          value={formik.values.kilos_brutos_1}
                          onChange={formik.handleChange}
                          disabled={iotBruto ? true : false}
                        />
                      )
                      : (
                        <div className='w-full dark:bg-zinc-800 bg-zinc-100 py-3.5 rounded-md px-2'>
                          <span>{formik.values.kilos_brutos_1}</span>
                        </div>
                      )
                  }
                  <Switch
                    className='w-16 bg-slate-300'
                    onChange={() => setIotBruto(prev => !prev)} 
                    disabled={editar ? false : true}
                    />

                </div>
              </div>

              {
                camionAcoplado
                  ? (
                    <>
                    <div className={`flex w-full flex-col justify-center`}>
                      <Label htmlFor='kilos_brutos_2'>Kilos Brutos Acoplado</Label>
                      <div className='flex gap-5 items-center'>
                       {
                        editar
                          ? (
                            <Input
                              type='number'
                              name='kilos_brutos_2'
                              className='py-3 row-start-2 col-span-3 w-56'
                              value={formik.values.kilos_brutos_2}
                              onChange={formik.handleChange}
                              disabled={iotBrutoAcoplado ? true : false}
    
                            />
                          )
                          : (
                            <div className='w-full dark:bg-zinc-800 bg-zinc-100 py-3.5 rounded-md px-2'>
                              <span>{formik.values.kilos_brutos_2}</span>
                            </div>
                          )
                       }
                        <Switch
                          className='w-16 bg-slate-300'
                          onChange={() => setIotBruto(prev => !prev)} 
                          disabled={editar ? false : true}
                          />
                      </div>
                    </div>
                    </>
                  )
                  : null
              }
            </div>
            
            <div className='flex flex-col gap-4'>
              <div className='flex items-center'>
                {
                  editar
                    ? (
                      <Button
                        variant='solid'
                        color='blue'
                        colorIntensity='700'
                        onClick={() => dispatch(AGREGAR_FILA_ENVASES_LOTE(initialRows))}
                        >
                          <HeroPlus style={{ fontSize: 25 }}/>
                      </Button>
                    )
                    : null
                }
              </div>

              <Card className='h-full'>
                <CardHeader>
                  <CardTitle>Envases en lote recepcionado</CardTitle>
                </CardHeader>
                <CardBody className='overflow-visible'>
                  <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas} />
                </CardBody>
                <TableCardFooterTemplate table={table} />
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FooterFormularioEdicionEnvase;
