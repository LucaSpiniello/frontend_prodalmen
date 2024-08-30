import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from "react";
import { GoQuestion } from "react-icons/go";
import Button from "./ui/Button";


interface IModalProps {
  id?: number | null
  confirmacion: boolean
  setConfirmacion: Dispatch<SetStateAction<boolean>>
  estadoActivo?: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>
  aviso?: boolean
  mensaje?: string
  formulario?: ReactNode
  functionAction?: (id: number, estado: string, setPosted: Dispatch<SetStateAction<boolean>>) => Promise<void>
  comprobar?: boolean
}

const ModalConfirmacion: FC<IModalProps> = ({ aviso, comprobar, id, setOpen, confirmacion, setConfirmacion, mensaje, formulario, functionAction }) => {
  const [idNuevo, setID] = useState<number | null>(null)
  useEffect(() => {
    if(id){
      setID(id)
    }
  }, [id])

  useEffect(() => {
    if (idNuevo && confirmacion && typeof functionAction === 'function'){
      functionAction!(idNuevo, '1', setOpen)
    }

    return () => {
      if (comprobar){
        setTimeout(() => {
          setConfirmacion(false)
        }, 2000)
      }
      }
      
  }, [idNuevo, confirmacion])


  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {confirmacion ? (
        <div className="w-full py-10">
          {formulario}
        </div>
      ) : (
        <>
          {!confirmacion && (
            <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
              <GoQuestion className='text-9xl text-yellow-500' />
              
              {
                aviso
                  ? <p className="font bold text-center text-4xl">{mensaje}</p>
                  : <h1 className="text-2xl mt-5 text-center">{mensaje}</h1>
              }
            </div>
          )}
  
          <div className='w-full flex items-center justify-between'>
            {
              aviso
                ? (
                  <Button
                    variant="solid"
                    color="blue"
                    className="w-full"
                    colorIntensity="700"
                    onClick={() => {
                      setConfirmacion(true)
                      setOpen(false)
                    }}
                  >
                    Aceptar
                  </Button>
                )
                : (
                  <>
                    <button 
                      className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                      onClick={() => {
                        if (!confirmacion) {
                            setConfirmacion(true); 
                        } else {
                          setConfirmacion(false);
                        }}}
                    > 
                      {confirmacion ? 'Sí' : 'Sí'}
                    </button>
                    <button 
                      className='w-48 py-3 px-6 rounded-md bg-red-600 text-white'
                      onClick={() => {
                        if (confirmacion) {
                          setConfirmacion(false);
                          setOpen(false)
                        } else {
                          setOpen(false);
                        }
                      }}
                    > 
                      {confirmacion ? 'No' : 'No'}
                    </button>

                  </>
                )
            }
          </div>
        </>
      )}
    </div>
  );
  
  
  
}

export default ModalConfirmacion;