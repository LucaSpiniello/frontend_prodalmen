import Card, { CardBody } from "../../../components/ui/Card";
import { FC } from "react";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import { TTabsPro } from "../../../types/TabsDetalleProyeccion.types";
import { capitalizeWords } from "../../../utils/generalUtil";

interface ICardFrutaCalibradaProps {
  rendimiento?: any // El nuevo diccionario con "perdidas"
  activeTab: TTabsPro
}

const CardFrutaPerdidasSeleccion: FC<ICardFrutaCalibradaProps> = ({ rendimiento }) => {
  const labels: string[] = ["Trozo", "Picada", "Hongo", "Insecto", "Dobles", "Punto Goma", "Basura", "Mezcla", "Color", "Goma"];
  const valores: number[] = [
    rendimiento?.perdidas?.trozo_pct || 0,
    rendimiento?.perdidas?.picada_pct || 0,
    rendimiento?.perdidas?.hongo_pct || 0,
    rendimiento?.perdidas?.insecto_pct || 0,
    rendimiento?.perdidas?.dobles_pct || 0,
    rendimiento?.perdidas?.p_goma_pct || 0,
    rendimiento?.perdidas?.basura_pct || 0,
    rendimiento?.perdidas?.mezcla_pct || 0,
    rendimiento?.perdidas?.color_pct || 0,
    rendimiento?.perdidas?.goma_pct || 0
  ];

  return (
    <Card className="w-full h-full">
      <CardBody className="w-full h-full">
        <div className='flex flex-row'>
          <div className='flex flex-col md:flex-col w-full h-full'>
            <div className={`w-full h-[480px] border dark:border-zinc-700 px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
              <div className='lg:w-full h-full'>
                <PieChart series={valores! || []} labels={labels! || []} />
              </div>
              <div className='w-full flex flex-col justify-center mt-4 lg:mt-0'>
                <h1 className='text-2xl text-center mb-5'>Detalle Pérdidas</h1>
                <div className='grid grid-cols-4 gap-x-5 gap-y-2'>
                  <RenderDetail label="Trozo" kilos={rendimiento?.perdidas?.trozo_kilos} porcentaje={rendimiento?.perdidas?.trozo_pct} />
                  <RenderDetail label="Picada" kilos={rendimiento?.perdidas?.picada_kilos} porcentaje={rendimiento?.perdidas?.picada_pct} />
                  <RenderDetail label="Hongo" kilos={rendimiento?.perdidas?.hongo_kilos} porcentaje={rendimiento?.perdidas?.hongo_pct} />
                  <RenderDetail label="Insecto" kilos={rendimiento?.perdidas?.insecto_kilos} porcentaje={rendimiento?.perdidas?.insecto_pct} />
                  <RenderDetail label="Dobles" kilos={rendimiento?.perdidas?.dobles_kilos} porcentaje={rendimiento?.perdidas?.dobles_pct} />
                  <RenderDetail label="Punto Goma" kilos={rendimiento?.perdidas?.p_goma_kilos} porcentaje={rendimiento?.perdidas?.p_goma_pct} />
                  <RenderDetail label="Basura" kilos={rendimiento?.perdidas?.basura_kilos} porcentaje={rendimiento?.perdidas?.basura_pct} />
                  <RenderDetail label="Mezcla" kilos={rendimiento?.perdidas?.mezcla_kilos} porcentaje={rendimiento?.perdidas?.mezcla_pct} />
                  <RenderDetail label="Color" kilos={rendimiento?.perdidas?.color_kilos} porcentaje={rendimiento?.perdidas?.color_pct} />
                  <RenderDetail label="Goma" kilos={rendimiento?.perdidas?.goma_kilos} porcentaje={rendimiento?.perdidas?.goma_pct} />
                </div>
                <div className='mt-8 flex flex-col items-center justify-center gap-4'>
                  <div className='text-center text-2xl font-bold text-green-600'>
                    Total Kilos Pepa: {rendimiento?.perdidas?.kilos_total?.toFixed(1)} kgs
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

// Componente auxiliar para evitar la repetición de código
const RenderDetail: FC<{ label: string, kilos: number, porcentaje: number }> = ({ label, kilos, porcentaje }) => (
  <div className='md:col-span-2'>
    <Label htmlFor='' className='text-center'>{label}</Label>
    <div className='flex gap-2 items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
      <span>{(kilos ?? 0).toFixed(1)} kgs =</span>
      <span>{(porcentaje ?? 0).toFixed(1)}%</span>
    </div>
  </div>
);

export default CardFrutaPerdidasSeleccion;