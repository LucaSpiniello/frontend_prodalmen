import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../utils/constante'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import Input from '../../../../components/form/Input'
import { Switch } from 'antd'
import Tooltip from '../../../../components/ui/Tooltip'
import Button from '../../../../components/ui/Button'
import { FaCirclePlus } from 'react-icons/fa6'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import useDarkMode from '../../../../hooks/useDarkMode'
import { TEnvases } from '../../../../types/TypesRecepcionMP.types'
import { fetchGuiaRecepcion } from '../../../../redux/slices/recepcionmp'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Label from '../../../../components/form/Label'
import { fetchCamiones } from '../../../../redux/slices/camionesSlice'

interface IEdicionGuiaRecepcionProps {
  variedad: boolean
  detalle?: Dispatch<SetStateAction<boolean>>
}

const FooterFormularioEdicionGuiaRecepcion: FC<IEdicionGuiaRecepcionProps> = ({ detalle }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { isDarkTheme } = useDarkMode()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)

  const [iotBruto, setIotBruto] = useState<boolean>(false)
  const [iotBrutoAcoplado, setIotBrutoAcoplado] = useState<boolean>(false)

  const guia_recepcion = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (camiones.length < 1){
      dispatch(fetchCamiones({ token, verificar_token: verificarToken }))
    }
  }, [camiones])

  const initialRows = [
    {
      id: 1,
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      envase: null,
      variedad: null,
      kilos_tara_1: 0,
      kilos_tara_2: 0,
      tipo_producto: '1',
      cantidad_envases: null
    },
  ]

  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
  )

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
        guiarecepcion: guia_recepcion?.id,
        creado_por: guia_recepcion?.creado_por,
        envases: JSON.stringify(envasesData)
      }

      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithTokenPost(`api/recepcionmp/${guia_recepcion?.id}/lotes/`, { ...lotesData, envases: envasesData },token_verificado)
        if (res.ok) {
          toast.success("la guia de recepción fue registrado exitosamente!!")
          //@ts-ignore
          dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken }))
          detalle!(false)
          setDisabled(false)
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
    const nuevaFila = { id: rows.length, kilos_brutos_1: 0, kilos_brutos_2: 0, kilos_tara_1: 0, kilos_tara_2: 0, envase: null, variedad: null, tipo_producto: '1', cantidad_envases: null };
    setRows((prevRows) => [...prevRows, nuevaFila]);
  }

  const eliminarFila = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  }

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
  }

  const optionsVariedad: TSelectOptions = (rows.length <= 1) ?
    VARIEDADES_MP.map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    })) :
    VARIEDADES_MP.filter(variedad =>
      rows.some(row => row.variedad === variedad.value)
    ).map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    }))


    const camionAcoplado = camiones?.find((camion) => camion.id === parseInt(guia_recepcion?.camion!))?.acoplado

    const optionEnvases: TSelectOptions = envases
    .filter((envase: TEnvases) => !rows.some(row => row.envase === String(envase.id)))
    .map((envase: TEnvases) => ({
      value: String(envase.id),
      label: envase.nombre
    }));


    const optionsTipoFruta: TSelectOptions = rows.length <= 1
    ? TIPO_PRODUCTOS_RECEPCIONMP.map(producto => ({
        value: String(producto.value),
        label: producto.label
      }))
    : TIPO_PRODUCTOS_RECEPCIONMP.filter(producto =>
        rows.some(row => row.tipo_producto === producto.value)
      ).map(producto => ({
        value: String(producto.value),
        label: producto.label
      }));
  
  

  return (
    <Card>
      <CardHeader>
      <div className='w-full flex flex-col md:flex-row lg:flex-row justify-between items-center gap-2'>
        <div className='w-full md:w-8/12 lg:w-5/12 md:mx-auto lg:mx-auto flex flex-col'>
          <Label htmlFor='kilos_brutos_1'>Kilos Brutos</Label>
          <div className='flex w-full items-center gap-5'>
            <Input
                type='number'
                name='kilos_brutos_1'
                className='py-3 col-span-3 w-56'
                min={0}
                value={formik.values.kilos_brutos_1}
                onChange={formik.handleChange}
                disabled={iotBruto ? true : false}
              />
            <Switch
              className='row-start-2 col-start-4 w-16 bg-slate-300'
              onChange={() => {
                setIotBruto(prev => !prev)
              }} />
          </div>
        </div>

        {
          camionAcoplado
            ? (
              <div className='w-full md:w-8/12 lg:w-5/12 md:mx-auto lg:mx-auto flex flex-col'>
                <Label htmlFor='kilos_brutos_2'>Kilos Brutos Acoplado</Label>
                <div className='flex w-full items-center gap-5'>
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
            )
            : null
        }
      </div>

      <div className={`flex w-full justify-between`}>
        <Button
          title='Agregar Envase'
          variant='solid'
          onClick={agregarFila}
          color='sky'
          colorIntensity='700'>
          <FaCirclePlus className='text-3xl' />
        </Button>

        <Button
          variant='solid'
          onClick={() => {setDisabled(true);formik.handleSubmit()}}
          isDisable={disabled}
          color='blue'
          colorIntensity='700'
          className='text-white hover:scale-105'>
          Registrar Guia de Recepción
        </Button>
      </div>
          
    </CardHeader>
    <CardBody>
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
                      value={optionsTipoFruta.find(option => option?.value === '1')}
                      className='h-14'
                      onChange={(value: any) => {
                        handleChangeRow(row.id, 'tipo_producto', value.value)
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant='solid'
                      color='red'
                      colorIntensity='700'
                      onClick={() => eliminarFila(row.id)}
                      className='py-3 hover:scale-105'>
                      Eliminar
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
  )
}

export default FooterFormularioEdicionGuiaRecepcion
