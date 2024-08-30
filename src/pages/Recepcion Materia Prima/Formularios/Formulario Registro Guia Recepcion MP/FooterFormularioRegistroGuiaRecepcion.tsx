import { FC, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FaCirclePlus } from "react-icons/fa6";
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Switch } from 'antd';
import { TGuia } from '../../../../types/TypesRecepcionMP.types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../utils/constante';
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact';
import Input from '../../../../components/form/Input';
import { fetchEnvases } from '../../../../redux/slices/envasesSlice';
import { useAuth } from '../../../../context/authContext';
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils';
import { GUARDAR_LOTES_EN_GUIA, fetchGuiaRecepcion } from '../../../../redux/slices/recepcionmp';
import Button from '../../../../components/ui/Button';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card';
import TableTemplate, { TableColumn } from '../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Tooltip from '../../../../components/ui/Tooltip';
import { BiXCircle } from 'react-icons/bi';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IFooterProps {
  data: TGuia,
  variedad: boolean
}

const FooterFormularioRegistro: FC<IFooterProps> = ({ data }) => {
  const { verificarToken } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const [iotBruto, setIotBruto] = useState<boolean>(false)
  const [iotBrutoAcoplado, setIotBrutoAcoplado] = useState<boolean>(false)
  const { pathname } = useParams()
  const navigate = useNavigate()
  // const [client, setClient] = useState<MqttClient | null>(null)
  // const [listoIot_1, setListoIot_1] = useState<boolean>(false)
  // const [listoIot_2, setListoIot_2] = useState<boolean>(false)

  // const [icono_1, setIcono_1] = useState<boolean>(false)

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [disabled, setDisabled] = useState<boolean>(false)


  useEffect(() => {
    dispatch(fetchEnvases({ token, verificar_token: verificarToken }))
  }, [])
  
  const initialRows = [
    {
      id: 1,
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      envase: null,
      variedad: null,
      tipo_producto: '1',
      cantidad_envases: null
    },
  ];
  
  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
  );

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

      const envasesData = rows.map((row) => ({
        envase: row.envase,
        variedad: row.variedad,
        tipo_producto: row.tipo_producto,
        cantidad_envases: row.cantidad_envases,
      }));

      const lotesData = {
        numero_lote: 0,
        kilos_brutos_1: values.kilos_brutos_1,
        kilos_brutos_2: values.kilos_brutos_2,
        kilos_tara_1: 0,
        kilos_tara_2: 0,
        estado_recepcion: '1',
        guiarecepcion: data.id,
        creado_por: data.creado_por,
        envases: JSON.stringify(envasesData)
      }

      try {

         const token_verificado = await verificarToken(token!)
        
         if (!token_verificado){
            throw new Error('Token no verificado')
         }

        const res = await fetchWithTokenPost(`api/recepcionmp/${data.id}/lotes/`,
         {...lotesData, envases: envasesData },
         token_verificado
        )
        if (res.ok) {
          setDisabled(false)
          toast.success("la guia de recepción fue registrado exitosamente!!")
          //@ts-ignore
          navigate(`/rmp/recepcionmp/${data?.id}`, { state: { pathname: pathname }})
        } else {
          setDisabled(false)
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        setDisabled(false)
        console.log(error)
      }
    }
  })


  const agregarFila = () => {
    const nuevaFila = { id: rows.length + 1, kilos_brutos_1: 0, kilos_brutos_2: 0, envase: null, variedad: null, tipo_producto: '1', cantidad_envases: null };
    //@ts-ignore
    setRows((prevRows) => [...prevRows, nuevaFila]);
  };

  const eliminarFila = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleChangeRow = (id: number, fieldName: string, value: string | number) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [fieldName]: value } : row))
    );
    if (value === '42'){
      //@ts-ignore
      setRows((prevRows) =>
        //@ts-ignore
        prevRows.map((row) => (row.id === id ? { ...row, ['cantidad_envases']: 1 } : row))
      );
    } else {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, [fieldName]: value } : row))
      );
    }
  };


  const envasesList = (rows.length < 1) ?
    envases?.map(envase => ({
      value: String(envase.id),
      label: envase.nombre
    })) ?? [] :
    envases?.filter(envase =>
      //@ts-ignore
      !rows.some(row => row.envase === String(envase.id)))
      .map((envase) => ({
        value: String(envase.id),
        label: envase.nombre
      })) ?? []

  console.log(envasesList)


  const variedadFilter = (rows.length <= 1) ?
    VARIEDADES_MP.map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    })) ?? [] :
    VARIEDADES_MP.filter(variedad =>
      rows.some(row => String(row.variedad) === variedad.value)
    ).map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    })) ?? []




  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []

  const optionEnvases: TSelectOptions | [] = envasesList
  const optionsVariedad: TSelectOptions | [] = variedadFilter
  const optionsTipoFruta: TSelectOptions | [] = tipoFrutaFilter
  const camionAcoplado = camiones?.find(camion => camion.id === Number(data.camion))?.acoplado

  // useEffect(() => {
  //   if (client) {
  //     client.on('connect', () => {
  //       client.subscribe('prodalmen/recepcionmp/pesaje')
  //     })
  //     client.on('error', error => {
  //       try {
  //         toast.error(`MQTT error: ${error}`);
  //       } catch (err) {
  //         toast.error(`Connection error: ${err}`);
  //       }
  //     })
  //     client.on('message', (topic, payload, packet) => {
  //       console.log(`Message ${payload.toString()}, from topic ${topic}`)
  //       console.log(listoIot_1, listoIot_2)
  //       if (listoIot_1 == false && listoIot_2 == false) {
  //         formik.setFieldValue('kilos_brutos_1', payload)
  //       } else if (listoIot_1 == true && listoIot_2 == false) {
  //         formik.setFieldValue('kilos_brutos_2', payload)
  //       } else if (listoIot_2 == true && listoIot_1 == true) {
  //         client.end()
  //       }
  //     })
  //   } else {
  //     setClient(mqtt.connect({
  //       port: 8083,
  //       hostname: `${process.env.VITE_BASE_IOT_DEV}`,
  //       clientId: `mqtt_${Math.random().toString(16).substring(2, 8)}`,
  //       username: 'user01',
  //       password: 'Hola.2024',
  //       clean: true,
  //       reconnectPeriod: 1000,
  //       connectTimeout: 30 * 1000,
  //       rejectUnauthorized: true,
  //       path: '/mqtt',
        
  //     }))
  //   }
  // }, [client])


  return (
    <Card className='h-full w-full'>
      <CardHeader>
        <div className='w-full mb-5 grid grid-cols-4 px-5 justify-between items-center gap-x-2'>
          <div className={`gap-2 ${camionAcoplado ? 'w-full col-start-1 col-span-2' : 'w-[90%] col-start-2 col-span-2'}`}>
            <label
              htmlFor="kilos_brutos_1"
              className='col-span-3'
            >Kilos Brutos</label>
            <div className='row-start-2 flex gap-2 items-center'>
              {/* {
                personalizacionData?.iot_balanza_recepcionmp == 'Manual' ? 
                  <Input
                    type='number'
                    name='kilos_brutos_1'
                    className='py-3  col-span-3 w-56'
                    value={formik.values.kilos_brutos_1}
                    onChange={formik.handleChange}
                    disabled={iotBruto ? true : false}
                  /> : personalizacionData?.iot_balanza_recepcionmp == 'Automático' ? 
                    <Input
                      type='number'
                      name='kilos_brutos_1'
                      className='py-3  col-span-3 w-56'
                      value={formik.values.kilos_brutos_1}
                      readOnly={true}
                      // disabled={true}
                    /> 
                    : null
              }
              {
                listoIot_1 === false ?
                <Button variant='outline' onClick={() => {setListoIot_1((prevState) => !prevState)}} icon='HeroArrowSmallRight'></Button> : <Button variant='outline' color={icono_1 ? 'emerald' : 'red'} onMouseLeave={() => {setIcono_1(true)}} onMouseEnter={() => {setIcono_1(false)}} onClick={() => {setListoIot_1((prevState) => !prevState)}} icon={icono_1 ? 'HeroCheck' : 'HeroXMark'}></Button>
              } */}


              {/* DEFAULT */}
              <Input
                type='number'
                name='kilos_brutos_1'
                className='py-3  col-span-3 w-56'
                min={0}
                value={formik.values.kilos_brutos_1}
                onChange={formik.handleChange}
                disabled={iotBruto ? true : false}
              />
              <Switch
                className='row-start-2 col-start-4 w-16 bg-slate-300'
                onChange={() => {
                  setIotBruto(prev => !prev)
                  // const client = mqtt.connect('mqtt://prodalmen.cl')
                }} />
            </div>
          </div>

          {
            camionAcoplado
              ? (
                <div className='grid grid-cols-4 gap-2 items-center justify-center w-full  col-span-2'>
                  <div className={'w-full col-start-1 col-span-4'}>
                    <label
                      htmlFor="kilos_brutos_2"
                      className='col-span-3'
                    >Kilos Brutos Acoplado</label>
                    <div className='row-start-2 flex gap-2 items-center'>
                    {/* {
                      personalizacionData?.iot_balanza_recepcionmp == 'Manual' ? 
                        <Input
                          type='number'
                          name='kilos_brutos_1'
                          className='py-3  col-span-3 w-56'
                          value={formik.values.kilos_brutos_2}
                          onChange={formik.handleChange}
                          disabled={iotBruto ? true : false}
                        /> : personalizacionData?.iot_balanza_recepcionmp == 'Automático' ? 
                          <Input
                            type='number'
                            name='kilos_brutos_1'
                            className='py-3  col-span-3 w-56'
                            value={formik.values.kilos_brutos_2}
                            readOnly={true}
                            // disabled={true}
                          /> 
                          : null
                    } */}
                    <Input
                      type='number'
                      name='kilos_brutos_2'
                      className='py-3  col-span-3 w-56'
                      value={formik.values.kilos_brutos_2}
                      onChange={formik.handleChange}
                      disabled={iotBrutoAcoplado ? true : false}
                      min={0}
                    />
                    <Switch
                      className='row-start-2 col-start-4 w-16 bg-slate-300'
                      onChange={() => {
                        setIotBrutoAcoplado(prev => !prev)
                      }} />
                    </div>
                    
                    </div>
                </div>
              )
              : null
          }
        </div>

        <div className={`flex w-full justify-between`}>
          <Tooltip text='Agregar Envase'>
            <Button
              variant='solid'
              onClick={agregarFila}
              className=''>
              <FaCirclePlus className='text-3xl' />
            </Button>
          </Tooltip>
          <Button
            variant='solid'
            isDisable={disabled}
            onClick={() => {setDisabled(true); formik.handleSubmit()}}
            className='bg-blue-800 hover:bg-blue-700 border-none rounded-md text-white hover:scale-105'>
            Registrar Guia de Recepción
          </Button>
        </div>
            
      </CardHeader>
      <CardBody className='overflow-x-auto h-[500px]'>
        <TableContainer sx={{ height: 415 }}>
          <Table sx={{ minWidth: 750, background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Envase</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Cantidad Envases</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Variedad</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Producto</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.map((row, index) => {

                return (
                  <TableRow key={index} style={{ background: `${isDarkTheme ? '#09090B' : 'white'}`, position: 'relative' }}>


                    <TableCell style={{ zIndex: 1, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionEnvases}
                        id='camion'
                        name='camion'
                        placeholder='Selecciona un envase'
                        className='h-14 w-full '
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'envase', value.value)
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ maxWidth: 120, minWidth: 120 }}>
                      <Input
                        type='number'
                        name='kilos_brutos_2'
                        className='py-3 '
                        value={row.cantidad_envases!}
                        onChange={(e: any) => {
                          handleChangeRow(row.id, 'cantidad_envases', e.target.value)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ zIndex: 1, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionsVariedad}
                        id='camion'
                        name='camion'
                        placeholder='Selecciona una variedad'
                        className='h-14 '
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'variedad', value.value)
                        }}
                      />

                    </TableCell>

                    <TableCell style={{ zIndex: 100, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionsTipoFruta}
                        id='tipo_producto'
                        name='tipo_producto'
                        placeholder='Selecciona una variedad'
                        value={optionsTipoFruta.find(option => option?.value === String(row.tipo_producto))}
                        className='h-14'
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'tipo_producto', value.value)
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant='solid'
                        onClick={() => eliminarFila(row.id)}
                        className='bg-red-800 rounded-md hover:scale-105
                        hover:bg-red-700 text-white border-none'>
                        <BiXCircle style={{ fontSize: 35 }}/>
                      </Button>
                    </TableCell>
                  </TableRow>

                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default FooterFormularioRegistro;

