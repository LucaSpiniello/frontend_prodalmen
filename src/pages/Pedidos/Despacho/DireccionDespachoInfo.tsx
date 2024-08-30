import React from 'react'
import Card, { CardBody, CardHeader } from '../../../components/ui/Card'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'

const DireccionDespachoInfo = () => {
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho) 

  return (
    <Card>
      <CardBody>
        <div className='flex gap-5'>
          <div className='w-full flex-col flex'>
            <span>Dirección</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.direccion.direccion}</span>
            </div>
          </div>

          <div className='w-full flex-col flex'>
            <span>Telefono</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.direccion.telefono}</span>
            </div>

          </div>

          <div className='w-full flex-col flex'>
            <span>Correo</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.direccion.correo}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default DireccionDespachoInfo
