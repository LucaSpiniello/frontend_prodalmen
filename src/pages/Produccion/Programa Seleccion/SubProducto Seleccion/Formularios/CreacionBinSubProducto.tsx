import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useAuth } from '../../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../../utils/peticiones.utils'
import Label from '../../../../../components/form/Label'
import Validation from '../../../../../components/form/Validation'
import FieldWrap from '../../../../../components/form/FieldWrap'
import SelectReact from '../../../../../components/form/SelectReact'
import { Input } from 'antd'
import Button from '../../../../../components/ui/Button'
import { optionCalleBodega, optionTipoPatineta, optionsTipoSubProducto } from '../../../../../utils/options.constantes'
import Card, { CardBody } from '../../../../../components/ui/Card'
import Container from '../../../../../components/layouts/Container/Container'
import { TBinSubProducto } from '../../../../../types/TypesSeleccion.type'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const FormularioCreacionSubProducto = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
    
  const formik = useFormik({
    initialValues: {
      tipo_patineta: '',
      calle_bodega: '',
      tipo_subproducto: ''
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/binsubproductoseleccion/`, 
        {
          ...values,
          registrado_por: perfil?.id
        },
        token_verificado
      )

      if (res.ok){
        toast.success('Bin SubProducto creado correctamente!')
        setOpen(false)
      } else {
        console.log("mal hecho")
      }
    }
  });


 
  return (
    <Container>
      <Card>
        <CardBody>
          <div className={`flex flex-col lg:flex-row w-full gap-5`}>
            <div className='w-full md:flex-col flex flex-col'>
              <Label htmlFor='tipo_patineta'>Tipo Resultante: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_patineta ? true : undefined}
                invalidFeedback={formik.errors.tipo_patineta ? String(formik.errors.tipo_patineta) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionTipoPatineta}
                    id='tipo_patineta'
                    placeholder='Selecciona un opción'
                    name='tipo_patineta'
                    className='h-14 py-2'
                    onChange={(value: any) => {
                      formik.setFieldValue('tipo_patineta', value.value)
                    }}
                  />
                
                </FieldWrap>
              </Validation>
            </div>

            <div className='w-full md:flex-col flex flex-col'>
              <Label htmlFor='calle_bodega'>Calle Bodega: </Label>

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
                      className='h-14 py-2'
                      onChange={(value: any) => {
                        formik.setFieldValue('calle_bodega', value.value)
                      }}
                    />
                </FieldWrap>
              </Validation>

            </div>

            <div className='w-full md:flex-col flex flex-col'>
              <Label htmlFor='tipo_subproducto'>Tipo Sub Producto: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_subproducto ? true : undefined}
                invalidFeedback={formik.errors.tipo_subproducto ? String(formik.errors.tipo_subproducto) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                      options={optionsTipoSubProducto}
                      id='tipo_subproducto'
                      placeholder='Selecciona un opción'
                      name='tipo_subproducto'
                      className='h-14 py-2'
                      onChange={(value: any) => {
                        formik.setFieldValue('tipo_subproducto', value.value)
                      }}
                    />
                </FieldWrap>
              </Validation>
            </div>
          </div>
          <div className='w-full flex justify-end'>
            <Button
              variant='solid'
              onClick={() => formik.handleSubmit()}
              className='w-6/12 mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
                Crear Bin
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioCreacionSubProducto
