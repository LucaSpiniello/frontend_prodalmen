import Card, { CardBody } from "../../../components/ui/Card";
import { FC } from "react";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import { TRendimiento } from "../../../types/TypesControlCalidad.type";
import { TTabsPro } from "../../../types/TabsDetalleProyeccion.types";
import { transformLabel } from "../../../utils/generalUtil";


interface ICardFrutaCalibradaProps {
  rendimiento: TRendimiento
	activeTab: TTabsPro
}

const CardFrutaCalibrada: FC<ICardFrutaCalibradaProps> = ({ rendimiento }) => {
  const labels: string[] = Object.keys(rendimiento ? rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas!: {}).map(transformLabel)
  const valores: number[] = Object.values(rendimiento ? rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas!: {})



	return (
		<Card className="w-full h-full ">
			<CardBody className="w-full h-full">
        <div className='flex flex-row-reverse'>
          <div className='flex flex-col md:flex-col w-full h-full '>
            <div className={`w-full h-[480px] border dark:border-zinc-700 px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
              <div className='lg:w-full h-hull'>
                <PieChart series={valores! || []} labels={labels! || []}/>
              </div>
              <div className='w-full h-full flex flex-col justify-center lg:mt-0 '> 
                <h1 className='text-2xl text-center mb-2'>Detalle CC Pepa Calibrada</h1>
                <div className='grid grid-cols-4 gap-x-5 gap-y-2'>
                  <div className='md:col-span-2'>
                    <Label htmlFor='' className='text-center'>Pre Calibre</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.precalibre! * rendimiento?.cc_calculo_final?.final_exp! / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 18-20</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_18_20 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-2 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 20-22</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_20_22 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-2 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 23-25</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_23_25 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 25-27</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_25_27 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-3 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 27-30</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_27_30 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-4 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 30-32</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_30_32 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-4 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 32-34</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_32_34 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-5 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 34-36</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_34_36 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>
                  <div className='md:row-start-5 md:col-start-3 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 36-40</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_36_40 * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
                    </div>
                  </div>

                  <div className='md:row-start-6 md:col-span-2 '>
                    <Label htmlFor='' className='text-center'>Calibre 40-Más</Label>
                    <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                      <span>{(rendimiento?.cc_promedio_porcentaje_cc_pepa_calibradas?.calibre_40_mas * rendimiento?.cc_calculo_final?.final_exp / 100).toFixed(2)} kgs</span>
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
