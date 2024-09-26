import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useLocation, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import Input from "../../../../components/form/Input"
import SelectReact from "../../../../components/form/SelectReact"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useFormik } from "formik"
import { optionsCalibres, optionsCantidadMuestra, optionsVariedad } from "../../../../utils/options.constantes"
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils"
import { fetchTarjasResultantes } from "../../../../redux/slices/produccionSlice"
import { fetchProgramaSeleccion, fetchTarjasSeleccionadas } from "../../../../redux/slices/seleccionSlice"
import { fetchCalibracionTarjaSeleccionada } from "../../../../redux/slices/controlcalidadSlice"
import { options } from "@fullcalendar/core/preact.js"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IFormCC {
  id_lote?: number
  isOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioControlCalidadTarjaSeleccionada : FC<IFormCC> = ({ id_lote, isOpen }) => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const actualizarEstadoTarja = async (id_lote: number) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenPatch(`api/seleccion/${id}/tarjaseleccionada/${id_lote}/`,
      {
        cc_tarja: true,
        seleccion: id
      },
      token_verificado
    )

    if (res.ok){
      dispatch(fetchTarjasSeleccionadas({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaSeleccion({  id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }

  const cc_tarja_seleccionada = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_tarja_seleccionada)

  useEffect(() => {
    dispatch(fetchCalibracionTarjaSeleccionada({ id: id_lote, token, verificar_token: verificarToken }))
  }, [])


  const formik = useFormik({
    initialValues: {
      variedad: "",
      calibre: "",
      cantidad_muestra: 0,
      trozo: 0,
      picada: 0,
      hongo: 0,
      daño_insecto: 0,
      dobles: 0,
      goma: 0,
      basura: 0,
      mezcla_variedad: 0,
      pepa_sana: 0,
      fuera_color: 0,
      punto_goma: 0,
      vana_deshidratada: 0,
      numero_pepa: 0
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithTokenPatch(`api/seleccion/cdc-tarjaseleccionada/${id_lote}/`, 
          {
            ...values,
            estado_cc: '3'
          },
          token_verificado
        )
        if (res.ok) {
          toast.success("El control de calidad de la tarja seleccionada fue registrado exitosamente!!")
          isOpen(false)
          actualizarEstadoTarja(id_lote!)
          if (pathname === 'tarjas-cc-seleccion'){
            dispatch(fetchTarjasSeleccionadas({ id: id_lote, token, verificar_token: verificarToken }))
          } else {
            dispatch(fetchTarjasSeleccionadas({ id: id_lote, token, verificar_token: verificarToken }))

          }
          

        } else {
          toast.error("No se pudo registrar el control de calidad de la tarja, volver a intentar")
           
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const calcularPepaSana = () => {
    const {
      cantidad_muestra,
      trozo,
      picada,
      hongo,
      daño_insecto,
      dobles,
      goma,
      basura,
      mezcla_variedad,
      fuera_color,
      punto_goma,
      vana_deshidratada,
    } = formik.values;

    return (
      cantidad_muestra - trozo - picada - hongo - daño_insecto - dobles - goma - basura - mezcla_variedad - fuera_color - punto_goma - vana_deshidratada
    );
  };

  // Actualiza el valor de pepa_sana cuando cambia algún campo relevante
  useEffect(() => {
    formik.setFieldValue('pepa_sana', calcularPepaSana());
  }, [
    formik.values.cantidad_muestra,
    formik.values.trozo,
    formik.values.picada,
    formik.values.hongo,
    formik.values.daño_insecto,
    formik.values.dobles,
    formik.values.goma,
    formik.values.basura,
    formik.values.mezcla_variedad,
    formik.values.fuera_color,
    formik.values.punto_goma,
    formik.values.vana_deshidratada,
    formik.values.canuto,
    formik.values.numero_pepa
  ]);

  useEffect(() => {
    if (cc_tarja_seleccionada){
      formik.setValues({ 
        ...cc_tarja_seleccionada
      })
    }
  }, [cc_tarja_seleccionada])


  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`w-full md:w-full lg:w-full flex-col md:grid lg:grid lg:grid-cols-12 gap-x-3
        gap-y-5 dark:bg-zinc-950 bg-white p-2 
        rounded-md`}
      >
        <div className='md:col-span-4 md:flex-col w-full items-centerp-5 rounded-md mb-10'>
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
                value={optionsVariedad.find(variedad => variedad?.value === formik.values.variedad)}
                onChange={(value: any) => {
                  formik.setFieldValue('variedad', value.value)
                }}
              />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:col-start-5 md:col-span-4 rounded-md w-full'>
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

        <div className='md:col-start-9 md:col-span-4 rounded-md w-full'>
          <Label className='dark:text-white text-zinc-900'  htmlFor='cantidad_muestra'>Cantidad Muestra: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.cantidad_muestra ? true : undefined}
            invalidFeedback={formik.errors.cantidad_muestra ? String(formik.errors.cantidad_muestra) : undefined}>
            <FieldWrap>
              <SelectReact
                  options={optionsCantidadMuestra}
                  id='cantidad_muestra'
                  name='cantidad_muestra'
                  placeholder='Selecciona una cantidad muestra'
                  className='h-14'
                  onChange={(value: any) => {
                    formik.setFieldValue('cantidad_muestra', value.value)
                  }}
                />
            </FieldWrap>
          </Validation>
          
        </div>

        <div className='md:row-start-2  md:col-span-4'>
          <Label htmlFor='trozo'>Trozo: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.trozo ? true : undefined}
            invalidFeedback={formik.errors.trozo ? String(formik.errors.trozo) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='trozo'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.trozo}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-start-5 md:col-span-4'>
          <Label htmlFor='picada'>Picada: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.picada ? true : undefined}
            invalidFeedback={formik.errors.picada ? String(formik.errors.picada) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='picada'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.picada}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-start-9 md:col-span-4'>
          <Label htmlFor='hongo'>Hongo: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.hongo ? true : undefined}
            invalidFeedback={formik.errors.hongo ? String(formik.errors.hongo) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='hongo'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.hongo}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-4'>
          <Label htmlFor='daño_insecto'>Daño por Insecto: </Label>

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

        <div className='md:row-start-3 md:col-start-5 md:col-span-4'>
          <Label htmlFor='dobles'>Dobles: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.dobles ? true : undefined}
            invalidFeedback={formik.errors.dobles ? String(formik.errors.dobles) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='dobles'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.dobles}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-start-9 md:col-span-4'>
          <Label htmlFor='goma'>Goma: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.goma ? true : undefined}
            invalidFeedback={formik.errors.goma ? String(formik.errors.goma) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='goma'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.goma}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-span-4'>
          <Label htmlFor='basura'>Basura: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.basura ? true : undefined}
            invalidFeedback={formik.errors.basura ? String(formik.errors.basura) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='basura'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.basura}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-start-5 md:col-span-4'>
          <Label htmlFor='mezcla_variedad'>Mezcla de Variedad: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.mezcla_variedad ? true : undefined}
            invalidFeedback={formik.errors.mezcla_variedad ? String(formik.errors.mezcla_variedad) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='mezcla_variedad'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.mezcla_variedad}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-4 md:col-start-9 md:col-span-4'>
          <Label htmlFor='fuera_color'>Fuera de Color: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.fuera_color ? true : undefined}
            invalidFeedback={formik.errors.fuera_color ? String(formik.errors.fuera_color) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='fuera_color'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.fuera_color}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-5  md:col-span-4'>
          <Label htmlFor='punto_goma'>Punto de Goma: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.punto_goma ? true : undefined}
            invalidFeedback={formik.errors.punto_goma ? String(formik.errors.punto_goma) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='punto_goma'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.punto_goma}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-5 md:col-start-5 md:col-span-4'>
          <Label htmlFor='vana_deshidratada'>Vana Deshidratada: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.vana_deshidratada ? true : undefined}
            invalidFeedback={formik.errors.vana_deshidratada ? String(formik.errors.vana_deshidratada) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='vana_deshidratada'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.vana_deshidratada}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-6 md:col-span-4'>
          <Label htmlFor='numero_pepa'>Numero Pepa: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.numero_pepa ? true : undefined}
            invalidFeedback={formik.errors.numero_pepa ? String(formik.errors.numero_pepa) : undefined}>
            <FieldWrap>
              <Input
                type='number'
                name='numero_pepa'
                onChange={formik.handleChange}
                className='py-2 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
                value={formik.values.numero_pepa}
              />
            </FieldWrap>
          </Validation>
        </div>


        <div className='md:row-start-5 md:col-start-9 md:col-span-4'>
          <Label htmlFor='pepa_sana'>Pepa Sana: </Label>
          <div className="flex flex-col bg-green-700 py-2.5 rounded-lg px-2 text-white">
            <span>
              {formik.values.pepa_sana}
            </span>
          </div>
        </div>

        <div className='row-start-6 col-start-9 relative w-full h-20 col-span-4'>
         <button type='submit' className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Guardar
          </button>
        </div>
      </form>
      
  )
}

export default FormularioControlCalidadTarjaSeleccionada





