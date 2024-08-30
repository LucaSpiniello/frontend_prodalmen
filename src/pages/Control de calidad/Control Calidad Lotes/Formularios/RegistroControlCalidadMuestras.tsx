import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import useDarkMode from '../../../../hooks/useDarkMode'
import { useAuth } from '../../../../context/authContext'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { useParams } from 'react-router-dom'
import { TControlCalidad, TRendimientoMuestra } from '../../../../types/TypesControlCalidad.type'
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { fetchMuestraControlDeCalidad, fetchMuestrasControlCalidad } from '../../../../redux/slices/controlcalidadSlice'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import Button from '../../../../components/ui/Button'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

interface IFormCC {
  id_lote: number
  CCLote?: TControlCalidad | null
  id_muestra?: number
  isCalibrable?: Dispatch<SetStateAction<boolean>>
  isOpen?: Dispatch<SetStateAction<boolean>>
}

const FormularioPepaMuestra : FC<IFormCC> = ({ id_lote, isCalibrable, id_muestra, isOpen }) => {
  const base_url = process.env.VITE_BASE_URL
  const { isDarkTheme } = useDarkMode ();
  const { id } = useParams()

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const muestra = useAppSelector((state: RootState) => state.control_calidad.cc_muestra_individual)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchMuestraControlDeCalidad({ id, token, params: { id_muestra: id_muestra }, verificar_token: verificarToken }))
  }, [])

  const formik = useFormik({
    initialValues: {
      pepa_sana: 0,
      pepa_muestra: 0,
      muestra_variedad: 0,
      daño_insecto: 0,
      hongo: 0,
      doble: 0,
      fuera_color: 0,
      vana_deshidratada: 0,
      punto_goma: 0,
      goma: 0,
      cc_pepaok: false,
      cc_calibrespepaok: false,
      observaciones: null,
      cc_rendimiento: 0

    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithTokenPost(`api/control-calidad/recepcionmp/${id_lote}/muestras/${id_muestra}/cdcpepa/`,
          {
            peso_muestra_calibre: values.pepa_sana,
            muestra_variedad: values.muestra_variedad,
            daño_insecto: values.daño_insecto,
            hongo: values.hongo,
            doble: values.doble,
            fuera_color: values.fuera_color,
            vana_deshidratada: values.vana_deshidratada,
            punto_goma: values.punto_goma,
            goma: values.goma,
            cc_pepaok: true,
            cc_rendimiento: id_muestra
          },
          token_verificado
        )
        if (res.ok) {
          toast.success("El control de calidad fue registrado exitosamente!!")
          //@ts-ignore
          dispatch(fetchMuestrasControlCalidad({ id: id_lote, token, verificar_token: verificarToken }))
          isCalibrable!(true)
          isOpen!(false)

        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar")
          
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    let isMounted = true

    if (isMounted && muestra){
      formik.setValues({
        pepa_muestra: muestra.pepa
      })
    }

    return () => {
      isMounted = false
    }
  }, [muestra])


  const calcularPepaSana = () => {
    const { muestra_variedad, daño_insecto, hongo, doble, fuera_color, vana_deshidratada, punto_goma, goma, pepa_muestra } = formik.values;
  
    const redondear = (valor: any) => Number(parseFloat(valor).toFixed(2));
  
    const muestraVariedadRedondeado = redondear(muestra_variedad ?? 0);
    const dañoInsectoRedondeado = redondear(daño_insecto ?? 0);
    const hongoRedondeado = redondear(hongo ?? 0);
    const dobleRedondeado = redondear(doble ?? 0);
    const fueraColorRedondeado = redondear(fuera_color ?? 0);
    const vanaDeshidratadaRedondeado = redondear(vana_deshidratada ?? 0);
    const puntoGomaRedondeado = redondear(punto_goma ?? 0);
    const gomaRedondeado = redondear(goma ?? 0);
    const pepaMuestraRedondeado = redondear(pepa_muestra ?? 0);
  
    const sumaOtrosCampos = muestraVariedadRedondeado + dañoInsectoRedondeado + hongoRedondeado + dobleRedondeado + fueraColorRedondeado + vanaDeshidratadaRedondeado + puntoGomaRedondeado + gomaRedondeado;
    const pepa_sana = pepaMuestraRedondeado - sumaOtrosCampos;
    const pepaSanaRedondeada = redondear(pepa_sana);
  
    return pepaSanaRedondeada >= 0 ? pepaSanaRedondeada : 0;
  };
  

  useEffect(() => {
    const updatedValues = { ...formik.values, pepa_sana: calcularPepaSana()};
    formik.setValues(updatedValues);
  }, [formik.values.muestra_variedad, formik.values.daño_insecto, formik.values.hongo, formik.values.doble, formik.values.fuera_color, formik.values.vana_deshidratada, formik.values.punto_goma, formik.values.goma]);
  
  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-8 lg:grid-cols-8 gap-x-3 w-full
        gap-y-5 mt-10 ${ isDarkTheme ? '' : 'bg-white'} p-2 
        rounded-md`}
      >
        <div className='md:col-start-2 md:col-span-3 md:flex-col items-center bg-green-600 p-5 rounded-md'>
          <Label className={`${isDarkTheme ? 'text-white' : 'text-zinc-100'}`} htmlFor='mezcla_variedad'>Pepa Bruta de la Muestra: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa_muestra ? true : undefined}
            invalidFeedback={formik.errors.pepa_muestra ? String(formik.errors.pepa_muestra) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='pepa_muestra'
              onChange={formik.handleChange}
              className={`py-2 `}
              value={formik.values.pepa_muestra}
            />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:col-start-5 md:col-span-3 md:flex-col items-center bg-green-600 p-5 rounded-md w-full'>
          <Label className={`${isDarkTheme ? 'text-white' : 'text-zinc-100'}`}  htmlFor='pepa_sana'>Pepa Sana Resultante: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa_sana ? true : undefined}
            invalidFeedback={formik.errors.pepa_sana ? String(formik.errors.pepa_sana) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='pepa_sana'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.pepa_sana}
            />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col flex-col lg:flex-row p-5 h-10 w-full'>
          <Label htmlFor='muestra_variedad'>Mezcla Variedad: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.muestra_variedad ? true : undefined}
            invalidFeedback={formik.errors.muestra_variedad ? String(formik.errors.muestra_variedad) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='muestra_variedad'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.muestra_variedad}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 p-5 md:flex-col flex-col lg:flex-row w-full '>
          <Label htmlFor='daño_insecto'>Daño Insecto: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.daño_insecto ? true : undefined}
            invalidFeedback={formik.errors.daño_insecto ? String(formik.errors.daño_insecto) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='daño_insecto'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.daño_insecto}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='hongo'>Hongo: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.hongo ? true : undefined}
            invalidFeedback={formik.errors.hongo ? String(formik.errors.hongo) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='hongo'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.hongo}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-7 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='dobles'>Dobles: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.doble ? true : undefined}
            invalidFeedback={formik.errors.doble ? String(formik.errors.doble) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='doble'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.doble}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='fuera_color'>Fuera Color: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.fuera_color ? true : undefined}
            invalidFeedback={formik.errors.fuera_color ? String(formik.errors.fuera_color) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='fuera_color'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.fuera_color}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-3 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='vana_deshidratada'>Vana Deshidratada: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.vana_deshidratada ? true : undefined}
            invalidFeedback={formik.errors.vana_deshidratada ? String(formik.errors.vana_deshidratada) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='vana_deshidratada'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.vana_deshidratada}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-5 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='punto_goma'>Punto Goma: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.punto_goma ? true : undefined}
            invalidFeedback={formik.errors.punto_goma ? String(formik.errors.punto_goma) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='punto_goma'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.punto_goma}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-7 md:col-span-2 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='goma'>Goma: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.goma ? true : undefined}
            invalidFeedback={formik.errors.goma ? String(formik.errors.goma) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='goma'
              onChange={formik.handleChange}
              className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.goma}
            />
            </FieldWrap>
          </Validation>
        </div>



        <div className='row-start-4 relative w-full h-20 col-span-2 col-start-7'>
         <Button 
          variant='solid'
          onClick={() => formik.handleSubmit()}
          className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Guardar CC Pepa Bruta
          </Button>
        </div>
      </form>
      
  )
}

export default FormularioPepaMuestra





