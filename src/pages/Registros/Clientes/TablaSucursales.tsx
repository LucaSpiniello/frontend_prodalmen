import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react'
import { TSucursales } from '../../../types/TypesRegistros.types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import ModalForm from '../../../components/ModalForm.modal';
import Button from '../../../components/ui/Button';
import { useFormik } from 'formik';
import Label from '../../../components/form/Label';
import Validation from '../../../components/form/Validation';
import FieldWrap from '../../../components/form/FieldWrap';
import Input from '../../../components/form/Input'
import { HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { MdSaveAs } from 'react-icons/md';
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact';
import { fetchCiudades, fetchComunas, fetchPaises, fetchProvincias, fetchRegiones } from '../../../redux/slices/registrosbaseSlice';
import { useAuth } from '../../../context/authContext';
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPatch } from '../../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { fetchSucursales } from '../../../redux/slices/clientes';
import FormularioSucursalMercadoExportacion from './Formularios/FormularioSucursalMercadoExportacion';
import FormularioSucursalesClientesMercadoInterno from './Formularios/Cliente Interno/FormularioSucursalesClientesMercadoInterno';

const TablaSucursales = ({ tipo_cliente } : { tipo_cliente: string }) => {
  const columnHelper = createColumnHelper<TSucursales>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const sucursales = useAppSelector((state: RootState) => state.clientes.sucursales_cliente)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [editar, setEditar] = useState<boolean>(false)
  const [IDSucursal, setIDSurcursal] = useState<number | null>(null)
  const { paises, ciudades, regiones, provincias, comunas, loading, error } = useAppSelector((state: RootState) => state.core);
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const cliente = useAppSelector((state: RootState) => state.clientes.cliente_seleccionado)
  


  const optionsPaises: TSelectOptions = paises.map((pais) => ({
    value: String(pais.id),
    label: pais.name
  })) ?? []

  const optionsCiudades: TSelectOptions = ciudades.map((ciudad) => ({
    value: String(ciudad.id),
    label: ciudad.name
  })) ?? []

  const optionsRegion: TSelectOptions = regiones.map((region) => ({
    value: String(region.region_id),
    label: region.region_nombre
  })) ?? []

  const optionsProvincia: TSelectOptions = provincias.map((provincias) => ({
    value: String(provincias.provincia_id),
    label: provincias.provincia_nombre
  }))

  const optionsComunas: TSelectOptions = comunas.map((comuna) => ({
    value: String(comuna.comuna_id),
    label: comuna.comuna_nombre
  }))

  
 
  const formik = useFormik({
    initialValues: {
      region: '',
      provincia: '',
      comuna: '',
      email_sucursal: '',
      nombre: '',
      pais: '',
      ciudad: ''
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token)
      if (!token_verificado) throw new Error('Token no verificado')
      if (tipo_cliente === 'clientemercadointerno'){
        const res = await fetchWithTokenPatch(`api/clientes_mercado_interno/${cliente?.id}/sucursales/${IDSucursal}/`, 
          {
            nombre: values.nombre,
            email_sucursal: values.email_sucursal,
            region: values.region,
            provincia: values.provincia,
            comuna: values.comuna
          }, token_verificado)
        if (res.ok){
          toast.success('Sucursal actualizado')
          dispatch(fetchSucursales({ params: { rut: `${cliente?.rut_cliente}`}, token, verificar_token: verificarToken }))
          setEditar(false)
        } else {
          toast.error('No se pudo actualizar')
        }
      } else {
        const res = await fetchWithTokenPatch(`api/cliente-exportacion/${cliente?.id}/sucursales/${IDSucursal}/`, 
          {
            nombre: values.nombre,
            email_sucursal: values.email_sucursal,
            pais: values.pais,
            ciudad: values.ciudad,
          }, token_verificado)
        if (res.ok){
          toast.success('Sucursal actualizado')
          dispatch(fetchSucursales({ params: { rut: `${cliente?.rut_cliente}`}, token, verificar_token: verificarToken }))
        } else {
          toast.error('No se pudo actualizar')
        }
      }
    }
  })

  
  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno') {
      dispatch(fetchRegiones({ token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente]);

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno' && formik.values.region) {
      dispatch(fetchProvincias({ params: { id_region: formik.values.region }, token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, formik.values.region]);

  useEffect(() => {
    if (tipo_cliente === 'clientemercadointerno' && formik.values.provincia) {
      dispatch(fetchComunas({ params: { id_provincia: formik.values.provincia }, token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente, formik.values.provincia]);


  useEffect(() => {
    if (tipo_cliente === 'clienteexportacion') {
      dispatch(fetchPaises({ token, verificar_token: verificarToken }));
    }
  }, [tipo_cliente]);

  
  useEffect(() => {
    if (formik.values.pais && tipo_cliente) {
      dispatch(fetchCiudades({ params: { id_pais: formik.values.pais }, token, verificar_token: verificarToken }));
    }
  }, [formik.values.pais, tipo_cliente])




  useEffect(() => {
    if (sucursales && IDSucursal) {
      const sucursal = sucursales.find(sucur => sucur.id === IDSucursal)
      if (tipo_cliente === 'clientemercadointerno'){
        formik.setFieldValue('region', sucursal?.region!)
        formik.setFieldValue('provincia', sucursal?.provincia!)
        formik.setFieldValue('comuna', sucursal?.comuna)
        formik.setFieldValue('email_sucursal', sucursal?.email_sucursal)
        formik.setFieldValue('nombre', sucursal?.nombre)
      } else if (tipo_cliente === 'clienteexportacion') {
        formik.setFieldValue('nombre', sucursal?.nombre)
        formik.setFieldValue('pais', cliente?.pais)
        formik.setFieldValue('ciudad', cliente?.ciudad)
        formik.setFieldValue('email_cliente', cliente?.email_cliente)
      }
    }
    
  }, [sucursales, tipo_cliente, sucursales, IDSucursal])


  const eliminar_sucursal = async () => {
    const token_verificado = await verificarToken(token)
    if (!token_verificado) throw new Error('Token no verificado')
    if (tipo_cliente === 'clientemercadointerno'){
      const res = await fetchWithTokenDelete(`api/clientes_mercado_interno/${cliente?.id}/sucursales/${IDSucursal}/`, token_verificado)
      if (res.ok){
        toast.success('Sucursal eliminado')
        dispatch(fetchSucursales({ params: { rut: `${cliente?.rut_cliente}`}, token, verificar_token: verificarToken }))
      } else {
        toast.error('No se pudo eliminar')
      }
    } else {
      const res = await fetchWithTokenPatch(`api/cliente-exportacion/${cliente?.id}/sucursales/${IDSucursal}/`, token_verificado)
      if (res.ok){
        toast.success('Sucursal eliminado')
        dispatch(fetchSucursales({ params: { rut: `${cliente?.rut_cliente}`}, token, verificar_token: verificarToken }))
      } else {
        toast.error('No se pudo actualizar')
      }
    }
  }


  const columns = [
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {
            editar && info.row.original.id === IDSucursal 
              ? (
                <div className='w-full flex-col items-center'>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.nombre ? true : undefined}
                    invalidFeedback={formik.errors.nombre ? String(formik.errors.nombre) : undefined}
                    >
                    <FieldWrap>
                      <Input
                        type='text'
                        name='nombre'
                        onChange={formik.handleChange}
                        value={formik.values.nombre}
                      />  
                    </FieldWrap>
                  </Validation>
                </div>
              )
              : <span >{info.row.original.nombre}</span>
                
              
          }
        </div>
      ),
      header: 'Nombre'
    }),
    tipo_cliente === 'clientemercadointerno'
      ? (
        columnHelper.accessor('region_nombre', {
          cell: (info) => (
            <div className='font-bold w-full'>
              {
                editar && info.row.original.id === IDSucursal
                  ? (
                    <div className='w-full flex-col items-center'>
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.region ? true : undefined}
                        invalidFeedback={formik.errors.region ? String(formik.errors.region) : undefined}
                        >
                        <FieldWrap>
                          <SelectReact
                            options={optionsRegion}
                            id='region'
                            placeholder='Selecciona'
                            name='region'
                            value={optionsRegion.find(region => region?.value === String(formik.values.region))}
                            onChange={(value: any) => {
                              formik.setFieldValue('region', value.value)
                            }}
                          />
                        </FieldWrap>
                      </Validation>
                    </div>
                  )
                  : <span >{info.row.original.region_nombre}</span>
                    
                  
              }
            </div>
          ),
          header: 'Región'
        })
      )
      : columnHelper.display({
        id:'hidden',
        cell: () => {
          <div>
          </div>
        },
        enableHiding: true
      })
    ,
    tipo_cliente === 'clientemercadointerno'
      ? (
        columnHelper.accessor('provincia_nombre', {
          cell: (info) => (
            <div className='font-bold w-full'>
                {
                  editar && info.row.original.id === IDSucursal
                    ? (
                      <div className='w-full flex-col items-center'>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.provincia ? true : undefined}
                          invalidFeedback={formik.errors.provincia ? String(formik.errors.provincia) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                              options={optionsProvincia}
                              id='region'
                              placeholder='Selecciona'
                              name='region'
                              value={optionsProvincia.find(provincia => provincia?.value === String(formik.values.provincia))}
                              onChange={(value: any) => {
                                formik.setFieldValue('provincia', value.value)
                              }}
                            />  
                          </FieldWrap>
                        </Validation>
                      </div>
                    )
                    : <span >{info.row.original.provincia_nombre}</span>
                }

            </div>
          ),
          header: 'Provincia'
        })
      )
      : (
        columnHelper.accessor('pais', {
          cell: (info) => (
            <div className='font-bold w-full'>
              {
                  editar && info.row.original.id === IDSucursal
                    ? (
                      <div className='w-full flex-col items-center'>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.pais ? true : undefined}
                          invalidFeedback={formik.errors.pais ? String(formik.errors.pais) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                              options={optionsPaises}
                              id='pais'
                              placeholder='Selecciona'
                              name='pais'
                              value={optionsPaises.find(pais => pais?.value === String(formik.values.pais))}
                              onChange={(value: any) => {
                                formik.setFieldValue('pais', value.value)
                              }}
                            />  
                          </FieldWrap>
                        </Validation>
                      </div>
                    )
                    : <span >{info.row.original.pais_nombre}</span>
                }
            </div>
          ),
          header: 'País'
        })
      ),
    tipo_cliente === 'clientemercadointerno'
      ? (
        columnHelper.accessor('comuna_nombre', {
          cell: (info) => (
            <div className='font-bold w-full'>
              {
                  editar && info.row.original.id === IDSucursal
                    ? (
                      <div className='w-full flex-col items-center'>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.comuna ? true : undefined}
                          invalidFeedback={formik.errors.comuna ? String(formik.errors.comuna) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                              options={optionsComunas}
                              id='comuna'
                              placeholder='Selecciona'
                              name='comuna'
                              value={optionsComunas.find(comuna => comuna?.value === String(formik.values.comuna))}
                              onChange={(value: any) => {
                                formik.setFieldValue('comuna', value.value)
                              }}
                            />  
                          </FieldWrap>
                        </Validation>
                      </div>
                    )
                    : <span >{info.row.original.comuna_nombre}</span>
                }
            </div>
          ),
          header: 'Comuna'
        })
      )
      : (
        columnHelper.accessor('ciudad_nombre', {
          cell: (info) => (
            <div className='font-bold w-full'>
              {
                  editar && info.row.original.id === IDSucursal
                    ? (
                      <div className='w-full flex-col items-center'>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.ciudad ? true : undefined}
                          invalidFeedback={formik.errors.ciudad ? String(formik.errors.ciudad) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                              options={optionsCiudades}
                              id='ciudad'
                              placeholder='Selecciona'
                              name='ciudad'
                              value={optionsCiudades.find(ciudad => ciudad?.value === String(formik.values.ciudad))}
                              onChange={(value: any) => {
                                formik.setFieldValue('ciudad', value.value)
                              }}
                            />  
                          </FieldWrap>
                        </Validation>
                      </div>
                    )
                    : <span >{info.row.original.ciudad_nombre}</span>
                }
            </div>
          ),
          header: 'Ciudad'
        })
      ),

    columnHelper.accessor('email_sucursal', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {
            editar && info.row.original.id === IDSucursal
              ? (
                <div className='w-full flex-col items-center'>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.email_sucursal ? true : undefined}
                    invalidFeedback={formik.errors.email_sucursal ? String(formik.errors.email_sucursal) : undefined}
                    >
                    <FieldWrap>
                      <Input
                        type='text'
                        name='email_sucursal'
                        onChange={formik.handleChange}
                        value={formik.values.email_sucursal}
                      />  
                    </FieldWrap>
                  </Validation>
                </div>
              )
              : <span >{info.row.original.email_sucursal}</span>
          }
        </div>
      ),
      header: 'Email'
    }),
    columnHelper.display({
      id: 'edicion',
      cell: (info) => {

        return (
          <div className='font-bold w-full flex justify-center gap-2 flex-wrap'>
            {
                editar && info.row.original.id === IDSucursal
                  ? (
                    <div className='flex gap-2'>
                      <Button
                        variant='solid'
                        color='emerald'
                        colorIntensity='600'
                        className='hover:scale-105'
                        onClick={() => formik.handleSubmit()}
                        >
                          <MdSaveAs style={{ fontSize: 25 }}/>
                      </Button>
  
                      <Button
                        variant='solid'
                        color='red'
                        colorIntensity='700'
                        className='hover:scale-105'
                        onClick={() => setEditar(false)}
                        >
                          <HeroXMark style={{ fontSize: 25 }}/>
                      </Button>
                    </div>
                  )
                  : (
                    <>
                      <Button
                        variant='solid'
                        color='blue'
                        colorIntensity='700'
                        className='hover:scale-105'
                        onClick={() => {
                          setEditar(true)
                          setIDSurcursal(info.row.original.id)
                        }}
                        >
                          <HeroPencilSquare style={{ fontSize: 25 }}/>
                      </Button>

                      <Button
                        variant='solid'
                        color='red'
                        colorIntensity='700'
                        className='hover:scale-105'
                        >
                          <HeroXMark style={{ fontSize: 25 }}/>
                      </Button>
                    </>
                    
                  )
              }

          </div>
        )
      },
      header: 'Email'
    }),
  ]

  const table = useReactTable({
    data: sucursales,
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
      pagination: { pageSize: 4 },
    },
  })

  return (
    <Container breakpoint={null} className="w-full !p-0">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Sucursales</CardTitle>
          <div className='w-4/12 flex justify-end gap-3'>
            {
              editar
                ? null
                : (
                  <ModalForm
                    open={openModal}
                    setOpen={setOpenModal}
                    variant='solid'
                    width='w-full hover:scale-105'
                    textButton={'Agregar Sucursal'}
                    title={tipo_cliente === 'clientemercadointerno' ? 'Agregar Sucursal Cliente Mercado Interno': 'Agregar Sucursal Cliente Exportación'}
                    >
                      {
                        tipo_cliente === 'clientemercadointerno'
                          ? (
                            <FormularioSucursalesClientesMercadoInterno setOpen={setOpenModal} setEditar={setEditar} tipo_cliente={tipo_cliente}/>
                          )
                          : <FormularioSucursalMercadoExportacion setOpen={setOpenModal} setEditar={setEditar} tipo_cliente={tipo_cliente}/>
                      }
                  </ModalForm>
                ) 
            }

            
            
          </div>
        </CardHeader>
        <CardBody className={`overflow-auto ${editar ? 'h-96' : ''}`}>
          <TableTemplate className={`table-fixed max-md:min-w-[70rem]`} table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaSucursales
