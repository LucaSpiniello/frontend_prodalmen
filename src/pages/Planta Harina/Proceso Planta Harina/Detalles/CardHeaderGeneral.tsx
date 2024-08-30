import Balance from "../../../../components/Balance";
import Chart, { IChartProps } from "../../../../components/Chart"
import Icon from "../../../../components/icon/Icon";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody } from "../../../../components/ui/Card"
import Tooltip from "../../../../components/ui/Tooltip";
import { useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TProcesoPlantaHarina } from "../../../../types/typesPlantaHarina";


const CardHeaderGeneral = () => {
  const bins_en_proceso_planta_harina = useAppSelector((state: RootState) => state.proceso_planta_harina.bin_en_proceso_planta_harina)
  const bins_resultante = useAppSelector((state: RootState) => state.proceso_planta_harina.bins_resultantes_proceso_planta_harina)
  const proceso_planta_harina =  useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)



  const totales_kilos_en_programa = (bins_en_proceso_planta_harina?.reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 1)

  const kilos_totales_ingresados_porcentual = (bins_en_proceso_planta_harina?.length ?
  (((bins_en_proceso_planta_harina.reduce((acc, bin) => (bin?.kilos_fruta || 0) + acc, 0) / totales_kilos_en_programa) * 100)?.toFixed(2) ?? 0)
  : 0)

  const kilos_totales_ingresados = (bins_en_proceso_planta_harina?.filter(bin => bin.procesado === true)?.
    reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 0)

  const kilos_totales_procesados_porcentual =((((bins_en_proceso_planta_harina?.filter(bin => bin.procesado))?.
    reduce((acc, bin) => bin.kilos_fruta + acc, 0) / totales_kilos_en_programa) * 100).toFixed(2) ?? 0)

  const seriesData = [Number(kilos_totales_ingresados_porcentual), Number(kilos_totales_procesados_porcentual)]
  const optionsData = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    xaxis: {
      categories: [`Fruta Ingresada ${Number(kilos_totales_ingresados_porcentual)} %`, `Fruta Procesada ${Number(kilos_totales_procesados_porcentual  )} %`],
    },
    colors: ['#008FFB'],
    yaxis: {
      title: {
        text: 'Kilogramos (kgs)',
      },

      tickAmount: 5,
      max: 100
    },
    title: {
      text: 'Información de Producción',
      align: 'center',
    },
  };

  // Combina los datos de las series y las opciones en un objeto props
  const chartProps: IChartProps = {
    series: [{
      name: 'Kilos',
      data: seriesData,
    }],
    options: optionsData as any,
    type: 'bar',
    width: '100%', // Puedes ajustar el ancho y alto según tus necesidades
    height: '180px',
  };

  const now = new Date()

  const kilos_totales_procesados_ultima_hora = bins_en_proceso_planta_harina?.
    filter(bin => bin.procesado === true && bin.fecha_modificacion).
    filter(bin => {
      const diffTime = now.getTime() - new Date(bin.fecha_modificacion).getTime()
      const diffHours = diffTime / (1000 * 3600)
      return diffHours <= 1
    }).
    reduce((acc, bin) => bin.kilos_fruta + acc, 0)?.toFixed(2)


  const tarja_calibrada = (bins_resultante.
    filter(tarja => {
      const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime()
      const diffHour = diffTime / (1000 * 3600)
      return diffHour <= 1
    })).
    reduce((acc, tarja) => (tarja.peso - parseInt(tarja.tipo_patineta)) + acc, 0)?.toFixed(2)
  
	const chartProps2: IChartProps = {
		series: [Number(tarja_calibrada), Number(kilos_totales_procesados_ultima_hora),],
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


  const difference = (programa: TProcesoPlantaHarina) => {
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
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
                  <Icon icon='DuoSaturation' size='text-3xl' className='text-white' />
                </div>
                <div className="w-7/12 text-center">
                  <span className='font-semibold'>Promedio Humedad Semi-Elab</span>
                  <Tooltip text='Promedio Humedad Semi-Elab' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.promedio_humedad.toFixed(1)} %</div>
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
                  <span className='font-semibold'>Promedio Piel Aderida Semi-Elab</span>
                  <Tooltip text='Promedio Piel Aderida Semi-Elab' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.promedio_piel.toFixed(1)} %</div>
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
                  <span className='font-semibold'>Kilos totales en programa</span>
                  <Tooltip text='Kilos totales en programa' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.kilos_iniciales} kgs</div>
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
                  <span className='font-semibold'>Semi-elaborado resultante</span>
                  <Tooltip text='Semi-elaborado resultante.' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.bines_resultantes_kilos}</div>
                <Balance status={
                  difference(proceso_planta_harina!) > 0 
                    ? 'positive'
                    : difference(proceso_planta_harina!) === 0
                      ? 'fixed'
                      : "negative"
                } value={difference(proceso_planta_harina!)}>
                  Balance
                </Balance>  
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
                <div className="w-7/12">
                  <span className='font-semibold'>Promedio Piel Aderida Semi-Elab</span>
                  <Tooltip text='TPromedio Piel Aderida Semi-Elab' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>238K</div>
                <Balance status='positive' value='32%'>
                  Balance
                </Balance>
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
                <div className="w-7/12">
                  <span className='font-semibold'>Perdida Sugerida</span>
                  <Tooltip text='Perdida Sugerida.' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.perdidaproceso} %</div>
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
                  <span className='font-semibold'>Valor Referencial</span>
                  <Tooltip text='Valor referencial.' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.valor_referencial}</div>
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
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.rechazos_registrados} kgs</div>
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
                  <span className='font-semibold'>Semi-elmaborado resultante</span>
                  <Tooltip text='Semi-elmaborado resultante.' />
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-4xl font-semibold'>{proceso_planta_harina?.bines_resultantes_kilos}</div>
                <Balance status={
                  difference(proceso_planta_harina!) > 0 
                    ? 'positive'
                    : difference(proceso_planta_harina!) === 0
                      ? 'fixed'
                      : "negative"
                } value={difference(proceso_planta_harina!)}>
                  Balance
                </Balance>  
              </div>
            </div>
          </CardBody>
        </Card>

      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap lg:flex-nowrap gap-5 mt-5">
          <Card className="w-full h-[90%]">
            <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2">
              <div className='w-full flex justify-between gap-y-2 md:gap-2 lg:gap-2 '>
                <div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center p-2'>
                  <span className="text-center w-11/12 mx-auto">Fruta en producción: {(totales_kilos_en_programa)?.toFixed(2)} kgs</span>
                </div>
                <div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center p-2'>
                  <span className="text-center w-8/12 mx-auto">Fruta Procesada: {(kilos_totales_ingresados)?.toFixed(2)} kgs.</span>
                </div>
                <div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center p-2'>
                  <span className="text-center w-8/12 mx-auto">Total de envases a procesar: {bins_en_proceso_planta_harina.filter(bin => bin.procesado !== true).length} </span>
                </div>
              </div>
              <div className="w-full h-full">
                <Chart {...chartProps} />
              </div>
            </CardBody>
          </Card>

          <Card className="w-full h-[90%]">
            <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2 ">

              <div className='w-full flex gap-y-2 md:gap-2 lg:gap-2 '>
                <div className='w-full h-ful dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
                  <span>Fruta procesada en ultima hora: {kilos_totales_procesados_ultima_hora} kgs</span>
                </div>
                <div className='w-full h-ful dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
                  <span>Fruta calibrada en ultima hora: {tarja_calibrada} kgs.</span>
                </div>
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
