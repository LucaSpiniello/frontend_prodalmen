import React, { Dispatch, FC, SetStateAction } from 'react'
import Container from '../../../../components/layouts/Container/Container'
import TablaBinBodegaDespacho from './TablaFrutaEnPedidoMercadoInterno'
import TablaFrutaDespacho from './TablaFrutaDespachoMercadoInterno'
import TablaFrutaPedidoMercadoInterno from './TablaFrutaEnPedidoMercadoInterno'

interface IArmadoDespachoProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const ArmadoDespacho: FC<IArmadoDespachoProps> = ({ setOpen }) => {
  return (
    <Container breakpoint={null} className=''>
      <div className='flex'>
        <TablaFrutaPedidoMercadoInterno />
        <TablaFrutaDespacho setOpen={setOpen}/>
      </div>
    </Container>
  )
}

export default ArmadoDespacho
