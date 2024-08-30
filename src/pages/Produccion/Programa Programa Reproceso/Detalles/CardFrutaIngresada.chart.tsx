import { useEffect, useState } from "react";
import Chart, { IChartProps } from "../../../../components/Chart"
import Card, { CardBody } from "../../../../components/ui/Card"
import { useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"


// interface ICardFrutaCalibradaProps {
// 	programa: TProduccion
// 	envases_programa: TEnvasesPrograma[]
// 	tarjas_resultantes?: TTarjaResultante[]
// 	activeTab: TTabs
// }

const CardDetalleProgramaReproceso = () => {
  const tarjas_resultantes = useAppSelector((state: RootState) => state.reproceso.tarjas_resultantes)
  const bins_reproceso = useAppSelector((state: RootState) => state.reproceso.bins_reproceso)
  const [totales_kilos_en_programa, settotales_kilos_en_programa] = useState<number>(1)
  const [kilos_totales_ingresados, setkilos_totales_ingresados] = useState<number>(0)
  const [chartProps, setchartProps] = useState<IChartProps>()
  const [chartProps2, setchartProps2] = useState<IChartProps>()
  const [kilos_totales_procesados_ultima_hora, setkilos_totales_procesados_ultima_hora] = useState<string>('')
  const [tarja_calibrada, settarja_calibrada] = useState<string>('')

  useEffect(() => {
    settotales_kilos_en_programa(bins_reproceso?.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 1)

    const kilos_totales_ingresados_porcentual = (bins_reproceso?.length ?
    (((bins_reproceso.reduce((acc, bin) => (bin?.kilos_bin || 0) + acc, 0) / totales_kilos_en_programa) * 100)?.toFixed(2) ?? 0)
    : 0)
  
    setkilos_totales_ingresados(bins_reproceso?.filter(bin => bin.bin_procesado === true)?.
      reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0)
  
    const kilos_totales_procesados_porcentual =((((bins_reproceso?.filter(bin => bin.bin_procesado))?.
      reduce((acc, bin) => bin.kilos_bin + acc, 0) / totales_kilos_en_programa) * 100).toFixed(2) ?? 0)
  
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
    setchartProps({
      series: [{
        name: 'Kilos',
        data: seriesData,
      }],
      options: optionsData as any,
      type: 'bar',
      width: '100%', // Puedes ajustar el ancho y alto según tus necesidades
      height: '180px',
    });
  
    const now = new Date()
  
    setkilos_totales_procesados_ultima_hora(bins_reproceso?.
      filter(bin => bin.bin_procesado === true && bin.fecha_modificacion).
      filter(bin => {
        const diffTime = now.getTime() - new Date(bin.fecha_modificacion).getTime()
        const diffHours = diffTime / (1000 * 3600)
        return diffHours <= 1
      }).
      reduce((acc, bin) => bin.kilos_bin + acc, 0)?.toFixed(2))
  
  
    const tarja_calibrada = (tarjas_resultantes.
      filter(tarja => {
        const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime()
        const diffHour = diffTime / (1000 * 3600)
        return diffHour <= 1
      })).
      reduce((acc, tarja) => tarja.peso + acc, 0)?.toFixed(2)

      settarja_calibrada(tarja_calibrada)
    
    setchartProps2({
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
    });
  }, [tarjas_resultantes, bins_reproceso])




	return (
		<div className="flex flex-col md:flex-col lg:flex-row gap-2">
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
              <span className="text-center w-8/12 mx-auto">Total de envases a procesar: {bins_reproceso && bins_reproceso.filter(bin => bin.bin_procesado !== true).length} </span>
            </div>
          </div>
          <div className="w-full h-full">
            {
              chartProps && (
                <Chart {...chartProps} />
              )
            }

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
            {
              chartProps2 && (
                <Chart {...chartProps2} />
              )
            }
          </div>
        </CardBody>
      </Card>
    </div>
	);
};

export default CardDetalleProgramaReproceso;
