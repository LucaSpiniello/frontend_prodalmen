import { useFormik } from 'formik'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { optionsCalibres, optionsCalidad, optionsNombreProducto, optionsVariedad } from '../../../utils/options.constantes'
import Input from '../../../components/form/Input'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { useEffect, Dispatch, SetStateAction, FC } from 'react'
import {fetchPedidoExportacion } from '../../../redux/slices/pedidoSlice'
import Button from '../../../components/ui/Button'
import { useParams } from 'react-router-dom'
import { fetchWithToken, fetchWithTokenPost } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchTipoEmbalaje } from '../../../redux/slices/embalajeSlice'

interface FrutaenPedidoProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioFrutaPedidoExportacion: FC<FrutaenPedidoProps> = ({ setOpen }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  
  const tipo_embalaje = useAppSelector((state: RootState) => state.embalaje.tipo_embalaje)

  useEffect(() => {
    dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
  }, [])

  const formik = useFormik({
    initialValues: {
      nombre_producto: '1',
      calidad: '',
      variedad: '',
      calibre: '',
      kilos_solicitados: '',
      precio_kilo_neto: '',
      preparado: false,
      formato: ''
    },
    onSubmit: async (values: any) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/pedidos_exportacion/${id}/frutas/`, 
        {
          exportacion: id,
          ...values
        }, token_verificado)
      if (res.ok){
        toast.success('Se ha agregado correctamente la fruta')
        dispatch(fetchPedidoExportacion({ id: parseInt(id!), token, verificar_token: verificarToken }))

        setOpen(false)
      } else {
        toast.error('No se ha logrado ingresar la fruta, vuelve a internar')
      }
    }
  })

  const optionsTipoEmbalaje: TSelectOptions = tipo_embalaje.
    filter(tipo => tipo.id !== Number(formik.values.formato)).
    map((tipo) => ({ value: String(tipo.id), label: `${tipo.nombre} de ${tipo.peso} Kilos`}))
    ?? []




  return (
    <Container breakpoint={null} className='w-full h-full'>
      <Card>
        <CardBody className='flex flex-col gap-5'>
          <article className='flex w-full justify-between gap-2 '>
            <div className='w-full'>
              <Label htmlFor='nombre_producto'>Nombre Producto: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.nombre_producto ? true : undefined}
                invalidFeedback={formik.errors.nombre_producto ? String(formik.errors.nombre_producto) : undefined}
              >
                <FieldWrap>
                  <SelectReact
                    options={optionsNombreProducto}
                    id='nombre_producto'
                    placeholder='Selecciona un opción'
                    name='nombre_producto'
                    className='py-[8px]'
                    onChange={(value: any) => {
                      formik.setFieldValue('nombre_producto', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label className='dark:text-white text-zinc-900' htmlFor='variedad'>Variedad: </Label>
              <Validation

                isValid={formik.isValid}
                isTouched={formik.touched.variedad ? true : undefined}
                invalidFeedback={formik.errors.variedad ? String(formik.errors.variedad) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsVariedad}
                    id='variedad'
                    name='variedad'
                    placeholder='Selecciona una variedad'
                    className='h-14'
                    value={optionsVariedad.find(variedad => variedad?.label === formik.values.variedad)}
                    onChange={(value: any) => {
                      formik.setFieldValue('variedad', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label className='dark:text-white text-zinc-900'  htmlFor='calibre'>Calibre: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.calibre ? true : undefined}
                invalidFeedback={formik.errors.calibre ? String(formik.errors.calibre) : undefined}>
                <FieldWrap>
                  <SelectReact
                      options={optionsCalibres}
                      id='calibre'
                      name='calibre'
                      placeholder='Selecciona una calibre'
                      className='h-14'
                      onChange={(value: any) => {
                        formik.setFieldValue('calibre', value.value)
                      }}
                    />
                </FieldWrap>
              </Validation>
            </div>
          </article>

          <article className='flex w-full justify-between gap-2 '>
            <div className='w-full'>
              <Label htmlFor='calidad'>Nombre Producto: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.calidad ? true : undefined}
                invalidFeedback={formik.errors.calidad ? String(formik.errors.calidad) : undefined}
              >
                <FieldWrap>
                  <SelectReact
                    options={optionsCalidad}
                    id='calidad'
                    placeholder='Selecciona un opción'
                    name='calidad'
                    className='py-[8px]'
                    onChange={(value: any) => {
                      formik.setFieldValue('calidad', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label className='dark:text-white text-zinc-900' htmlFor='precio_kilo_neto'>Precio Kilo: </Label>
              <Validation

                isValid={formik.isValid}
                isTouched={formik.touched.precio_kilo_neto ? true : undefined}
                invalidFeedback={formik.errors.precio_kilo_neto ? String(formik.errors.precio_kilo_neto) : undefined}
                >
                <FieldWrap>
                  <Input
                  type='number'
                  name='precio_kilo_neto'
                  onChange={formik.handleChange}
                  className='py-[8.5px]'
                  value={formik.values.precio_kilo_neto}
                />
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full'>
              <Label className='dark:text-white text-zinc-900'  htmlFor='kilos_solicitados'>Kilos Solicitados: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.kilos_solicitados ? true : undefined}
                invalidFeedback={formik.errors.kilos_solicitados ? String(formik.errors.kilos_solicitados) : undefined}>
                <FieldWrap>
                  <Input
                    type='number'
                    name='kilos_solicitados'
                    onChange={formik.handleChange}
                    className='py-[8.5px]'
                    value={formik.values.kilos_solicitados}
                  />
                </FieldWrap>
              </Validation>
            </div>
          </article>

          <article className='flex w-full justify-between gap-2 '>
            <div className='w-4/12'>
              <Label htmlFor='formato'>Tipo Embalaje: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.formato ? true : undefined}
                invalidFeedback={formik.errors.formato ? String(formik.errors.formato) : undefined}
              >
                <FieldWrap>
                  <SelectReact
                    options={[{ value: '', label: 'Selecciona una opción '}, ...optionsTipoEmbalaje]}
                    id='formato'
                    placeholder='Selecciona un opción'
                    name='formato'
                    className='py-[8px]'
                    onChange={(value: any) => {
                      formik.setFieldValue('formato', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>
          </article>

          <article className='w-full flex justify-end'>
            <Button
              variant='solid'
              onClick={() => formik.handleSubmit()}
              size='lg'
              >
                Añadir Fruta al Pedido
            </Button>
          </article>


        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioFrutaPedidoExportacion
