import Card, { CardBody } from "../../../components/ui/Card";
import { FC } from "react";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import { TRendimiento } from "../../../types/TypesControlCalidad.type";
import { TTabsPro } from "../../../types/TabsDetalleProyeccion.types";
import { capitalizeWords } from "../../../utils/generalUtil";


interface ICardFrutaCalibradaProps {
  rendimiento: TRendimiento
	activeTab: TTabsPro
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps> = ({ rendimiento }) => {
  const labels: string[] = Object.keys(rendimiento ? rendimiento?.cc_promedio_porcentaje_muestras!: {}).map(capitalizeWords)
  const valores: number[] = Object.values(rendimiento ? rendimiento?.cc_promedio_porcentaje_muestras!: {})



	return (
		<Card className="w-full h-full">
			<CardBody className="w-full h-full">
        <div className='flex flex-row-reverse'>
          <div className='flex flex-col md:flex-col w-full h-full'>
            <div className={`w-full flex flex-col lg:flex-row items-center justify-center rounded-md`}>
              <div className='lg:w-full h-hull'>
                <PieChart series={valores! || []} labels={labels! || []}/>
              </div>

              <div className='w-full h-full flex flex-col mt-5'> 
                <h1 className='text-2xl text-center mb-5 font-semibold'>Detalle CC Pepa Calibrada</h1>
                <div className='flex flex-col md:flex-row lg:flex-row gap-2'>
                  <section className="w-full flex flex-col md:flex-row lg:flex-row flex-wrap">
                    <article className="w-full flex flex-col md:flex-row lg:flex-row gap-2">
                      <div className="w-full">
                        <Label htmlFor='' className='text-center'>Basura</Label>
                        <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                          <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.basura! * rendimiento?.cc_calculo_final?.kilos_netos! / 100).toFixed(1)} kgs =</span>
                          <span>{rendimiento?.cc_promedio_porcentaje_muestras.basura}%</span>
                        </div>
                      </div>

                      <div className="w-full">
                        <Label htmlFor='' className='text-center'>Cascara</Label>
                        <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                          <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.cascara * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                          <span>{rendimiento?.cc_promedio_porcentaje_muestras.cascara}%</span>
                        </div>
                      </div>
                      
                    </article>

                    <article className="w-full flex flex-col md:flex-row lg:flex-row gap-2">
                      <div className='w-full'>
                        <Label htmlFor='' className='text-center'>Ciega</Label>
                        <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'> 
                          <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.ciega * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                          <span>{rendimiento?.cc_promedio_porcentaje_muestras.ciega}%</span>
                        </div>
                      </div>

                      <div className='w-full'>
                        <Label htmlFor='' className='text-center'>Pelon</Label>
                        <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                          <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.pelon * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                          <span>{rendimiento?.cc_promedio_porcentaje_muestras.pelon}%</span>
                        </div>
                      </div>
                      
                    </article>

                    <article className="w-full flex flex-col md:flex-row lg:flex-row gap-2">
                      <div className='w-full'>
                        <Label htmlFor='' className='text-center'>Huerto</Label>
                        <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                          <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.pepa_huerto * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                          <span>{rendimiento?.cc_promedio_porcentaje_muestras.pepa_huerto}%</span>
                        </div>
                      </div>
                      <div className='w-full'>
                        <Label htmlFor='' className='text-center'>Pepa Bruta</Label>
                        <div className='flex gap-2 items-center justify-center bg-green-700 py-2 px-3 rounded-md text-white'>
                          <span>{(rendimiento?.cc_promedio_porcentaje_muestras?.pepa_bruta * rendimiento?.cc_calculo_final?.kilos_netos / 100).toFixed(1)} kgs =</span>
                          <span>{rendimiento?.cc_promedio_porcentaje_muestras?.pepa_bruta!}%</span>
                        </div>
                      </div>
                    </article>

                  </section>

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
