import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { useFormik } from 'formik'
import { useAuth } from '../../../../context/authContext'
import Button from '../../../../components/ui/Button'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { actualizarPersonalizacion, actualizarUsuario } from '../../../../redux/slices/authSlice'
import { useState } from 'react'
import { fetchWithTokenPatch, fetchWithTokenPut } from '../../../../utils/peticiones.utils'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const options: TSelectOptions = [
	{ value: '2024', label: '2024'},
	{ value: '2023', label: '2023'},
	{ value: '2022', label: '2022'},
	{ value: '2021', label: '2021'},
  { value: 'Todo', label: 'Todo'}
];

const SelectYear = () => {
    const personalizacionData = useAppSelector((state: RootState) => state.auth.personalizacion)
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const { verificarToken } = useAuth()
    const navigate = useNavigate()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            anio: personalizacionData?.anio ? personalizacionData.anio : ''
        },
        onSubmit: async (values) => {
            // @ts-ignore
            // try {
            //   const token_verificado = await verificarToken(token!)
            
            //   if (!token_verificado){
            //     throw new Error('Token no verificado')
            //   }

            //   const res = await fetchWithTokenPatch(`api/registros/personalizacion-perfil/${pe}/`, data, token_validado)


            // } catch (error) {
                
            // }


            dispatch(actualizarPersonalizacion({ id: perfil?.id ,data: { ...values, usuario: perfil?.id  }, token, verificar_token: verificarToken ,mensaje: 'Perfil actualizado', }))
            navigate('/home/dashboard')
            toast.success(`Cambio de año exitoso`)
        }
    })

    return (
        <div className='hidden w-56 lg:w-full lg:flex gap-2'>
            <div className="w-72">
                <SelectReact
                options={options} 
                id='anio'
                placeholder='Selecciona un año'
                name='año'
                value={{value: formik.values.anio, label: formik.values.anio}}
                onChange={(value: any) => {
                    formik.setFieldValue('anio', value.value)
                }}
                variant='solid'
                />
            </div>
            {
              personalizacionData?.anio !== formik.values.anio
                ? (
                    <div className="w-34">
                      <Button variant='solid' onClick={() => {formik.submitForm()}}>Guardar</Button>
                    </div>
                  )
                : null
            }
        </div>
    )
}

export default SelectYear
