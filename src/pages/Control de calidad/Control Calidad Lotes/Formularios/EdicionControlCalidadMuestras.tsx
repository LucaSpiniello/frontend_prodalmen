import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Textarea from '../../../../components/form/Textarea'
import useDarkMode from '../../../../hooks/useDarkMode'
import { useAuth } from '../../../../context/authContext'
import Radio, { RadioGroup } from '../../../../components/form/Radio'
import { useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { optionsRadio } from '../../../../utils/options.constantes'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

interface IFormCC {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  id_lote: number
}

const FormularioEdicionControlCalidad : FC<IFormCC> = ({ refresh, setOpen, id_lote }) => {
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  

  const base_url = process.env.VITE_BASE_URL
  const { isDarkTheme } = useDarkMode ();
  const [fotos, setFotos] = useState<File[]>([]);


  
  const control_calidad: any = []


  const cc_unico = [...(control_calidad || [])]

  const subirFotosAlBackend = async (imagenes:any, recepcionmp: number) => {
    try {
      const formData = new FormData();
  
      imagenes.forEach((imagen:any) => {
        formData.append(`imagen`, imagen);
        formData.append(`ccrecepcionmp`, String(recepcionmp));
      });
  
      const res = await fetch(`${base_url}/api/fotos-cc/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        console.log('Fotos subidas exitosamente');
      } else {
        console.error('Error al subir fotos:', res.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  
  


  useEffect(() => {
    let isMounted = true

    if (isMounted && control_calidad){
      formik.setValues({
        humedad: parseFloat(control_calidad[0]?.humedad),
        presencia_insectos: control_calidad[0].presencia_insectos,
        observaciones: control_calidad[0].observaciones
      })      
    }

    () => {
      isMounted = false
    } 
  }, [control_calidad])
 

  const formik = useFormik({
    initialValues: {
      humedad: 0,
      presencia_insectos: false,
      observaciones: "",
    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/${cc_unico[0].id}/`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json'  ,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            recepcionmp: id_lote,
            cc_registrado_por: perfil?.id
          })
        })
        if (res.ok) {
          toast.success("El control de calidad fue registrado exitosamente!!")
          const respuesta = await res.json()
          setOpen(false)
          refresh(true)
          subirFotosAlBackend(fotos, respuesta?.id)

        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar")
          
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const fotitos = fotos.map((fotos) => {
    return fotos
  })


  

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Concatenamos las nuevas fotos con las existentes
      setFotos(prevFotos => [...prevFotos, ...Array.from(files)]);
    }
  };


  return (
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

        <div className={`md:col-span-4 flex flex-col ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-md p-5`}>
        <label htmlFor="fotos">Fotos: </label>
          <div className='flex flex-wrap w-full gap-2 mb-5'>
            {fotos.map((foto, index) => (
              <div key={index} className="mb-4 border border-zinc-400 h-20 w-24">
                <img src={URL.createObjectURL(foto)} alt={`Foto ${index + 1}`} className="w-24 h-24 mr-2 mb-2 object-cover" />
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
         <button className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Control Calidad
          </button>
        </div>
      </form>
      
  )
}

export default FormularioEdicionControlCalidad





