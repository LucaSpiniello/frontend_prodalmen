import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { TEnvaseEnGuia, TGuia, TLoteGuia } from '../../../types/TypesRecepcionMP.types';
import useDarkMode from '../../../hooks/useDarkMode';
import FormularioRegistroTara from '../Formularios/Formulario Registro Guia Recepcion MP/FormularioRegistroTara';
import { GoQuestion } from 'react-icons/go';
import { tipoFrutaFilter, variedadFilter } from '../../../utils/options.constantes';
import { useAuth } from '../../../context/authContext';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { fetchWithTokenPut } from '../../../utils/peticiones.utils';
import Button from '../../../components/ui/Button';
import { fetchGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IModalProps {
  id: number;
  id_lote?: number;
  estadoActivo: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  numero_estado: string;
  // refresh: Dispatch<SetStateAction<boolean | null>>
  lote: TLoteGuia | null
  guia: TGuia
}

const ModalRecepcion: FC<IModalProps> = ({ id, estadoActivo, setOpen, numero_estado, lote, guia }) => {
  const { isDarkTheme } = useDarkMode()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const [prevNumeroEstado, setPrevNumeroEstado] = useState<number>(0);
  const [confirmacion, setConfirmacion] = useState<boolean>(false)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()


  useEffect(() => {
    setPrevNumeroEstado(Number(numero_estado));
  }, [numero_estado]);

  const updateEstadoLote = async (id: number, id_lote: number, estado: string) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPut(`api/recepcionmp/${id}/lotes/${id_lote}/`, { estado_recepcion: estado } ,token_verificado)
    if (res.ok) {
      estadoActivo(estado);
      if (numero_estado >= '1') {
        //@ts-ignore
        dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken }))
        setOpen(false)
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
      {confirmacion && numero_estado === '5' ? (
        <FormularioRegistroTara isOpen={setOpen} guia={guia} lote={lote}/>
      ) : (
        <>  
          {!confirmacion && (
            <div className='py-10'>{
              numero_estado === '5' 
                ? (
                  <div className={`${isDarkTheme ? 'bg-gray-50' : 'bg-gray-700'}w-full h-full  flex flex-col justify-center items-center`}>
                    <GoQuestion className='text-9xl text-yellow-500' />
                    <h1 className='text-center'>¿Estas seguro de querer avanzar?</h1>
                    <ul className='mt-10 flex flex-col items-center gap-2'>
                      <li className={`font-semibold text-xl dark:text-white text-black`}>Kilos Brutos:  {(Number(lote?.kilos_brutos_1) + Number(lote?.kilos_brutos_2) ?? 0).toLocaleString()}</li>
                      <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Cantidad Envases:  {lote?.envases.length}</li>
                      {
                        lote?.envases.length! > 0 && // Verificar si hay al menos un envase
                        <>
                          <li className={`font-semibold text-xl dark:text-white text-black'}`}>
                            Producto: {tipo_producto_nombre}
                          </li>
                          <li className={`font-semibold text-xl dark:text-white text-black'}`}>
                            Variedad: {variedad_nombre}
                          </li>
                        </>
                      }
                      
                    </ul>
                  </div>
                  )
                : ''
            }</div>
          )}
  
          <div className='w-full flex items-center justify-between'>
            <Button
              variant='solid' 
              color='blue'
              colorIntensity='700'
              className='w-5/12 hover:scale-105 text-white'
              onClick={() => {
                if (!confirmacion) {
                  if (numero_estado === '1') {
                    updateEstadoLote(id, lote?.id! ,'2'); 
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
              className='w-5/12 hover:scale-105 text-white'
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

export default ModalRecepcion;
