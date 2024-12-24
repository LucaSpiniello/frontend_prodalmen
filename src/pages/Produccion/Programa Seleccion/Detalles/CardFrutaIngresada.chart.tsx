import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { TTabs } from "../../../../types/TabsDashboardPrograma.types"
import { TTarjaResultante } from "../../../../types/TypesControlCalidad.type"
import { TEnvasesPrograma, TProduccion } from "../../../../types/TypesProduccion.types"
import Chart, { IChartProps } from "../../../../components/Chart"
import Card, { CardBody } from "../../../../components/ui/Card"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchBinsPepaCalibrada, fetchTarjasSeleccionadas } from "../../../../redux/slices/seleccionSlice"
import { useParams } from "react-router-dom"
import Container from "../../../../components/layouts/Container/Container"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const CardDetalleProgramaSeleccion = () => {
  const tarjas_bin_selecciondas = useAppSelector((state: RootState) => state.seleccion.tarjas_seleccionadas)
  const bins_calibrados = useAppSelector((state: RootState) => state.seleccion.bins_pepas_calibradas)
  const programa_seleccion = useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const totales_kilos_en_programa = (bins_calibrados?.reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 1)
  const kilos_totales_ingresados = (bins_calibrados?.filter(bin => bin.bin_procesado === true)?.
  reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 0)


  const seriesData = [Number(programa_seleccion?.kilos_porcentaje?.bins_sin_procesar), Number(programa_seleccion?.kilos_porcentaje?.bins_procesados)]
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
      categories: [`Fruta Ingresada ${Number(programa_seleccion?.kilos_porcentaje?.bins_sin_procesar)} %`, `Fruta Procesada ${Number(programa_seleccion?.kilos_porcentaje?.bins_procesados  )} %`],
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

  const kilos_totales_procesados_ultima_hora = bins_calibrados?.
    filter(bin => bin.bin_procesado === true && bin.fecha_modificacion).
    filter(bin => {
      const diffTime = now.getTime() - new Date(bin.fecha_modificacion).getTime()
      const diffHours = diffTime / (1000 * 3600)
      return diffHours <= 1
    }).
    reduce((acc, bin) => bin.kilos_fruta + acc, 0)?.toFixed(2)


  const tarja_calibrada = (tarjas_bin_selecciondas.
    filter(tarja => {
      const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime()
      const diffHour = diffTime / (1000 * 3600)
      return diffHour <= 1
    })).
    reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)?.toFixed(2)
  
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


	return (
		<Container breakpoint={null} className="w-full h-full !p-0">
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
                <span className="text-center w-8/12 mx-auto">Total de bins a procesar: {bins_calibrados?.filter(bin => bin.bin_procesado === true).length} </span>
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

export default CardDetalleProgramaSeleccion;
