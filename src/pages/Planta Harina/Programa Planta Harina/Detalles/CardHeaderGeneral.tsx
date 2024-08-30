import Chart, { IChartProps } from "../../../../components/Chart"
import Icon from "../../../../components/icon/Icon";
import Container from "../../../../components/layouts/Container/Container";
import Badge from "../../../../components/ui/Badge";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../components/ui/Card"
import { useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import Balance from "../../../../components/Balance";
import Tooltip from "../../../../components/ui/Tooltip";
import { TProgramaPlantaHarina } from "../../../../types/typesPlantaHarina";


const CardHeaderGeneral = () => {
  const bins_en_planta_harina = useAppSelector((state: RootState) => state.planta_harina.bin_en_planta_harina)
  const bins_resultante = useAppSelector((state: RootState) => state.planta_harina.bin_en_planta_harina)
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)


  const seriesData  = programa_planta_harina?.metrica_bines.detalles_procesamiento.map((item) => item.kilos).reverse()
  const categories  = programa_planta_harina?.metrica_bines.detalles_procesamiento.map((item) => new Date(item.hora_procesado).toLocaleTimeString()).reverse()

  const lineChartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: true
      }
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: categories,
      title: {
        text: 'Hora Procesada'
      }
    },
    yaxis: {
      title: {
        text: 'Kilos Procesados'
      },
      labels: {
        formatter: function(val: any) {
          return val.toFixed(2) + " kg";
        }
      }
    },
    tooltip: {
      theme: 'dark'
    },
    markers: {
      size: 4,
      colors: ['#FF4560'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    title: {
      text: 'Información de Producción por Hora',
      align: 'center'
    }
  };
  
  // Datos de la serie para el gráfico
  const series = [{
    name: "Kilos Procesados",
    data: seriesData
  }];


  


  const now = new Date()

  const kilos_totales_procesados_ultima_hora = bins_en_planta_harina?.
    filter(bin => bin.procesado === true && bin.fecha_modificacion).
    filter(bin => {
      const diffTime = now.getTime() - new Date(bin.fecha_modificacion).getTime()
      const diffHours = diffTime / (1000 * 3600)
      return diffHours <= 1
    }).
    reduce((acc, bin) => bin.kilos_fruta + acc, 0)?.toFixed(2)

    // PRODALV3-481
  // const tarja_calibrada = (bins_resultante.
  //   filter(tarja => {
  //     const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime()
  //     const diffHour = diffTime / (1000 * 3600)
  //     return diffHour <= 1
  //   })).
  //   reduce((acc, tarja) => tarja.kilos_fruta + acc, 0)?.toFixed(2)
  
	const chartProps2: IChartProps = {
    // PRODALV3-481
		// series: [Number(tarja_calibrada), Number(kilos_totales_procesados_ultima_hora),],
		series: [Number(0), Number(kilos_totales_procesados_ultima_hora),],
		options: {
			chart: {
				type: 'donut',
			},
			labels: ['Fruta calibrada', 'Fruta procesada'],
			responsive: [{
				options: {
					legend: {
						position: 'bottom'
					}
				}
			}],
		},
		type: 'donut',
		width: '90%',
		height: '200px',
	};

  const difference = (programa: TProgramaPlantaHarina) => {
    if (programa) {
      const kilosIniciales = programa.kilos_iniciales;
      const kilosResultantes = programa.bines_resultantes_kilos;

      const diferenciaEnKilos = kilosResultantes - kilosIniciales;
      const diferenciaEnPorcentaje = ((diferenciaEnKilos / kilosIniciales) * 100).toFixed(2)

      return parseFloat(diferenciaEnPorcentaje)
    }

    return 0

  }




	return (
    <Container breakpoint={null} className="!p-0">
      <div className="flex w-full flex-wrap md:flex-nowrap lg:flex-nowrap gap-5">

        <Card className="w-full">
          <CardBody>
            <div className='flex flex-col gap-5'>
              
              <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                  <Icon icon='DuoSaturation' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12 text-center">
                  <span className='font-semibold'>Promedio Humedad <br></br> Resultante CDC </span>
                  <Tooltip text='Valor promediado con los resultados de cdc sobre las tarjas resultantes' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.promedio_humedad.toFixed(1)} %</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardBody>
            <div className='flex flex-col gap-5'>
              
              <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                  <Icon icon='DuoCompiling' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12 text-center">
                  <span className='font-semibold'>Promedio Piel Aderida <br />Resultante CDC </span>
                  <Tooltip text='Valor promediado con los resultados de cdc sobre las tarjas resultantes' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.promedio_piel.toFixed(1)} %</div>
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
                  <span className='font-semibold'>Kilos Fruta en Programa</span>
               
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.kilos_iniciales} kgs</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardBody>
            <div className='flex flex-col gap-5'>
              
              <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                  <Icon icon='DuoEqualizer' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12 text-center">
                  <span className='font-semibold'>Kilos Semi-elaborado Resultante</span>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.bines_resultantes_kilos} Kgs</div>
                {/* <Balance status={
                  difference(programa_planta_harina!) > 0 
                    ? 'positive'
                    : difference(programa_planta_harina!) === 0
                      ? 'fixed'
                      : "negative"
                } value={difference(programa_planta_harina!)}>
                  Balance
                </Balance>   */}
              </div>
            </div>
          </CardBody>
        </Card>
        
        

        <Card className="w-full">
          <CardBody>
            <div className='flex flex-col gap-5'>
              
              <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                  <Icon icon='DuoSale1' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12">
                  <span className='font-semibold'>Perdida Sugerida </span>
                  <Tooltip text='Registrada en la creación del Programa' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.perdidaprograma} %</div>
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
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                  <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12 text-center">
                  <span className='font-semibold'>Tipo Programa</span>
                  <Tooltip text='Total sales amount.' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.tipo_programa_label}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardBody>
            <div className='flex flex-col gap-5'>
              
              <div className='flex items-center justify-between space-x-1 text-zinc-500 rtl:space-x-reverse'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                  <Icon icon='HeroCalendar' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12 text-center">
                  <span className='font-semibold'>Rechazo Registrado</span>
                  <Tooltip text='Total sales amount.' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{programa_planta_harina?.rechazos_registrados} kgs</div>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>


      <div className="flex flex-col md:flex-col lg:flex-row gap-2 mt-5">
        <Card className="w-full">
          <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2">
            <div className="w-full h-full">
             
              <Chart
                //@ts-ignore
                series={series} options={lineChartOptions} height={350}/>
            </div>
          </CardBody>
        </Card>

        <Card className="w-full h-[90%]">
          <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2 ">

            <div className='w-full flex gap-y-2 md:gap-2 lg:gap-2 '>
              <Card className="w-full">
                <CardBody className="flex w-full flex-col gap-2 justify-between">
                  <div className="w-full text-center">
                    <span className="font-semibold">Porcentaje Merma Real: </span>
                  </div>
                  <div className="w-full">
                    <Badge variant="solid" color="zinc" colorIntensity="100" className="w-full text-xl" >{programa_planta_harina?.merma_programa.porcentaje_merma} %</Badge>
                  </div>
                </CardBody>
              </Card>
              
              <Card className="w-full">
                <CardBody className="flex w-full flex-col gap-2 justify-between">
                  <div className="w-full text-center">
                    <span className="font-semibold">Porcentaje Merma Real: </span>
                  </div>
                  <div className="w-full">
                    <Badge variant="solid" color="zinc" colorIntensity="100" className="w-full text-xl" >{programa_planta_harina?.merma_programa.porcentaje_merma} %</Badge>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="w-full h-full">
              <Chart {...chartProps2} />
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
	);
};

export default CardHeaderGeneral;
