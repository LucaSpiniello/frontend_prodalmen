import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { TTabs } from "../../../../types/TabsDashboardPrograma.types"
import { TTarjaResultante } from "../../../../types/TypesControlCalidad.type"
import { TEnvasesPrograma, TLoteProduccion, TProduccion } from "../../../../types/TypesProduccion.types"
import Chart, { IChartProps } from "../../../../components/Chart"
import Card, { CardBody } from "../../../../components/ui/Card"
import { useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"


const CardFrutaIngresada = () => {
  const envases_programa = useAppSelector((state: RootState) => state.programa_produccion.lotes)
  const tarjas_resultantes = useAppSelector((state: RootState) => state.programa_produccion.tarjas_resultantes)

  const totales_kilos_en_programa = (envases_programa?.reduce((acc, lote) => lote.kilos_fruta + acc, 0) ?? 1);
  const kilos_totales_ingresados_porcentual = envases_programa?.length ?
    (((envases_programa.reduce((acc, envase) => (envase?.kilos_fruta || 0) + acc, 0) / totales_kilos_en_programa) * 100)?.toFixed(2) ?? 0)
    : 0;
  
  const kilos_totales_ingresados = (envases_programa?.filter(lote => lote.bin_procesado === true)
    .reduce((acc, lote) => lote.kilos_fruta + acc, 0) ?? 0);
  
  const kilos_totales_procesados_porcentual = ((((envases_programa?.filter(lote => lote.bin_procesado)
    .reduce((acc, lote) => (lote?.kilos_fruta + acc), 0) / totales_kilos_en_programa) * 100)?.toFixed(2) ?? 0))
  



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
      categories: [`Fruta Ingresada ${Number(kilos_totales_ingresados_porcentual)} %`, `Fruta Procesada ${Number(kilos_totales_procesados_porcentual)} %`],
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

	const kilos_totales_procesados = envases_programa?.
		filter(envase => envase?.bin_procesado === true && envase.fecha_modificacion).
		filter(envase => {  
			const diffTime = now.getTime() - new Date(envase.fecha_modificacion).getTime();
			const diffHours = diffTime / (1000 * 3600);
			return diffHours <= 1;
		}).
		reduce((acc, envase) => envase?.kilos_fruta + acc, 0)?.toFixed(1);


  const pepa_calibrada = (tarjas_resultantes?.filter(tarja => {
    const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime();
    const diffHours = diffTime / (1000 * 3600);
    return diffHours <= 1;
  }).reduce((acc, tarja) => tarja.peso + acc, 0)!);
  
	const chartProps2: IChartProps = {
		series: [Number(pepa_calibrada), Number(kilos_totales_procesados),],
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
              <span className="text-center w-8/12 mx-auto">Total de envases a procesar: {envases_programa.filter(lote => lote.bin_procesado !== true).length} </span>
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
              <span>Fruta procesada en ultima hora: {kilos_totales_procesados} kgs</span>
            </div>
            <div className='w-full h-ful dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
              <span>Fruta calibrada en ultima hora: {pepa_calibrada} kgs.</span>
            </div>
          </div>

          <div className="w-full h-full">

            <Chart {...chartProps2} />
          </div>
        </CardBody>
      </Card>
    </div>
	);
};

export default CardFrutaIngresada;
