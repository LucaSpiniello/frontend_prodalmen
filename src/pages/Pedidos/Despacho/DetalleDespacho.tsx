import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithToken, fetchWithTokenPatch, fetchWithTokenPost } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { fetchDespacho, fetchFrutaDespacho, fetchPedidoExportacion, fetchPedidoInterno, finalizaDespacho } from '../../../redux/slices/pedidoSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaFrutaDespacho from './TablaFrutaDespacho'
import ButtonsDespacho, { OPTIONS_DESPACHO, TTabsDespacho } from './ButtonsDespacho'
import ModalForm from '../../../components/ModalForm.modal'
import ArmadoDespacho from '../Pedido Mercado Interno/ArmadoDespacho/ArmadoDespacho'
import SelectReact from '../../../components/form/SelectReact'
import { useLocation } from 'react-router-dom'
import { fetchGuiaDeSalida } from '../../../redux/slices/guiaSalidaSlice'
import DireccionDespachoInfo from './DireccionDespachoInfo'
import InformacionTransportista from './InformacionTransportista'

const DetalleDespacho = ({ id_pedido
  // , tipo_pedido, id_original 
} : { id_pedido: number | undefined
  // , tipo_pedido?: string, id_original: number | undefined
 }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState(false)
  const { pathname } = useLocation()
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho) 
  const [activeTab, setActiveTab] = useState<TTabsDespacho>(OPTIONS_DESPACHO.D)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const pedido_interno = useAppSelector((state: RootState) => state.pedidos.pedido_interno)
  const pedido_exportacion = useAppSelector((state: RootState) => state.pedidos.pedido_exportacion)
  const guia_de_salida = useAppSelector((state: RootState) => state.guia_salida.guia_de_salida)

  useEffect(() => {
    if (despacho){
      dispatch(fetchFrutaDespacho({ id: despacho.id, token, verificar_token: verificarToken }))
    }
  }, [despacho])


  const formik = useFormik({
    initialValues: {
      camion: '',
      despacho_parcial: false,
      empresa_transporte: '',
      nombre_chofer: '',
      observaciones: '',
      rut_chofer: ''
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/despachos/actualizar_despacho/?pedido=${id_pedido}`,
      {
        ...values
      }, token_verificado)
      
      if (res.ok){
        toast.success('Creación del despacho exitoso!')
        dispatch(fetchDespacho({ id: id_pedido, token, verificar_token: verificarToken }))
        if (pathname.includes('pedido-interno')){
          dispatch(fetchPedidoInterno({ id: pedido_interno?.id, token, verificar_token: verificarToken }))
        } else if (pathname.includes('pedido-exportacion')){
          dispatch(fetchPedidoExportacion({ id: pedido_exportacion?.id, token, verificar_token: verificarToken }))
        } else if (pathname.includes('guia-salida')){
          dispatch(fetchGuiaDeSalida({ id: guia_de_salida?.id, token, verificar_token: verificarToken }))
        }
        setEditar(false)
      } else {
        toast.error('No se ha podido actualizar')
      }
    }
  })
  


  useEffect(() => {
    if (despacho){
      formik.setValues({
        camion: despacho?.camion,
        despacho_parcial: despacho?.despacho_parcial,
        empresa_transporte: String(despacho?.empresa_transporte),
        nombre_chofer: despacho?.nombre_chofer,
        observaciones: despacho.observaciones,
        rut_chofer: despacho.rut_chofer
      })
    }
  }, [despacho])



  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardHeader>
        <ButtonsDespacho activeTab={activeTab} setActiveTab={setActiveTab}/>


{/*           
          <div className='flex gap-5'>
          {
            editar && activeTab.text === 'Detalle Despacho'
              ? (
                <>
                <Button
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  onClick={() => setEditar(false)}
                  >
                    Cancelar
                </Button>

                <Button
                  variant='solid'
                  color='emerald'
                  colorIntensity='700'
                  onClick={() => formik.handleSubmit()}
                  >
                    Guardar Cambios
                </Button>
                </>
                )
              : !editar && activeTab.text === 'Detalle Despacho'
                ? (
                  <Button
                    variant='solid'
                    color='blue'
                    colorIntensity='700'
                    onClick={() => setEditar(true)}
                    >
                      Editar
                  </Button>
                  )
                : despacho?.despacho_parcial && despacho.estado_despacho !== '2'
                  ? (
                    <ModalForm
                      variant='solid'
                      open={openModal}
                      setOpen={setOpenModal}
                      textButton={`Armar Despacho`}
                      title='Armar Despacho'
                      size={1400}
                      >
                        <ArmadoDespacho setOpen={setOpenModal}/>
                    </ModalForm>
                  )
                          
                  : null 
          }

          </div> */}
          {/* <div className='flex gap-5'>
            {
              despacho?.estado_despacho === '0' && despacho.productos_despacho.length >= 1 && (pedido_exportacion?.numero_factura || pedido_interno?.numero_factura)
                ? (
                  <Button
                    variant='solid'
                    color='emerald'
                    colorIntensity='700'
                    onClick={() => {
                      dispatch(finalizaDespacho({ id: despacho.id, params: { tipo_pedido: tipo_pedido, id_pedido: id_original }, token, verificar_token: verificarToken}))
                    }}
                    >
                      Despachar
                  </Button>
                )
                : null
            }
          </div> */}
          
        </CardHeader>
        {
          activeTab.text === 'Fruta en Despacho'
            ? (
              <CardBody className='!p-0'>
                <TablaFrutaDespacho />
              </CardBody>
            )
            : activeTab.text === 'Dirección'
              ? (
                <DireccionDespachoInfo />
              )
              : activeTab.text === 'Información Transportista'
                ? (
                  <InformacionTransportista />
                )
                : null
        }
        
      </Card>
    </Container>
  )
}

export default DetalleDespacho
