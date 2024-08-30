import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { TTabs } from "../../../../types/TabsDashboardPrograma.types";
import { TTarjaResultante } from "../../../../types/TypesControlCalidad.type";
import { TProduccion } from "../../../../types/TypesProduccion.types";
import Chart, { IChartProps } from "../../../../components/Chart";
import Card, { CardBody } from "../../../../components/ui/Card";



interface ICardFrutaCalibradaProps {
	programa: TProduccion
	tarjas_resultantes?: TTarjaResultante[]
	activeTab: TTabs
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps>= ({ tarjas_resultantes  }) => {
	const pepa_calibrada = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const pepa_borrel = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)

	const pepa_total = pepa_calibrada! + pepa_borrel! 

	const pepa_calibrada_porcentaje = Number(((pepa_calibrada ?? 0) / (pepa_total || 1) * 100).toFixed(2))
	const pepa_borrel_porcentaje = Number(((pepa_borrel ?? 0) / (pepa_total || 1) * 100).toFixed(2))



	const chartProps: IChartProps = {
		series: [{
			name: 'Kilos',
			data: [Number(pepa_calibrada_porcentaje), Number(pepa_borrel_porcentaje)],
		}],
		options: {
			chart: {
				type: 'bar',
				height: 250,
			},
			plotOptions: {
				bar: {
					horizontal: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				categories: [`Fruta Calibrada ${pepa_calibrada_porcentaje} %`, `Borrel ${pepa_borrel_porcentaje} %`],
			},
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
		},
		type: 'bar',
		width: '100%',
		height: '200px',
	};



	return (
		<Card className="h-full w-full">
			<CardBody className="w-full h-full flex flex-col md:flex-col lg:flex-row-reverse gap-y-5 lg:gap-2">
				<div className='w-full md:w-full lg:w-96 flex flex-col justify-between gap-y-2 md:gap-2 lg:gap-2 '>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Fruta Calibrada: {pepa_calibrada} kgs.</span>
					</div>
					<div className='w-full h-full dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Borrel: {pepa_borrel} kgs</span>
					</div>
				</div>

				<div className="w-full md:7/12 lg:w-9/12 h-full">
					<Chart {...chartProps} />
				</div>
			</CardBody>
		</Card>
	);
};

export default CardFrutaCalibrada;
