import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Textarea from '../../../components/form/Textarea'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import Radio, { RadioGroup } from '../../../components/form/Radio'
import Button from '../../../components/ui/Button'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'
import { TControlCalidad } from '../../../types/TypesControlCalidad.type'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { optionsRadio } from '../../../utils/options.constantes'
import { fetchWithTokenPostWithFormData, fetchWithTokenPut } from '../../../utils/peticiones.utils'
import { fetchGuiaRecepcion, fetchLotesPendientesGuiaRecepcion } from '../../../redux/slices/recepcionmp'
import { useParams } from 'react-router-dom'
import Card, { CardBody } from '../../../components/ui/Card'
import { fetchControlCalidad } from '../../../redux/slices/controlcalidadSlice'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormCC {
  setOpen: Dispatch<SetStateAction<boolean>>
  id_lote?: number,
  updateEstado: (id: number, id_lote: number, estado: string) => void
}

const FormularioRegistroControlCalidad : FC<IFormCC> = ({ setOpen, id_lote }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const { isDarkTheme } = useDarkMode ();
  const [fotos, setFotos] = useState<File[]>([]);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)

  useEffect(() => {
    if(id){
      dispatch(fetchControlCalidad({ id: id_lote!, token, verificar_token: verificarToken }))
    }
  }, [id])

  const subirFotosAlBackend = async (imagenes:any, recepcionmp: number) => {
    const formData = new FormData();

    formData.append(`ccrecepcionmp`, String(recepcionmp));
    imagenes.forEach((imagen:any) => {
      formData.append(`imagen`, imagen);
    });

    try {
      const token_verificado = await verificarToken(token!)
      
      if (!token_verificado) throw new Error('Token no verificado')
  
      const res = await fetchWithTokenPostWithFormData(`api/control-calidad/recepcionmp/${recepcionmp}/subir_fotos_cc/`, formData, token_verificado)
      if (res.ok) {
        console.log('Fotos subidas exitosamente');
      } else {
        console.error('Error al subir fotos:', res.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  useEffect(() => {
    if (control_calidad){
      formik.setValues({
        humedad: parseFloat(control_calidad?.humedad),
        presencia_insectos: control_calidad?.presencia_insectos,
        observaciones: control_calidad.observaciones
      })
    }
    () => {} 
  }, [control_calidad])

  const formik = useFormik({
    initialValues: {
      humedad: 0,
      presencia_insectos: false,
      observaciones: "",
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithTokenPut(`api/control-calidad/recepcionmp/${control_calidad?.id}/`,
        {
          ...values,  
          recepcionmp: id_lote,
          cc_registrado_por: perfil?.id
        }, token_verificado)

        if (res.ok) { 
          toast.success("El control de calidad fue registrado exitosamente!!")
          const respuesta = await res.json()
          setOpen(false)
          subirFotosAlBackend(fotos, respuesta?.id)
          //@ts-ignore
          dispatch(fetchLotesPendientesGuiaRecepcion({ id, token, verificar_token: verificarToken }))
          //@ts-ignore
          dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken }))

        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar") 
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Concatenamos las nuevas fotos con las existentes
      setFotos(prevFotos => [...prevFotos, ...Array.from(files)]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFotos((prevFotos) => prevFotos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Card>
      <CardBody>
        <form
          onSubmit={formik.handleSubmit}
          className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
          gap-y-5 mt-10  relative px-5 py-6
          rounded-md`}
        >
          <div className='md:col-span-2 md:flex-col items-center'>
            <label htmlFor="humedad">Humedad: </label>
            <Input
              type='number'
              name='humedad'
              onChange={formik.handleChange}
              className='py-2'
              value={formik.values.humedad}
            />
          </div>

          <div className='md:col-span-2 md:col-start-3 md:flex-col flex-col lg:flex-row '>
            <label htmlFor="acoplado">Presencia Insectos: </label>
            <div className={`w-full ${isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'} flex items-center justify-center py-[2.3px] rounded-lg`}>
              <RadioGroup isInline>
                {optionsRadio.map(({ id, value, label }) => {
                  return (
                    <Radio
                      key={id}
                      label={label}
                      name='presencia_insectos'
                      value={label} // Asignar el valor correcto de cada botón de radio
                      checked={formik.values.presencia_insectos === value} // Comprobar si este botón de radio está seleccionado
                      onChange={(e) => {
                        formik.setFieldValue('presencia_insectos', e.target.value === 'Si' ? true : false) // Actualizar el valor de mezcla_variedades en el estado de formik
                      } } 
                      selectedValue={undefined} />
                  );
                })}
              </RadioGroup>
            </div>
          </div>

          <div className='md:row-start-2 md:col-span-4  md:flex-col items-center'>
            <label htmlFor="observaciones">Observaciones: </label>
            <Textarea
              rows={5}
              cols={9}
              name='observaciones'
              onChange={formik.handleChange}
              value={formik.values.observaciones}
            />
          </div>

          <div className={`md:col-span-4 flex flex-col dark:bg-zinc-800 bg-zinc-100 rounded-md p-5`}>
          <label htmlFor="fotos">Fotos: </label>
            <div className='flex flex-wrap w-full gap-5 mb-5'>
              {fotos.map((foto, index) => (
                <div key={index} className="mb-4 h-20 w-24 relative">
                  <Button
                    variant="solid"
                    color="red"
                    className="rounded-full text-xl h-10 !w-4 absolute -right-5 -top-5"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </Button>
                  <img src={URL.createObjectURL(foto)} alt={`Foto ${index + 1}`} className="w-24 h-24 mr-2 mb-2 object-contain" />
                </div>
              ))}
            </div>
            <input
              type='file'
              id='fotos'
              name='fotos'
              accept='image/*'
              multiple
              onChange={handleFotoChange}
              className='py-2 '
            />
          </div>

          <div className='relative w-full h-20 col-span-4'>
          <Button
              variant='solid'
              //@ts-ignore
              onClick={formik.handleSubmit}
              className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
              Registrar Control Calidad
            </Button>
          </div>
        </form>
      </CardBody>
    </Card> 
      
  )
}

export default FormularioRegistroControlCalidad





