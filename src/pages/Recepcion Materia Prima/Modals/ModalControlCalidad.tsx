import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { GoQuestion } from 'react-icons/go';
import { TEnvaseEnGuia, TLoteGuia } from '../../../types/TypesRecepcionMP.types';
import useDarkMode from '../../../hooks/useDarkMode';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { tipoFrutaFilter, variedadFilter } from '../../../utils/options.constantes';
import FormularioRegistroControlCalidad from '../Formularios/RegistroControlCalidadGuia';
import { useAuth } from '../../../context/authContext';
import { fetchWithTokenPatch, fetchWithTokenPut } from '../../../utils/peticiones.utils';
import { fetchGuiaRecepcion, fetchLotesPendientesGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import Button from '../../../components/ui/Button';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

interface IModalProps {
  id: number;
  id_lote: number;
  estadoActivo: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  numero_estado: string;
  lote?: TLoteGuia | null,
  usuario: any
  guia_id: number | null
}

const ModalControlCalidad: FC<IModalProps> = ({ id: id_lote, estadoActivo, setOpen, numero_estado, lote, guia_id }) => {
  const { verificarToken } = useAuth()
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)


  const [prevNumeroEstado, setPrevNumeroEstado] = useState<number>(0);
  const [confirmacion, setConfirmacion] = useState<boolean>(false);

  useEffect(() => {
    setPrevNumeroEstado(Number(numero_estado));
  }, [numero_estado]);

  const estado_guia_update = async (id: any, estado: string) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/`, 
    { estado_recepcion: estado },
    token_verificado)
    if (res.ok){
      dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken}))
    } else {
      console.log("TOdo mal")
    }
  }

  const updateEstadoLote = async (id: number, id_lote: number, estado: string) => {
    const token_verificado = await verificarToken(token!)
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/lotes/${id_lote}/`, { estado_recepcion: estado}, token_verificado)

    if (res.ok) {
      estadoActivo(estado);
      if (numero_estado >= '1') {
        setOpen(false)
        dispatch(fetchLotesPendientesGuiaRecepcion({ id, token, verificar_token: verificarToken}))
      } 
    } else {
      console.log("Errores sobre errores");
    }
  }


  const envase = lote?.envases[0]; // Seleccionar el primer envase
  const variedad_nombre = variedadFilter.find(producto => producto.value === envase?.variedad)?.label
  const tipo_producto_nombre = tipoFrutaFilter.find(producto => producto.value === envase?.tipo_producto)?.label 

  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {confirmacion && numero_estado === '2' ? (
        <FormularioRegistroControlCalidad id_lote={id_lote} setOpen={setOpen} updateEstado={updateEstadoLote} />
      ) : (
        <>
          {!confirmacion && (
            <div className='py-10'>{
              numero_estado === '1' 
                ? (
                  <div className={`dark:bg-inherit bg-gray-50 w-full h-full  flex flex-col justify-center items-center`}>
                    <GoQuestion className='text-9xl text-yellow-500' />
                    <h1 className='text-center font-sans text-4xl'>¿Estas seguro de querer avanzar?</h1>
                    <ul className='mt-10 flex flex-col items-center gap-2'>
                      <li className={`font-semibold text-xl dark:text-white text-black`}>Kilos Brutos:  {(Number(lote?.kilos_brutos_1) + Number(lote?.kilos_brutos_2)).toLocaleString()}</li>
                      <li className={`font-semibold text-xl dark:text-white text-black`}>Cantidad Envases:  {lote?.envases.length}</li>
                      {
                        lote?.envases.length! > 0 && // Verificar si hay al menos un envase
                        <>
                          <li className={`font-semibold text-xl dark:text-white text-black`}>
                            Producto: {tipo_producto_nombre}
                          </li>
                          <li className={`font-semibold text-xl dark:text-white text-black`}>
                            Variedad: {variedad_nombre}
                          </li>
                        </>
                      }
                      
                    </ul>
                  </div>
                  )
                : (
                    <div className={`dark:bg-inherit w-full h-full  flex flex-col justify-center items-center`}>
                      <GoQuestion className='text-9xl text-yellow-500' />
                      <h1 className='text-center'>¿Estas seguro de querer registrar la humedad?</h1>

                    </div>
                  )
            }</div>
          )}
  
          <div className='w-full flex items-center justify-between'>
            <Button
              variant='solid'
              color='blue'
              colorIntensity='700'
              className='w-5/12 hover:scale-105'
              onClick={() => {
                if (!confirmacion) {
                  if (numero_estado === '1') {
                    updateEstadoLote(guia_id!, lote?.id!, '2'); 
                    estado_guia_update(guia_id, '2')
                  } else {
                    setConfirmacion(true); 
                  }
                } else {
                  setConfirmacion(false);
                }
              }}
            > 
              {confirmacion ? 'Sí' : 'Confirmar'}
            </Button>
            <Button
              variant='solid'
              color='red'
              colorIntensity='700'
              className='w-5/12 hover:scale-105'
              onClick={() => {
                if (confirmacion) {
                  setConfirmacion(false);
                  setOpen(false)
                } else {
                  setOpen(false);
                }
              }}
            > 
              {confirmacion ? 'No' : 'Cancelar'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
  
  
  
}

export default ModalControlCalidad;
