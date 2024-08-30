import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { useLocation, useParams } from 'react-router-dom'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { actualizar_estado_pedido_interno, fetchDespacho, fetchFrutaEnPedido, fetchPedidoExportacion, fetchPedidoInterno, fetchPedidos } from '../../../redux/slices/pedidoSlice'
import { format } from '@formkit/tempo'
import { fetchTodosPalletsProductoTerminados } from '../../../redux/slices/embalajeSlice'
import ButtonsPedido, { OPTIONS_PEDIDO, TTabsPedidos } from '../ButtonsDetallePedido'
import DetalleDespacho from '../Despacho/DetalleDespacho'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import { optionsCondicionPago } from '../../../utils/options.constantes'
import { useFormik } from 'formik'
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import Textarea from '../../../components/form/Textarea'
import Label from '../../../components/form/Label'
import Input from '../../../components/form/Input'
import ModalForm from '../../../components/ModalForm.modal'
import { fetchGuiaDeSalida } from '../../../redux/slices/guiaSalidaSlice'
import { Switch } from 'antd'

const RegistroInfoDespacho = ({ id_pedido, setOpen } : { id_pedido: number | undefined, setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { pathname } = useLocation()
  const pedido_interno = useAppSelector((state: RootState) => state.pedidos.pedido_interno)
  const pedido_exportacion = useAppSelector((state: RootState) => state.pedidos.pedido_exportacion)
  const guia_de_salida = useAppSelector((state: RootState) => state.guia_salida.guia_de_salida)
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho) 



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
        setOpen(false)
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
        <CardBody>
          <div className='flex justify-between gap-5 mb-5'>
            <div className='w-full'>
              <Label htmlFor='nombre_chofer'>Nombre Chofer: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.nombre_chofer ? true : undefined}
                invalidFeedback={formik.errors.nombre_chofer ? String(formik.errors.nombre_chofer) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='text'
                    name='nombre_chofer'
                    onChange={formik.handleChange}
                    value={formik.values.nombre_chofer}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='rut_chofer'>Rut Chofer: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.rut_chofer ? true : undefined}
                invalidFeedback={formik.errors.rut_chofer ? String(formik.errors.rut_chofer) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='text'
                    name='rut_chofer'
                    onChange={formik.handleChange}
                    value={formik.values.rut_chofer}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='observaciones'>Observaciones: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.observaciones ? true : undefined}
                invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='text'
                    name='observaciones'
                    onChange={formik.handleChange}
                    value={formik.values.observaciones}
                    />
                </FieldWrap>
              </Validation>
            </div>

          </div>

          <div className='flex justify-between gap-5'>
            <div className='w-full'>
              <Label htmlFor='camion'>Camión: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.camion ? true : undefined}
                invalidFeedback={formik.errors.camion ? String(formik.errors.camion) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='text'
                    name='camion'
                    onChange={formik.handleChange}
                    value={formik.values.camion}
                    />
                </FieldWrap>
              </Validation>
            </div>
  
  
            <div className='w-full'>
              <Label htmlFor='empresa_transporte'>Empresa Transporte: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.empresa_transporte ? true : undefined}
                invalidFeedback={formik.errors.empresa_transporte ? String(formik.errors.empresa_transporte) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='text'
                    name='empresa_transporte'
                    onChange={formik.handleChange}
                    value={formik.values.empresa_transporte}
                    />
                </FieldWrap>
              </Validation>
            </div>
  
            <div className='w-6/12'>
              <Label htmlFor='despacho_parcial'>Despacho Parcial: </Label>
              <div className='w-full flex items-center justify-center'>
                <Switch
                  className='w-[60%] mx-auto mt-2'
                  onChange={checked => formik.setFieldValue('despacho_parcial', checked)}
                  checked={formik.values.despacho_parcial}
                />
              </div>
            </div>
  
          </div>

          <div className='w-full flex justify-end mt-5'>
            <Button
              variant='solid'
              color='emerald'
              colorIntensity='700'
              onClick={() => formik.handleSubmit()}
              >
                Guardar Información Despacho
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default RegistroInfoDespacho
