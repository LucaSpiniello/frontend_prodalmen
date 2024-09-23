import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import { GUARDAR_TARJA_NUEVA } from '../../../../redux/slices/produccionSlice'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import FieldWrap from '../../../../components/form/FieldWrap'
import Input from '../../../../components/form/Input'
import { optionCalleBodega, optionTipoPatineta, optionsTipoResultanteSeleccion, optionsTipoSubProducto } from '../../../../utils/options.constantes'
import Button from '../../../../components/ui/Button'
import { fetchOperariosEnSeleccion, fetchProgramaSeleccion, fetchSubProductoLista, fetchSubProductosOperarios, fetchTarjasSeleccionadas, fetchUltimosProgramasSeleccion } from '../../../../redux/slices/seleccionSlice'
import { fetchOperariosWithSearch } from '../../../../redux/slices/operarioSlice'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../../components/ui/Card'
import TablaBinSubProducto from '../SubProducto Seleccion/Tablas/TablaBinSubProducto'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { TBinSubProducto } from '../../../../types/TypesSeleccion.type'
import * as Yup from 'yup';

interface IFormularioRegistroSubProductoProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const validationSchema = Yup.object().shape({
	peso: Yup.number()
	  .min(0, 'El número debe ser mayor o igual a 0')
	  .required('Este campo es requerido'),
  });


const FormularioRegistroSubProducto: FC<IFormularioRegistroSubProductoProps> = ({ setOpen }) => {
  const { id } = useParams()
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)
  const { pathname } = useLocation()

  const [openSubModal, setOpenSubModal] = useState(false)


  // const operarios_seleccion = useAppSelector((state: RootState) => state.seleccion.operarios_seleccion)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const [filtroTablaBin, setFiltroTablaBin] = useState<string | undefined>('')
  const [binSeleccionado, setBinSeleccionado] = useState<TBinSubProducto | null>(null)
  const [restantePermitido, setRestantePermitido] = useState(0)




  // useEffect(() => {
  //   if (pathname !== '/subproducto-seleccion'){
  //     dispatch(fetchOperariosEnSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
  //   }
  // }, [pathname])

  useEffect(() => {
    dispatch(fetchOperariosWithSearch({ params: { search: 'seleccion' }, token, verificar_token: verificarToken }))
  }, [])


  useEffect(() => {
    formik.setFieldValue('tipo_subproducto', binSeleccionado?.tipo_subproducto)
  }, [binSeleccionado])

  const optionOperariosSeleccion: TSelectOptions = operarios?.map((operario) => ({
    value: String(operario.rut),
    label: `${operario.nombre} ${operario.apellido}`
  })) ?? []

  
    
  const formik = useFormik({
    initialValues: {
      operario: '',
      peso: 0,
      tipo_subproducto: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!);
        if (!token_verificado) throw new Error('Token no verificado');
  
        const res = await fetchWithTokenPost(`api/seleccion/${id}/subproductooperario/`, 
          {
            ...values,
            seleccion: id,
            registrado_por: perfil?.id
          },
          token_verificado
        );
  
        if (res.ok) {
          const data = await res.json();
          
          const res_v = await fetchWithTokenPost(`api/binsubproductoseleccion/${binSeleccionado?.id}/agrupar_subproductos/`, 
            {
              subproductos: [data]
            },
            token_verificado
          );
  
          if (res_v.ok) {
              dispatch(fetchSubProductosOperarios({ id: parseInt(id!), token, verificar_token: verificarToken }));
              dispatch(fetchProgramaSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }));
              setOpen(false);
              toast.success('SubProducto Registrado');
              asignar_dias_kilos();
          } else if (res_v.status === 400) {
            const restante = await res_v.json()
            toast.error(`Supera por ${restante['restante']} kilos el máximo para este Bin`)
          }

        } else {
          console.log("Mal hecho");
        }
      } catch (error) {
        console.error('Error en la ejecución del formulario:', error);
      }
    }
  });

  const asignar_dias_kilos = async () => {
    try {
      const token_verificado = await verificarToken(token!)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenPost(`api/seleccion/${id}/asignar_dias_kilos/`, {}, token_verificado)
      if (response.ok) {
        toast.success('Dias Asignados')
      } else {
        toast.error('Error' + `${await response.json()}`)
      }
    } catch {
      console.log('Error dias asignados')
    }
  }




  return (
    <Container className='w-full h-full'>
      <Card className='w-full'>
        <CardBody className='flex flex-col w-full gap-y-5'>
          <div className='flex w-full justify-between gap-5'>

            <div className='flex-col items-center w-full'>
              <Label htmlFor='operario'>Operario: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.operario ? true : undefined}
                invalidFeedback={formik.errors.operario ? String(formik.errors.operario) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                      options={optionOperariosSeleccion}
                      id='operario'
                      placeholder='Selecciona un opción'
                      name='operario'
                      className='h-[45px]'
                      onChange={(value: any) => {
                        const operario_identificado = operarios.find((op: any) => op.rut === value.value)
                        formik.setFieldValue('operario', Number(operario_identificado?.id))
                      }}
                    />
                </FieldWrap>
              </Validation>
            </div>

            <div className='md:flex-col flex flex-col w-6/12'>
              <Label htmlFor='peso'>Peso: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.peso ? true : undefined}
                invalidFeedback={formik.errors.peso ? String(formik.errors.peso) : undefined}
                >
                <FieldWrap>
                  <Input
                    type='number'
                    name='peso'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        formik.setFieldValue('peso', value);
                      } else if (e.target.value === '') {
                        formik.setFieldValue('peso', '');
                      }
                    }}
                    className='py-[13px] mt-0.5 text-black'
                    value={formik.values.peso}
                  />
                </FieldWrap>
              </Validation>

            </div>

            <div className='md:flex-col items-center w-full'>
              <Label htmlFor='tipo_subproducto'>Tipo SubProducto: </Label>

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
                      className='h-[45px]'
                      onChange={(value: any) => {
                        // formik.setFieldValue('tipo_subproducto', value.value)
                        setFiltroTablaBin(value.label)
                      }}
                    />
                </FieldWrap>
              </Validation>
            </div>
          </div>


          <div className='z-0 w-full !p-0'>
            <TablaBinSubProducto filtro={filtroTablaBin} binSeleccionado={binSeleccionado!} setBin={setBinSeleccionado} openModal={openSubModal} setOpenModal={setOpenSubModal} />
          </div>



          <div className='relative w-full h-20 col-span-4'>
            {
              binSeleccionado && formik.values.peso > 0 && formik.values.operario != '' && (
                <Button
                  variant='solid'
                  onClick={() => formik.handleSubmit()}
                  className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
                    Registrar Sub Producto
                </Button>
              )
            }
          </div>
        </CardBody>
      </Card>

    </Container>
  )
}

export default FormularioRegistroSubProducto
