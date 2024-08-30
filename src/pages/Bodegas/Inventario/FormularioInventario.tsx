import { useFormik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import SelectReact from '../../../components/form/SelectReact'
import { optionsBodegasB, optionsTipoInventario } from '../../../utils/options.constantes'
import Button from '../../../components/ui/Button'
import { CALLES_BODEGA_G1, CALLES_BODEGA_G2, CALLES_BODEGA_G3, CALLES_BODEGA_G4, CALLES_BODEGA_G5_G6_G7 } from '../../../utils/constante'

const FormularioInventario = ({}: { setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      tipo_inventario: '',
      bodegas: '',
      calles: '',
    },
    onSubmit: async (values: any) => {
      const token_verificado = await verificarToken(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const res = await fetchWithTokenPost(`api/inventarios/crear_inventario/`, 
      {
        ...values
      }, token_verificado)
      const data = await res.json()
      if (res.ok){
        toast.success('Inventario generado exitosamente')
        navigate(`/bdg/acciones/inventario-bodega/${data.id}/`) 
      } else {
        toast.error(`${data.error}`)
      }
    }
  })

  return (
    <Container>
      <Card>
        <CardBody>
          <section className='flex flex-col md:flex-row lg:flex-row gap-4'>
            
            <article className='w-full'>
              <Label htmlFor='tipo_inventario'>Tipo Inventario: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.tipo_inventario ? true : undefined}
                invalidFeedback={formik.errors.tipo_inventario ? String(formik.errors.tipo_inventario) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsTipoInventario}
                    id='tipo_inventario'
                    name='tipo_inventario'
                    placeholder='Selecciona un tipo de Inventario'
                    className='h-14'
                    value={optionsTipoInventario.find(inventario => inventario?.value === formik.values.tipo_inventario)}
                    onChange={(value: any) => {
                      formik.resetForm()
                      formik.setFieldValue('tipo_inventario', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </article>
            {
              formik.values.tipo_inventario === '1' ? 
                <article className='w-full'>
                  <Label htmlFor='bodegas'>Bodegas: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.bodegas ? true : undefined}
                    invalidFeedback={formik.errors.bodegas ? String(formik.errors.bodegas) : undefined}
                    >
                    <FieldWrap>
                      <SelectReact
                        options={optionsBodegasB}
                        id='bodegas'
                        name='bodegas'
                        placeholder='Selecciona una bodegas'
                        className='h-14'
                        value={optionsBodegasB.find(inventario => inventario?.value === formik.values.bodegas)}
                        onChange={(value: any) => {
                          formik.setFieldValue('bodegas', value.value)
                        }}
                      />
                    </FieldWrap>
                  </Validation>
                </article>
              : formik.values.tipo_inventario === '2' ? 
                <>
                  <article className='w-full'>
                    <Label htmlFor='bodegas'>Bodegas: </Label>
                    <Validation
                      isValid={formik.isValid}
                      isTouched={formik.touched.bodegas ? true : undefined}
                      invalidFeedback={formik.errors.bodegas ? String(formik.errors.bodegas) : undefined}
                      >
                      <FieldWrap>
                        <SelectReact
                          options={optionsBodegasB}
                          id='bodegas'
                          name='bodegas'
                          placeholder='Selecciona una bodegas'
                          className='h-14'
                          isClearable={false}
                          isMulti={true}
                          value={optionsBodegasB.find(inventario => inventario?.value === formik.values.bodegas)}
                          onChange={(value: any) => {
                            const unidos = value.map((value: any) => value.value).join(',')
                            formik.setFieldValue('bodegas', unidos)
                          }}
                        />
                      </FieldWrap>
                    </Validation>
                  </article>
                  <article className='w-full'>
                    <Label htmlFor='calles'>Calles: </Label>
                    <Validation

                      isValid={formik.isValid}
                      isTouched={formik.touched.calles ? true : undefined}
                      invalidFeedback={formik.errors.calles ? String(formik.errors.calles) : undefined}
                      >
                      <FieldWrap>
                        <SelectReact
                          options={
                            formik.values.bodegas === 'g1' ?
                              CALLES_BODEGA_G1
                            : formik.values.bodegas === 'g2' ?
                              CALLES_BODEGA_G2
                            : formik.values.bodegas === 'g3' ?
                              CALLES_BODEGA_G3
                            : formik.values.bodegas === 'g4' ?
                              CALLES_BODEGA_G4
                            : formik.values.bodegas === 'g5' || formik.values.bodegas === 'g6' || formik.values.bodegas === 'g7' ?
                              CALLES_BODEGA_G5_G6_G7
                            : formik.values.bodegas.includes(',') ?
                              CALLES_BODEGA_G4
                            : [{value: '', label: 'Seleccione una bodega  '}]
                          }
                          id='calles'
                          name='calles'
                          placeholder='Selecciona una calles'
                          className='h-14'
                          isMulti
                          isClearable={false}
                          value={CALLES_BODEGA_G4.find(inventario => inventario?.value === formik.values.calles)}
                          onChange={(value: any) => {
                            const unidos = value.map((value: any) => value.value).join(',')
                            formik.setFieldValue('calles', unidos)
                          }}
                        />
                      </FieldWrap>
                    </Validation>
                  </article>
                </>
              : formik.values.tipo_inventario === '3' ?
                null
              : formik.values.tipo_inventario === '4' ?
                <article className='w-full'>
                  <Label htmlFor='bodegas'>Bodegas: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.bodegas ? true : undefined}
                    invalidFeedback={formik.errors.bodegas ? String(formik.errors.bodegas) : undefined}
                    >
                    <FieldWrap>
                      <SelectReact
                        options={optionsBodegasB}
                        id='bodegas'
                        name='bodegas'
                        placeholder='Selecciona una bodegas'
                        className='h-14'
                        value={optionsBodegasB.find(inventario => inventario?.value === formik.values.bodegas)}
                        onChange={(value: any) => {
                          formik.setFieldValue('bodegas', value.value)
                          let lista: any[] = []
                          if (value.value === 'g1') {
                            lista = lista.concat(CALLES_BODEGA_G1)
                          }
                          if (value.value === 'g2') {
                            lista = lista.concat(CALLES_BODEGA_G2)
                          }
                          if (value.value === 'g3') {
                            lista = lista.concat(CALLES_BODEGA_G3)
                          }
                          if (value.value === 'g4') {
                            lista = lista.concat(CALLES_BODEGA_G4)
                          }
                          if (value.value === 'g5' || value.value == 'g6' || value.value == 'g7') {
                            lista = lista.concat(CALLES_BODEGA_G5_G6_G7)
                          }
                          if (value.value.includes(',')) {
                            lista = lista.concat(CALLES_BODEGA_G4)
                          }
                          const valores = lista.map(element => element.value).filter(value => !isNaN(value)).join(',');
                          formik.setFieldValue('calles', valores) 
                        }}
                      />
                    </FieldWrap>
                  </Validation>
                </article>
              : null
            }
          </section>

          <section className='w-full flex justify-end mt-5'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              onClick={() => formik.handleSubmit()}
              >
                Generar Inventario
            </Button>
          </section>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioInventario
