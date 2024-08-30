import Card, { CardBody } from "../../../components/ui/Card";
import { FC } from "react";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import { TRendimiento } from "../../../types/TypesControlCalidad.type";
import { TTabsPro } from "../../../types/TabsDetalleProyeccion.types";
import { capitalizeWords } from "../../../utils/generalUtil";


interface ICardFrutaCalibradaProps {
  rendimiento?: TRendimiento
	activeTab: TTabsPro
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps> = ({ rendimiento }) => {
  const labels: string[] = Object.keys(rendimiento ? rendimiento?.cc_promedio_porcentaje_cc_pepa!: {}).map(capitalizeWords)
  const valores: number[] = Object.values(rendimiento?  rendimiento?.cc_promedio_porcentaje_cc_pepa!: {})



	return (
		<Card className="w-full h-full">
			<CardBody className="w-full h-full">
        <div className='flex flex-row'>
          <div className='flex flex-col md:flex-col w-full h-full '>
            <div className={`w-full h-[480px] border dark:border-zinc-700 px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
              <div className='lg:w-full h-hull'>
                <PieChart series={valores! || []} labels={labels! || []}/>
              </div>
              <div className='w-full flex flex-col justify-center mt-4 lg:mt-0'> 
                <h1 className='text-2xl text-center mb-5'>Detalle CC Pepa Calibrada</h1>
                <div className='grid grid-cols-4 gap-x-5 gap-y-2'>
                  <div className='md:col-span-2'>
                    <Label htmlFor='' className='text-center'>Mezcla Variedad</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.mezcla! * rendimiento?.cc_calculo_final?.kilos_brutos! / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.mezcla}%</span>
                    </div>
                  </div>
                  <div className='md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Daño Insecto</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.insecto! * rendimiento?.cc_calculo_final?.kilos_brutos! / 100).toFixed(1)} kgs  =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.insecto}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-2 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Hongo</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.hongo! * rendimiento?.cc_calculo_final.kilos_brutos! / 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.hongo}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-2 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Dobles</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.dobles! * rendimiento?.cc_calculo_final.kilos_brutos!/ 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.dobles}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Fuera Color</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.color! * rendimiento?.cc_calculo_final.kilos_brutos!/ 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.color}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-3 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Vana Deshidratada</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.vana! * rendimiento?.cc_calculo_final.kilos_brutos!/ 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.vana}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-4 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Punto Goma</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.pgoma! * rendimiento?.cc_calculo_final.kilos_brutos!/ 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.pgoma}%</span>
                    </div>
                  </div>
                  <div className='md:row-start-4 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Goma</Label>
                    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa?.goma! * rendimiento?.cc_calculo_final.kilos_brutos!/ 100).toFixed(1)} kgs =</span>
                      <span>{rendimiento?.cc_promedio_porcentaje_cc_pepa.goma}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
			</CardBody>
		</Card>
	);
};

export default CardFrutaCalibrada;
