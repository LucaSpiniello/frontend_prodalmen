import { useEffect } from "react"
import Chart, { IChartProps } from "../../../components/Chart"
import Card, { CardBody } from "../../../components/ui/Card"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { useAuth } from "../../../context/authContext"
import { fetchBinsPepaCalibrada, fetchTarjasSeleccionadas } from "../../../redux/slices/seleccionSlice"
import { useParams } from "react-router-dom"
import Container from "../../../components/layouts/Container/Container"
import Label from "../../../components/form/Label"
import { calculateDateDifference } from "../../../utils/generalUtil"


const CardHeaderGeneral = () => {
  const bins_en_embalaje = useAppSelector((state: RootState) => state.embalaje.bin_en_programa)
  const programa_embalaje = useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual)

  const totales_kilos_en_programa = (bins_en_embalaje?.reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 1)
  
  const kilos_totales_ingresados_porcentual = (bins_en_embalaje?.length ?
  (((bins_en_embalaje.reduce((acc, bin) => (bin?.kilos_fruta || 0) + acc, 0) / totales_kilos_en_programa) * 100)?.toFixed(2) ?? 0)
  : 0)

  const kilos_totales_ingresados = (bins_en_embalaje?.filter(bin => bin.procesado === true)?.
    reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 0)


  const kilos_totales_procesados_porcentual =((((bins_en_embalaje?.filter(bin => bin.procesado))?.
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

  // // Combina los datos de las series y las opciones en un objeto props
  const chartProps: IChartProps = {
    series: [{
      name: 'Kilos',
      data: seriesData,
    }],
    options: optionsData as any,
    type: 'bar',
    width: '100%', // Puedes ajustar el ancho y alto según tus necesidades
    height: '280px',
  };

  // const now = new Date()

  // const kilos_totales_procesados_ultima_hora = bins_calibrados?.
  //   filter(bin => bin.bin_procesado === true && bin.fecha_modificacion).
  //   filter(bin => {
  //     const diffTime = now.getTime() - new Date(bin.fecha_modificacion).getTime()
  //     const diffHours = diffTime / (1000 * 3600)
  //     return diffHours <= 1
  //   }).
  //   reduce((acc, bin) => bin.kilos_fruta + acc, 0)?.toFixed(2)


  // const tarja_calibrada = (tarjas_bin_selecciondas.
  //   filter(tarja => {
  //     const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime()
  //     const diffHour = diffTime / (1000 * 3600)
  //     return diffHour <= 1
  //   })).
  //   reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)?.toFixed(2)
  
	// const chartProps2: IChartProps = {
	// 	series: [Number(tarja_calibrada), Number(kilos_totales_procesados_ultima_hora),],
	// 	options: {
	// 		chart: {
	// 			type: 'donut',
	// 		},
	// 		labels: ['Fruta calibrada', 'Fruta procesada'],
	// 		responsive: [{
	// 			options: {
	// 				legend: {
	// 					position: 'bottom'
	// 				}
	// 			}
	// 		}],
	// 	},
	// 	type: 'donut',
	// 	width: '90%',
	// 	height: '200px',
	// };


	return (
		<Container breakpoint={null} className="w-full h-full !p-0">
      <div className="flex flex-col md:flex-col lg:flex-row gap-2">
        <Card className="w-full h-full py-2.5">
          <CardBody className="w-full h-full flex flex-col md:flex-col gap-y-5 lg:gap-2">
            <div className='w-full flex justify-between gap-y-2 md:gap-2 lg:gap-2 '>
              <div className='w-full py-3 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center '>
                <span className="text-center mx-auto">Fruta en producción: {(totales_kilos_en_programa)?.toFixed(2)} kgs</span>
              </div>
              <div className='w-full py-3 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center '>
                <span className="text-center mx-auto">Fruta Procesada: {(kilos_totales_ingresados)?.toFixed(2)} kgs.</span>
              </div>
              <div className='w-full py-3 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center '>
                <span className="text-center mx-auto">Total de envases a procesar: {bins_en_embalaje?.filter(bin => bin.procesado !== true).length} </span>
              </div>
            </div>
            <div className="w-full h-full">
              <Chart {...chartProps} />
            </div>
          </CardBody>
        </Card>

        <Card className="w-full h-full">
          <CardBody className="w-full h-full flex justify-between gap-4">
            <div className="w-full flex flex-col">
              <span className="text-lg text-center">Fruta por Embalar</span>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="producto_embalar" className="text-lg">Producto a Embalar</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.tipo_producto_label}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="variedad" className="text-lg">Variedad</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.variedad_label}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="calidad" className="text-lg">Calidad</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.calidad_label}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="formato_embalaje" className="text-lg">Formato Embalaje</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.tipo_embalaje_label}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="kilos_solicitados" className="text-lg">Kilos Solicitados</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{(programa_embalaje?.kilos_solicitados ?? 0).toLocaleString()} Kgs</span>
                </div>
              </div>

            </div>

            <div className='w-full flex flex-col'>
              <span className="text-lg text-center">Estadistica del Programa</span>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="producto_embalar" className="text-lg">Tiempo del Programa</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{calculateDateDifference(programa_embalaje?.fecha_creacion)}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="kilos_resultantes" className="text-lg">Kilos Resultantes</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.kilos_resultantes}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="producto_embalar" className="text-lg">Kilos Faltantes</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.kilos_faltantes}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="producto_embalar" className="text-lg">Kilos Sobrantes</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{programa_embalaje?.kilos_sobrantes}</span>
                </div>
              </div>

              <div className='w-full h-full flex-col rounded-md flex py-2'>
                <Label htmlFor="producto_embalar" className="text-lg">Porcentaje Merma</Label>
                <div className="dark:bg-zinc-700 bg-zinc-300 p-2 rounded-md">
                  <span className="text-lg">{(programa_embalaje?.merma_porcentual ?? 0)}</span>
                </div>
              </div>
            </div>


          </CardBody>
        </Card>
      </div>
    </Container>
	);
};

export default CardHeaderGeneral;
