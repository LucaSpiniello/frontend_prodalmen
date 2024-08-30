import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react'
import { TBinesInventario } from '../../../types/TypesBodega.types';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template';
import ModalForm from '../../../components/ModalForm.modal';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useAuth } from '../../../context/authContext';
import { cerrarInventario, fetchBinInventario, fetchInventario } from '../../../redux/slices/bodegaSlice';
import { useParams } from 'react-router-dom';
import { BiQrScan } from 'react-icons/bi';
import ScannerQR from '../../../components/ScannerQR';
import toast from 'react-hot-toast';
import { optionCalleBodega, optionsBodegasB } from '../../../utils/options.constantes';
import Tooltip from '../../../components/ui/Tooltip';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/form/Textarea';
import ModalObservaciones from './ModalObservaciones';
import startWebSocket from '../../../utils/webSocket.util';
import { BODEGAS, CALLES_BODEGA_G4 } from '../../../utils/constante';
import { GoDotFill } from 'react-icons/go';

const DetalleInventario = () => {
  const { id } = useParams()
  const columnHelper = createColumnHelper<TBinesInventario>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const inventario = useAppSelector((state: RootState) => state.bodegas.inventario)
  const bines_inventario = useAppSelector((state: RootState) => state.bodegas.bin_inventario)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [openScan, setOpenScan] = useState<boolean>(false)
  const [socketState, setSocketState] = useState<WebSocket | undefined>()
  const [bodegas, setBodegas] = useState<string[]>([])
  const [calles, setCalles] = useState<string[]>([])
  
  useEffect(() => {
    dispatch(fetchBinInventario({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchInventario({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  const [rowSelection, setRowSelection] = useState({});
  // const codigos_escaneados = useAppSelector((state: RootState) => state.bodegas.codigo_scaneados_qr)

  const playSoundOnceWrong = () => {
    const audio = new Audio('/src/assets/audios/error.mp3'); // Reemplaza con la ruta de tu archivo de sonido
    audio.play();
  };

  const playSoundOnceOk = () => {
    const audio = new Audio('/src/assets/audios/ok.mp3')
    audio.play()
  }

  const columns = [
    columnHelper.display({
      id: 'codigo_tarja',
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.codigo_tarja}`}
        </div>
      ),
      header: 'Código Tarja'
    }),
    columnHelper.accessor('calle', {
      cell: (info) => (
        <div className="font-bold">{info.row.original.calle}</div>
      ),
      header: 'Calle'
    }),
    columnHelper.accessor('validado',{
      cell: (info) => (
        <div className='font-bold flex gap-2'>
          { info.row.original.validado ? 
            <>
              <Tooltip text='Bin Validado'>
                <Button color="emerald" variant='solid' icon="HeroCheck"></Button>
              </Tooltip>
            </>
          : !info.row.original.validado && info.row.original.observaciones === null ?
            <>
              <Tooltip text='Bin No Validado'>
                <Button color='amber' variant='solid' icon='HeroQuestionMarkCircle'></Button>
              </Tooltip>
              <ModalObservaciones info={info.row.original}></ModalObservaciones>
            </>
          : !info.row.original.validado && info.row.original.observaciones != null ?
            <>
              <Tooltip text='Bin No Validado'>
                <Button color='amber' variant='solid' icon='HeroQuestionMarkCircle'></Button>
              </Tooltip>
              <Textarea dimension='xs' value={info.row.original.observaciones} readOnly={true}></Textarea>
            </>
          : null
          }
        </div>
      ),
      header: 'Validado'
    }),
  ]

  const table = useReactTable({
    data: bines_inventario,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    enableGlobalFilter: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  const handleScan = (detectedCodes: any) => {
    if (socketState) {
      if (detectedCodes.length > 0) {
        const scannedValue = detectedCodes[0].rawValue.trim()
        const scannedValueUrl = scannedValue.split('https://produccion.prodalmen.cl/v2/detalle-tarja/')[1]
        if (scannedValueUrl) {
          const bin_encontrado = bines_inventario.find(bin => bin.codigo_tarja === scannedValueUrl.split('/')[0]);
          if (bin_encontrado) {
            socketState.send(JSON.stringify({
              action: "check_and_update_bin_status",
              bin_id: bin_encontrado.id,
              inventario_id: inventario?.id
            }))
          } else {
            toast.error('Este bin no se encontro en este inventario')
            playSoundOnceWrong()
          }
        } else if (scannedValue) {
          const bin_encontrado = bines_inventario.find(bin => bin.codigo_tarja === scannedValue);
          if (bin_encontrado) {
            socketState.send(JSON.stringify({
              action: "check_and_update_bin_status",
              bin_id: bin_encontrado.id,
              inventario_id: inventario?.id
            }))
          } else {
            toast.error('Este bin no se encontro en este inventario')
            playSoundOnceWrong()
          }
        }
      }
    } else {
      toast.error('Error en la conexion websocket')
    }
  };

  useEffect(() => {
    const conectar_websocket = async () => {
      const token_verificado = await verificarToken(token);
      if (!token_verificado) {
        toast.error('Token no verificado');
        return;
      }
      const socket = startWebSocket({access: token_verificado, url: `ws/update_bin_en_inventario`})
      socket.onopen = () => {
        setSocketState(socket)
      };
    }
    conectar_websocket()
    return () => {
      socketState?.close()
    }
  }, [token])

  useEffect(() => {
    if (socketState) {
      socketState.addEventListener('message', (e) => {
        // console.log('LLEGO MENSAJE', e.data)
        const data = JSON.parse(e.data)
        if (data.status === 'error') {
          toast.error(`${data.message}`)
          playSoundOnceWrong()
        } else if (data.status === 'success') {
          toast.success(`${data.message}`)
          playSoundOnceOk()
          dispatch(fetchBinInventario({ id: parseInt(id!), token, verificar_token: verificarToken }))
        }
      })
    }
  }, [socketState])
  
  useEffect(() => {
    if (inventario) {
      setBodegas(inventario.bodegas.split(','))
      setCalles(inventario.calles.split(','))
    }
  }, [inventario])
  
  return (
    <Container breakpoint={null} className='w-full h-full'>
      <Card>
        <CardHeader><CardTitle>Detalle Inventario N° {id}</CardTitle></CardHeader>
        <CardBody>
          <Card>
            <CardBody className='w-full flex flex-col md:flex-row lg:flex-row gap-5'>
              <div className='w-full flex flex-col'>
                <span>Tipo Inventario</span>
                <div className='w-full dark:bg-zinc-800 bg-zinc-100 p-2 rounded-md'>
                  <span>{inventario?.tipo_inventario_label}</span>
                </div>
              </div>
              <div className='w-full flex flex-col'>
                <span>Bodegas</span>
                <div className='w-full dark:bg-zinc-800 bg-zinc-100 p-2 rounded-md flex gap-2 flex-wrap'>
                  { bodegas.length > 0 && inventario && inventario.tipo_inventario != '3' ?
                    <ul>
                      { bodegas.map((bodega, index) => (
                        <li className='w-full flex' key={index}><GoDotFill className='mt-1 align-middle'/>{BODEGAS.find(element => element.value === bodega)?.label}</li>
                      ))}
                    </ul>
                  : inventario && inventario.tipo_inventario === '3' ?
                    <div>Todas las Bodegas</div>
                  : <div>No hay Bodegas</div>
                  }
                </div>
              </div>
              <div className='w-full flex flex-col'>
                <span>Calles</span>
                <div className='w-full dark:bg-zinc-800 bg-zinc-100 p-2 rounded-md flex gap-2 flex-wrap'>
                  {/* {
                    optionCalleBodega.filter(calle => inventario?.calles.includes(calle?.value!)).flatMap((calle) => (
                      <span>{calle?.label}</span>
                    ))
                  } */}
                  { calles.length > 0 && inventario && inventario.tipo_inventario != '3' && inventario.tipo_inventario != '1' ?
                    <ul>
                      { calles.map((calle, index) => (
                        <li className='w-full flex' key={index}><GoDotFill className='mt-1 align-middle'/>{CALLES_BODEGA_G4.find(element => element.value === calle)?.label}</li>
                      ))}
                    </ul>
                  : inventario && inventario.tipo_inventario === '3' ?
                    <div>Todas las Calles</div>
                  : inventario && inventario.tipo_inventario === '1' ?
                    <div>Todas las Calles de {BODEGAS.find(element => element.value === inventario.bodegas)?.label}</div>
                  : <div>No hay Calles</div>
                  }
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <Container breakpoint={null} className="w-full">
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle>Bins En Inventario</CardTitle>
                  {
                    inventario && inventario.condicion_cierre && inventario.estado != '1' ? (
                      <>
                        <Button color='red' variant='solid' onClick={() => {
                          dispatch(cerrarInventario({token: token, verificar_token: verificarToken, id_inventario: inventario.id}))
                        }}>Cerrar Inventario</Button>
                      </>
                    )
                    : inventario && !inventario.condicion_cierre && inventario.estado === '0' ? (
                      <>
                        <Tooltip text='No se puede cerrar el inventario por favor introduzca observación a todos los bins no validados'>
                          <div>
                            <Button color='red' variant='solid' isLoading={true}>Cerrar Inventario</Button>
                          </div>
                        </Tooltip>
                      </>
                    ) : inventario && inventario.estado === '1' ?
                      <Tooltip text='Este Inventario ya esta Cerrado'>
                        <Button color='green' variant='solid'>Inventario Cerrado</Button>
                      </Tooltip>
                    : null
                  }
                  {
                    bines_inventario.length >= 1 && inventario && inventario.estado != '1'
                      ? (
                        <ModalForm
                          open={openScan}
                          setOpen={setOpenScan}
                          variant='solid'
                          color='orange'
                          colorIntensity='600'
                          title='Escanea QR'
                          width='h-full'
                          size={400}
                          icon={
                            <>
                              <span className='mr-5 text-lg'>Escanear QR</span>
                              <BiQrScan style={{ fontSize: 25 }}/>
                            </>
                          }
                          >
                          <ScannerQR handleScan={handleScan}/>
                        </ModalForm>
                      )
                      : null
                  }
                </CardHeader>
                <CardBody className='overflow-auto'>
                  <TableTemplate className='table-fixed' table={table} />
                </CardBody>
                <TableCardFooterTemplate table={table} />
              </Card>
            </Container>
          </Card>
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetalleInventario