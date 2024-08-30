import { FC } from "react";
import { TTabs } from "../../../../types/TabsDashboardPrograma.types";
import { TTarjaResultante } from "../../../../types/TypesControlCalidad.type";
import { TEnvasesPrograma, TProduccion } from "../../../../types/TypesProduccion.types";
import Chart, { IChartProps } from "../../../../components/Chart";
import Card, { CardBody } from "../../../../components/ui/Card";

interface ICardFrutaCalibradaProps {
	programa: TProduccion
	envases_programa?: TEnvasesPrograma[]
	tarjas_resultantes?: TTarjaResultante[]
	activeTab: TTabs
}

const CardFrutaProcesadaUltimaHora: FC<ICardFrutaCalibradaProps> = ({envases_programa, tarjas_resultantes }) => {
	const now = new Date()

	const kilos_totales_procesados = envases_programa?.
		filter(envase => envase?.bin_procesado === true && envase.fecha_modificacion).
		filter(envase => {
			const diffTime = now.getTime() - new Date(envase.fecha_modificacion).getTime();
			const diffHours = diffTime / (1000 * 3600);
			return diffHours <= 1;
		}).
		reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1);


		const pepa_calibrada = (tarjas_resultantes?.filter(tarja => {
			const diffTime = now.getTime() - new Date(tarja.fecha_modificacion).getTime();
			const diffHours = diffTime / (1000 * 3600);
			return diffHours <= 1;
		}).reduce((acc, tarja) => tarja.peso + acc, 0)!);
		
		const totalKilosFrutaPrograma = envases_programa?.reduce((acc, lote) => lote.kilos_fruta + acc, 0);
		
		const pepaCalibradaPercentage = ((pepa_calibrada / (totalKilosFrutaPrograma || 1)) * 100).toFixed(2)

	const chartProps: IChartProps = {
		series: [Number(kilos_totales_procesados), Number(pepa_calibrada)],
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
		width: '100%',
		height: '250px',
	};
	return (
		<Card className="dark:bg-zinc-800 h-full">
			<CardBody className="w-full h-full flex flex-col md:flex-col lg:flex-row gap-y-5 lg:gap-2 ">

				<div className='w-full md:w-full lg:w-96 flex flex-col  gap-y-2 md:gap-2 lg:gap-2 '>
					<div className='w-full h-16 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Fruta procesada en ultima hora: {kilos_totales_procesados} kgs</span>
					</div>
					<div className='w-full h-16 dark:bg-zinc-700 bg-zinc-300	rounded-md flex items-center py-3.5 px-2'>
						<span>Fruta calibrada en ultima hora: {pepa_calibrada} kgs.</span>
					</div>
				</div>

				<div className="w-full md:7/12 lg:w-9/12 h-full">

					<Chart {...chartProps} />
				</div>
			</CardBody>
		</Card>
	);
};

export default CardFrutaProcesadaUltimaHora;
