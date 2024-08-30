import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact from '../../../components/form/SelectReact'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import Input from '../../../components/form/Input'
import Button from '../../../components/ui/Button'
import TablaPalletProductoTerminado from '../../Bodegas/Pallet Producto Terminado/TablaPalletProductoTerminado'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchContentTypes } from '../../../redux/slices/registrosbaseSlice'
import { useLocation, useParams } from 'react-router-dom'
import { fetchDespacho, fetchFrutaDespacho, fetchFrutaEnPedido, fetchPedidoExportacion, fetchPedidoInterno } from '../../../redux/slices/pedidoSlice'
import { fetchGuiaDeSalida } from '../../../redux/slices/guiaSalidaSlice'
import TablaBodegasUnidas from '../../Bodegas/Bodegas Unidas/TablaBodegasUnidas'

const proveedores = [
  { value: 'binbodega', label: 'Pepa En Bin'},
  { value: 'palletproductoterminado', label: 'Pallet Producto Terminado'}
]

interface IFormularioFrutaEnPedidoProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioFrutaEnPedido: FC<IFormularioFrutaEnPedidoProps> = ({ setOpen }) => {
  const contenttypes = useAppSelector((state: RootState) => state.core.contenttypes)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const guia_salida = useAppSelector((state: RootState) => state.guia_salida.guia_de_salida)
  const pedido_exportacion = useAppSelector((state: RootState) => state.pedidos.pedido_exportacion)
  const pedido_interno = useAppSelector((state: RootState) => state.pedidos.pedido_interno)
  const [IDFruta, setFruta] = useState<number | null>(null)
  const { verificarToken } = useAuth()
  const { pathname } = useLocation()
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho)



  useEffect(() => {
    dispatch(fetchContentTypes({ token, verificar_token: verificarToken }))
  }, [])



  const optionsProveedorDeFruta = proveedores.map((proveedor) => ({
    value: proveedor.value,
    label: proveedor.label
  })) 

  const formik = useFormik({
    initialValues: {
      tipo_fruta: '',
      cantidad: 0,
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const contentFinded = contenttypes.find(type => type.model === values.tipo_fruta)
      
      if (guia_salida || pedido_exportacion || pedido_interno){
        const res = await fetchWithTokenPost(`api/pedidos/${guia_salida?.id_pedido_padre}/frutas/`, 
          {
            id_fruta: IDFruta,
            tipo_fruta: contentFinded?.id,
            cantidad: values.cantidad,
            pedido: guia_salida?.id_pedido_padre || pedido_exportacion?.id_pedido_padre || pedido_interno?.id_pedido_padre,
          }, token_verificado)

          if (res.ok){
            toast.success('Fruta agregada correctamente!')
            if (pathname.includes('pedido-interno')) {
              dispatch(fetchFrutaEnPedido({ id: pedido_interno?.id_pedido_padre, token, verificar_token: verificarToken  }))
            } else if (pathname.includes('pedido-exportacion')) {
              dispatch(fetchFrutaEnPedido({ id: pedido_exportacion?.id_pedido_padre, token, verificar_token: verificarToken  }))
            } else if (pathname.includes('guia-salida')){
              dispatch(fetchFrutaEnPedido({ id: guia_salida?.id_pedido_padre, token, verificar_token: verificarToken  }))
            }
            dispatch(fetchDespacho({ id: despacho?.pedido, token, verificar_token: verificarToken }))
            dispatch(fetchFrutaDespacho({ id: despacho?.id, token, verificar_token: verificarToken}))
            setOpen(false)
          } else {
            toast.error('No se pudo definir la fruta esperada, volver a intentar')
          }
      } else {
        toast.error('No se pudo definir la fruta esperada, volver a intentar')
      }
    }
  })

  useEffect(() => {
    if (formik.values.tipo_fruta === 'binbodega'){
      formik.setFieldValue('cantidad', 1)
    } else {
      formik.setFieldValue('cantidad', 0)
    }
  }, [formik.values.tipo_fruta])




  return (
    <Container>
      <Card>
        <CardBody>
          <div className='w-full flex justify-between gap-5'>
            <div className='w-full'>
              <Label htmlFor='tipo_fruta'>Tipo Fruta: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_fruta ? true : undefined}
                invalidFeedback={formik.errors.tipo_fruta ? String(formik.errors.tipo_fruta) : undefined}
              >
                <FieldWrap>
                  <SelectReact
                    options={optionsProveedorDeFruta}
                    id='tipo_fruta'
                    placeholder='Selecciona un opción'
                    name='tipo_fruta'
                    className='py-[8px]'
                    onChange={(value: any) => {
                      formik.setFieldValue('tipo_fruta', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label htmlFor='cantidad'>Cantidad: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.cantidad ? true : undefined}
                invalidFeedback={formik.errors.cantidad ? String(formik.errors.cantidad) : undefined}
              >
                <FieldWrap>
                  <Input
                    type='number'
                    name='cantidad'
                    min={0}
                    max={formik.values.tipo_fruta === 'binbodega' ? 1 : 100}
                    className='py-2.5'
                    onChange={formik.handleChange}
                    value={formik.values.cantidad}
                    />
                </FieldWrap>
              </Validation>
            </div>
          </div>
          <div className='flex justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              onClick={() => formik.handleSubmit()}
              >
                Registrar Tipo Fruta
            </Button>
          </div>
        </CardBody>

        <Card>
          {
            formik.values.tipo_fruta === 'binbodega'
              ? <TablaBodegasUnidas setFruta={setFruta}/>
              : formik.values.tipo_fruta === 'palletproductoterminado'
                ? <TablaPalletProductoTerminado setFruta={setFruta} fruta={IDFruta}/>
                : null
          }
        </Card>
      </Card>

     

    </Container>
  )
}

export default FormularioFrutaEnPedido
