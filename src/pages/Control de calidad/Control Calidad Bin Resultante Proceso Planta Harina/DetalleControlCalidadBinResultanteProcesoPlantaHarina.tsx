import { useEffect } from 'react'
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader } from '../../../components/ui/Card'
import Label from '../../../components/form/Label'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { useAuth } from '../../../context/authContext'
import { fetchCCBinResultanteProcesoPlantaHarina } from '../../../redux/slices/procesoPlantaHarina'

const DetalleControlCalidadBinResultanteProcesoPlantaHarina = ({ id_bin }: { id_bin : number }) => {
  const control_calidad_bin_resultante_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.control_calidad_resultante_proceso_planta_harina)
  const dispatch = useAppDispatch()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  // const [loading, setLoading] = useState<boolean>(true)
  // const labels: string[] = [];
  // const valores: any[] = [];

  useEffect(() => {
    dispatch(fetchCCBinResultanteProcesoPlantaHarina({ id: id_bin, token, verificar_token: verificarToken }))
  }, [])

  // useEffect(() => {
  //   if (control_calidad_bin_resultante_proceso_planta_harina) {
  //     Object.entries(control_calidad_bin_resultante_proceso_planta_harina!).forEach(([key, value]) => {
  //       if (key === 'humedad' || key === 'piel_aderida' || key === 'granulometria') {
  //         labels.push(key);
  //         valores.push(value);
  //       }
  //     })
  //   }
  // },[control_calidad_bin_resultante_proceso_planta_harina, id_bin, loading])




  // useEffect(() => {
  //   if (loading){
  //     setLoading(false)
  //   }
  // }, [loading])

  return (
    <PageWrapper name="Detalle Control Calidad Bin Planta Harina">
      <Container breakpoint={null} className="w-full h-full">
        <Card>  
          <CardBody className='flex flex-col gap-5'>
              <article className='w-full justify-between gap-5 flex'>


                <div className='w-full'>
                  <Label htmlFor='' className='text-center'>Código Tarja</Label>
                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-4 px-3 rounded-md'>
                    <span className='font-semibold text-lg'>{control_calidad_bin_resultante_proceso_planta_harina?.codigo_tarja}</span>
                  </div>
                </div>

                <div className='w-full'>
                  <Label htmlFor='' className='text-center'>Estado</Label>
                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-4 px-3 rounded-md'>
                    <span className='font-semibold text-lg'>{control_calidad_bin_resultante_proceso_planta_harina?.estado_cc_label}</span>
                  </div>
                </div>

                {/* <div className='w-full'>
                  <Label htmlFor='' className='text-center'>Calidad</Label>
                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-4 px-3 rounded-md'>
                    <span className='font-semibold text-lg'>Sin Calidad</span>
                  </div>
                </div> */}


              </article>

              <article className='w-full justify-between gap-5 flex'>
                <div className='w-full'>
                  <Label htmlFor='' className='text-center'>Humedad</Label>
                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-4 px-3 rounded-md'>
                    <span className='text-lg'>{(control_calidad_bin_resultante_proceso_planta_harina?.humedad! ?? 0)} %</span>
                  </div>
                </div>
                <div className='w-full'>
                  <Label htmlFor='' className='text-center'>Piel Aderida</Label>
                  <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-4 px-3 rounded-md'>
                    <span className='text-lg'>{(control_calidad_bin_resultante_proceso_planta_harina?.piel_aderida! ?? 0)} %</span>
                  </div>
                </div>
              </article>

              
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default DetalleControlCalidadBinResultanteProcesoPlantaHarina
