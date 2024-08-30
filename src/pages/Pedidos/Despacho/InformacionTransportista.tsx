import Card, { CardBody } from '../../../components/ui/Card'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'

const InformacionTransportista = () => {
  const despacho = useAppSelector((state: RootState) => state.pedidos.despacho) 

  console.log(despacho)

  return (
    <Card>
      <CardBody>
        <div className='flex gap-5'>
          <div className='w-full flex-col flex'>
            <span>Nombre Chofer</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.nombre_chofer}</span>
            </div>
          </div>

          <div className='w-full flex-col flex'>
            <span>Rut Chofer</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.rut_chofer}</span>
            </div>
          </div>

        </div>

        <div className='flex gap-5 mt-5'>
          <div className='w-full flex-col flex'>
            <span>Empresa Transporte</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.empresa_transporte}</span>
            </div>
          </div>

          <div className='w-full flex-col flex'>
            <span>Camión</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.camion}</span>
            </div>

          </div>

          <div className='w-full flex-col flex'>
            <span>Observaciones</span>
            <div className='py-2.5 px-2 dark:bg-zinc-800 bg-zinc-100 rounded-md'>
              <span>{despacho?.observaciones}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default InformacionTransportista
