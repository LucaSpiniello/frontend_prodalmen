import { useDispatch } from "react-redux"
import Container from "../../../../components/layouts/Container/Container"
import { useAppSelector } from "../../../../redux/hooks"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { RootState } from "../../../../redux/store"
import { useEffect, useState } from "react"
import { fetchDistribuccionResultante, fetchMetricasTiempoRealProduccion, fetchProduccionHora, fetchRendimientoProduccion } from "../../../../redux/slices/produccionSlice"
import { useAuth } from "../../../../context/authContext"
import { useParams } from "react-router-dom"
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../../components/ui/Card"
import Icon from "../../../../components/icon/Icon"
import Chart from "react-apexcharts";
import { IChartOptions } from "../../../../interface/chart.interface"

function TabGeneralProduccion() {
    
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    // const programa_produccion =  useAppSelector((state: RootState) => state.programa_produccion.programa)
    // const metrica = useAppSelector((state: RootState) => state.programa_produccion.metricasTiempoRealProduccion)
    const {metricasTiempoRealProduccion: metrica, programa:programa_produccion, produccionHora, loading, distribuccionResultante, rendimientoProduccion } = useAppSelector((state: RootState) => state.programa_produccion)
    const { verificarToken } = useAuth()
    const {id} = useParams()
    const [chartProduccionHora, setChartProduccionHora] = useState<IChartOptions | undefined>()
    const [chartDistribuccionResultante, setChartDistribuccionResultante] = useState<IChartOptions | undefined>()
    const [chartRendimientoProduccion, setChartRendimientoProduccion] = useState<IChartOptions | undefined>()

    useEffect(() => {
        if (programa_produccion && programa_produccion.estado !='1') {
            dispatch(fetchMetricasTiempoRealProduccion({id_programa: id, token, verificar_token: verificarToken}))
            dispatch(fetchProduccionHora({id_programa: id, token, verificar_token: verificarToken}))
            dispatch(fetchDistribuccionResultante({id_programa: id, token, verificar_token: verificarToken}))
            dispatch(fetchRendimientoProduccion({id_programa: id, token, verificar_token: verificarToken}))
        }
    }, [programa_produccion])

    useEffect(() => {
        if (produccionHora != null) {
            setChartProduccionHora({
                options: {
                    xaxis: {
                        categories: produccionHora.categories
                    },
                },
                series: [{
                    name: 'Producción por Hora',
                    data: produccionHora.series
                }]
            })
        }
    }, [produccionHora])

    useEffect(() => {
        if (distribuccionResultante != null) {
            setChartDistribuccionResultante({
                options: {
                    labels: distribuccionResultante.labels
                },
                series: distribuccionResultante.series
            })
        }
    }, [distribuccionResultante])

    useEffect(() => {
        if (rendimientoProduccion != null) {
            setChartRendimientoProduccion({
                options: {
                    xaxis: {
                        categories: rendimientoProduccion.categories
                    },
                },
                series: [{
                    name: 'Rendimiento Por Dia',
                    data: rendimientoProduccion.series.map(element => Number(element.toFixed(2)))
                }]
            })
        }
    }, [rendimientoProduccion])

    return (
        <Container className="w-full h-full">
            {
                programa_produccion ?
                programa_produccion.estado != '1' ? 
                    <>
                        <div className="flex w-full flex-wrap md:flex-nowrap lg:flex-nowrap gap-5">
                            <Card className="w-full">
                                <CardBody>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                                            <Icon icon='DuoKitchenScale' size='text-3xl' className='text-white' />
                                            </div>
                                            <div className="w-7/12 text-center">
                                            <span className='font-semibold'>Kilos Fruta en Programa</span>
                                        
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div className='text-4xl font-semibold'>{metrica?.total_kilos_fruta.toLocaleString('es-ES', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2, 
                                                useGrouping: true // Habilita el uso de separadores de miles
                                            })} kgs</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="w-full">
                                <CardBody>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                                            <Icon icon='DuoKitchenScale' size='text-3xl' className='text-white' />
                                            </div>
                                            <div className="w-7/12 text-center">
                                            <span className='font-semibold'>Kilos Procesados de Pre Limpia</span>
                                        
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div className='text-4xl font-semibold'>{metrica?.kilos_procesados_pre_limpia.toLocaleString('es-ES', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2, 
                                                useGrouping: true // Habilita el uso de separadores de miles
                                            })} kgs</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="w-full">
                                <CardBody>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                                            <Icon icon='DuoKitchenScale' size='text-3xl' className='text-white' />
                                            </div>
                                            <div className="w-7/12 text-center">
                                            <span className='font-semibold'>Kilos Resultantes Despelonado</span>
                                        
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div className='text-4xl font-semibold'>{metrica?.kilos_resultantes_despelo.toLocaleString('es-ES', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2, 
                                                useGrouping: true // Habilita el uso de separadores de miles
                                            })} kgs</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            
                        </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap lg:flex-nowrap gap-5 mt-5">
                            <Card className="w-full">
                                <CardBody>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                                            <Icon icon='DuoKitchenScale' size='text-3xl' className='text-white' />
                                            </div>
                                            <div className="w-7/12 text-center">
                                            <span className='font-semibold'>% de Rendimiento de Producción</span>
                                        
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div className='text-4xl font-semibold'>{metrica?.rendimiento_produccion.toLocaleString('es-ES', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2, 
                                                useGrouping: true // Habilita el uso de separadores de miles
                                            })}%</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="w-full">
                                <CardBody>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                                            <Icon icon='DuoKitchenScale' size='text-3xl' className='text-white' />
                                            </div>
                                            <div className="w-7/12 text-center">
                                            <span className='font-semibold'>Tasa Producción por Hora</span>
                                        
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div className='text-4xl font-semibold'>{metrica?.tasa_produccion_hora.toLocaleString('es-ES', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2, 
                                                useGrouping: true // Habilita el uso de separadores de miles
                                            })} kgs / hora</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap lg:flex-nowrap gap-5 mt-5">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardHeaderChild><CardTitle>Lotes Procesados en Producción Por Hora</CardTitle></CardHeaderChild>
                                </CardHeader>
                                <CardBody>
                                    {
                                        loading ?
                                            null
                                        : loading === false && programa_produccion != null && produccionHora != null && chartProduccionHora ? 
                                            <Chart
                                                options={chartProduccionHora.options}
                                                series={chartProduccionHora.series}
                                                type="bar"
                                                width="100%"
                                                height={300}
                                            />
                                        : null
                                    }
                                </CardBody>
                            </Card>
                        </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap lg:flex-nowrap gap-5 mt-5">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardHeaderChild><CardTitle>Distribucción de Tarjas Resultantes</CardTitle></CardHeaderChild>
                                </CardHeader>
                                <CardBody>
                                    {
                                        loading ?
                                            null
                                        : loading === false && programa_produccion != null && distribuccionResultante != null && chartDistribuccionResultante ? 
                                            <Chart
                                                options={chartDistribuccionResultante.options}
                                                series={chartDistribuccionResultante.series}
                                                type="donut"
                                                width="100%"
                                                // height="100%"
                                            />
                                        : null
                                    }
                                </CardBody>
                            </Card>
                            <Card className="w-full">
                                <CardHeader>
                                    <CardHeaderChild><CardTitle>Rendimiento Producción</CardTitle></CardHeaderChild>
                                </CardHeader>
                                <CardBody>
                                    {
                                        loading ?
                                            null
                                        : loading === false && programa_produccion != null && rendimientoProduccion != null && chartRendimientoProduccion ? 
                                            <Chart
                                                options={chartRendimientoProduccion.options}
                                                series={chartRendimientoProduccion.series}
                                                type="area"
                                                width="100%"
                                                // height="100%"
                                            />
                                        : null
                                    }
                                </CardBody>
                            </Card>
                        </div>
                    </>
                :
                    programa_produccion.estado === '1' ? (<div className="text-2xl">No ha Empezado la Producción</div>) : null 
                : null
            }
        </Container>
    )
}

export default TabGeneralProduccion