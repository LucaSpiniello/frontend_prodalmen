import React, { useEffect, useState } from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader } from '../../../components/ui/Card'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact from '../../../components/form/SelectReact'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils'
import { useFormik } from 'formik'
import Label from '../../../components/form/Label'
import { optionCalleBodega } from '../../../utils/options.constantes'
import { fetchPalletProductoTerminado, fetchProgramaEmbalajeIndividual } from '../../../redux/slices/embalajeSlice'
import Textarea from '../../../components/form/Textarea'
import TablaPalletProductoTerminado from './TablaPalletProductoTerminado'
import TablaCajasPalletProductoTerminado from './TablaCajasPalletProductoTerminado'
import Button from '../../../components/ui/Button'
import { format } from '@formkit/tempo'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const DetallePalletProductoTerminado = ({ id_pallet }: { id_pallet : number }) => {
  const [editar, setEditar] = useState(false)
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const pallet_producto_terminado = useAppSelector((state: RootState) => state.embalaje.pallet_producto_terminado)

  const formik = useFormik({
    initialValues: {
      calle_bodega: '',
      observaciones: '',
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPatch(`api/embalaje/${id}/pallet_producto_terminado/${id_pallet}/`, 
      {
        registrado_por: perfil?.id,
        embalaje: id,
        ...values
      }
      , token_verificado)
      if (res.ok){
        toast.success('Pallet actualizado exitosamente')
        //@ts-ignore
        dispatch(fetchPalletProductoTerminado({ id, params: { id_pallet }, token, verificar_token: verificarToken  }))
        setEditar(false)
      } else {
        toast.error('No se ha podido crear el pallet')
      }

    }
  })

  // useEffect(() => {
  //   if (id){
  //     //@ts-ignore
      
  //     dispatch(fetchProgramaEmbalajeIndividual({ id: parseInt(id!), token, verificar_token: verificarToken }))
  //   }
  // }, [id])

  // useEffect(() => {
  //   if (pallet_producto_terminado){
  //     formik.setValues({
  //       calle_bodega: String(pallet_producto_terminado.calle_bodega),
  //       observaciones: pallet_producto_terminado.observaciones
  //     })
  //   }
  // }, [pallet_producto_terminado])

  return (
    <Container breakpoint={null} className='w-full flex flex-col gap-5'>
      <Card>
        <CardHeader>
          {
            editar
              ? (
                <>
                  <Button
                    variant = 'solid'
                    color='red'
                    colorIntensity='700'
                    onClick={() => setEditar(false)}
                    >
                      Cancelar
                  </Button>

                  <Button
                    variant = 'solid'
                    color='emerald'
                    colorIntensity='700'
                    onClick={() => formik.handleSubmit()}
                    >
                      Guardar Cambios
                  </Button>

                  
                </>
              )
              : (
                <Button
                    variant = 'solid'
                    color='blue'
                    colorIntensity='700'
                    onClick={() => setEditar(true)}
                    >
                      Editar
                  </Button>
              )
          }
        </CardHeader>
        <CardBody className='flex flex-col gap-5'>
          <div className='flex gap-5 justify-between'>
            <div className='flex flex-col w-full'>
            <Label htmlFor='codigo_pallet'>Código Pallet: </Label>
              <div className='dark:bg-zinc-700 bg-zinc-200 p-2 rounded-md'>
                <span>{pallet_producto_terminado?.codigo_pallet}</span>
              </div>
            </div>

            {
              editar
                ? (
                  <div className='w-full flex-col items-center'>
                    <Label htmlFor='calle_bodega' className='!m-1'>Calle Bodega: </Label>

                    <Validation
                      isValid={formik.isValid}
                      isTouched={formik.touched.calle_bodega ? true : undefined}
                      invalidFeedback={formik.errors.calle_bodega ? String(formik.errors.calle_bodega) : undefined}
                      >
                      <FieldWrap>
                        <SelectReact
                            options={optionCalleBodega}
                            id='calle_bodega'
                            placeholder='Selecciona un opción'
                            name='calle_bodega'
                            className='py-1.5'
                            value={optionCalleBodega.find(calle => calle?.value === formik.values.calle_bodega)}
                            onChange={(value: any) => {
                              formik.setFieldValue('calle_bodega', value.value)
                            }}
                          />
                      </FieldWrap>
                    </Validation>
                  </div>
                )
                : (
                  <div className='flex flex-col w-full'>
                    <Label htmlFor='calle_bodega'>Calle Bodega: </Label>
                    <div className='dark:bg-zinc-700 bg-zinc-200 p-2 rounded-md'>
                      <span>{pallet_producto_terminado?.calle_bodega_label}</span>
                    </div>
                  </div>
                )
            }
            <div className='flex flex-col w-full'>
              <Label htmlFor='registrado_por'>Registrado Por: </Label>
              <div className='dark:bg-zinc-700 bg-zinc-200 p-2 rounded-md'>
                <span>{pallet_producto_terminado?.registrado_por_label}</span>
              </div>
            </div>
          </div>

          <div className='flex gap-5 justify-between'>
            <div className='flex flex-col w-full'>
              <Label htmlFor='fecha_creacion'>Fecha Creación: </Label>
              <div className='dark:bg-zinc-700 bg-zinc-200 p-2 rounded-md'>
                <span>{format(pallet_producto_terminado?.fecha_creacion!, { date: 'medium', time: 'short' }, 'es' )}</span>
              </div>
            </div>

            {
              editar
                ? (
                  <div className='w-full flex-col items-center'>
                    <Label htmlFor='observaciones'>Observaciones: </Label>
      
                    <Validation
                      isValid={formik.isValid}
                      isTouched={formik.touched.observaciones ? true : undefined}
                      invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                      >
                      <FieldWrap>
                        <Textarea
                            id='observaciones'
                            name='observaciones'
                            value={formik.values.observaciones}
                            className='h-20 py-2'
                            onChange={formik.handleChange}
                          />
                      </FieldWrap>
                    </Validation>
                  </div>
                )
                : (
                  <div className='flex flex-col w-full'>
                    <Label htmlFor='calle_bodega'>Calle Bodega: </Label>
                    <div className='dark:bg-zinc-700 bg-zinc-200 p-2 rounded-md h-20'>
                      <span>{pallet_producto_terminado?.observaciones}</span>
                    </div>
                  </div>
                )
            }
          </div>

        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <TablaCajasPalletProductoTerminado cajas_pallet={pallet_producto_terminado?.cajas_en_pallet} id_pallet={id_pallet}/>
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetallePalletProductoTerminado
