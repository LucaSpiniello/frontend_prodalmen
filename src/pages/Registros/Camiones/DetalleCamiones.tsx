
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { editarCamion, fetchCamion } from '../../../redux/slices/camionesSlice';
import { useAuth } from '../../../context/authContext';
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card';
import { useFormik } from 'formik';
import Validation from '../../../components/form/Validation';
import FieldWrap from '../../../components/form/FieldWrap';
import Input from '../../../components/form/Input';
import SelectReact from '../../../components/form/SelectReact';
import { optionsAcoplado } from '../../../utils/options.constantes';
import Textarea from '../../../components/form/Textarea';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils';


const DetalleCamion = ({ id, setOpen }: { id: number | undefined, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { isDarkTheme } = useDarkMode();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const camion = useAppSelector((state: RootState) => state.camiones.camion)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth() 
  const [editar, setEditar] = useState(false)

  
  useEffect(() => {
    dispatch(fetchCamion({ id, token, verificar_token: verificarToken }))
  }, [dispatch])


  useEffect(() => {
    formik.setValues({
      patente: camion?.patente!,
      acoplado: camion?.acoplado!,
      observaciones: camion?.observaciones!
    })
  }, [camion])


  const formik = useFormik({
    initialValues: {
      patente: "",
      acoplado: false,
      observaciones: ""
    },
    onSubmit: async (values) => {
     dispatch(editarCamion({ id, token, data: values, action: setOpen, verificar_token: verificarToken }))
    }
  })
  

  return (
    <Card>
      <CardHeader>
      <div className='w-full h-full py-3 flex justify-between'>
          {
            editar
              ? (
                <>
                  <Button
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => setEditar(false)}
                  >
                    Cancelar
                </Button>
                    

                  <Button
                  variant='solid'
                  color='emerald'
                  className='hover:scale-105'
                  onClick={() => formik.handleSubmit()}
                  >
                    Guardar
                </Button>                  
                </>
                
                )
              : (
                <Button
                  variant='solid'
                  color='blue'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => setEditar(true)}
                  >
                    Editar
                </Button>
              )
          }
        </div>
      </CardHeader>

      <CardBody>
        <div
        className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
          gap-y-5 dark:bg-zinc-900 bg-zinc-50 relative px-5 py-6
          rounded-md`}
        >
          

          <div className='md:col-span-2 md:flex-col items-center'>
            <label htmlFor="patente">Patente: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.patente ? true : undefined}
                    invalidFeedback={formik.errors.patente ? String(formik.errors.patente) : undefined}
                    >
                    <FieldWrap>
                    <Input
                      type='text'
                      name='patente'
                      onChange={formik.handleChange}
                      className='py-3'
                      value={formik.values.patente}
                    />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{camion ? camion.patente : ''}</span>
                  </div>
                  )
            }
          
          </div>

          <div className='md:col-span-2 md:flex-col md:cols-start-2 items-center'>
            <label htmlFor="rut_productor">Acoplado: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.acoplado ? true : undefined}
                    invalidFeedback={formik.errors.acoplado ? String(formik.errors.acoplado) : undefined}
                    >
                    <FieldWrap>
                      <SelectReact
                        options={optionsAcoplado}
                        id='acoplado'
                        placeholder='Selecciona un opción'
                        name='acoplado'
                        className='h-14 py-2'
                        value={optionsAcoplado.find(option => option?.value === String(formik.values.acoplado))}

                        onChange={(value: any) => {
                          formik.setFieldValue('acoplado', value.value)
                        }}
                      />
                    </FieldWrap>
                  </Validation>

                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{camion ? 'Con Acoplado' : 'Sin Acoplado'}</span>
                  </div>
                  )
            }
            
          </div>

          <div className='md:col-span-4 md:flex-col md:cols-start-2 items-center'>
            <label htmlFor="rut_productor">Observaciones: </label>
            {
              editar
                ? (
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.observaciones ? true : undefined}
                    invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                    >
                    <FieldWrap>
                      <Textarea
                        rows={5}
                        cols={9}
                        name='observaciones'
                        onChange={formik.handleChange}
                        value={formik.values.observaciones}
                      />
                    </FieldWrap>
                  </Validation>
                  )
                : (
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex h-32 rounded-md`}>
                    <span>{camion ? camion.observaciones : ''}</span>
                  </div>
                  )
            }
            
          </div>
        </div>
      </CardBody>
    </Card>
    

  )
}

export default DetalleCamion
