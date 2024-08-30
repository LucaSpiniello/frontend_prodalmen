import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { GoQuestion } from 'react-icons/go';
import { TEnvaseEnGuia, TLoteGuia } from '../../../types/TypesRecepcionMP.types';
import useDarkMode from '../../../hooks/useDarkMode';
import { tipoFrutaFilter, variedadFilter } from '../../../utils/options.constantes';
import Button from '../../../components/ui/Button';
import FormularioEdicionBodega from '../Formularios/RegistroUbicacionBodegaGuia';

interface IModalProps {
  id: number;
  id_lote?: number;
  estadoActivo?: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  numero_estado: string;
  refresh?: Dispatch<SetStateAction<boolean>>
  lote: TLoteGuia | null,
}

const ModalBodega: FC<IModalProps> = ({ setOpen, numero_estado, lote }) => {
  const [prevNumeroEstado, setPrevNumeroEstado] = useState<number>(0);
  const [confirmacion, setConfirmacion] = useState<boolean>(false);

  useEffect(() => {
    setPrevNumeroEstado(Number(numero_estado));
  }, [numero_estado]);


  const envase = lote?.envases[0]; // Seleccionar el primer envase
  const variedad_nombre = variedadFilter.find(producto => producto.value === envase?.variedad)?.label
  const tipo_producto_nombre = tipoFrutaFilter.find(producto => producto.value === envase?.tipo_producto)?.label 

  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {confirmacion ? (
        <FormularioEdicionBodega setOpen={setOpen} lote={lote}/>
      ) : (
        <>
          {!confirmacion && (
            <div className='py-10'>{
              numero_estado === '3' 
                ? (
                  <div className={`dark:bg-inherit bg-gray-50 w-full h-full  flex flex-col justify-center items-center`}>
                    <GoQuestion className='text-9xl text-yellow-500' />
                    <h1 className='text-center'>Estas seguro de querer avanzar?</h1>
                    <ul className='mt-10 flex flex-col items-center gap-2'>
                      <li className={`font-semibold text-xl dark:text-white text-black`}>Kilos Brutos:  {(Number(lote?.kilos_brutos_1) + Number(lote?.kilos_brutos_2) ?? 0).toLocaleString()}</li>

                      <li className={`font-semibold text-xl dark:text-white text-black `}>Cantidad Envases:  {lote?.envases.length}</li>
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
              className='w-5/12 hover:scale-105'
              onClick={() => {
                if (!confirmacion) {
                    setConfirmacion(true); 
                } else {
                  setConfirmacion(false);
                }}}
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

export default ModalBodega;
