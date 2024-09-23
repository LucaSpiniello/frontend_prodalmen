import Card, { CardBody } from "../../../components/ui/Card";
import { FC } from "react";
import Label from "../../../components/form/Label";
import PieChart from "../../../components/charts/PieChart";
import { transformLabel } from "../../../utils/generalUtil";


const CardFrutaCalibradaSeleccion: FC<any> = ({ programa }) => {
  // Verificar si el objeto 'programa' y 'calibres' existe antes de proceder
  const labels: string[] = Object.keys(programa?.calibres || {}).map(transformLabel);
  const valores: number[] = Object.values(programa?.calibres || {}).map((calibre: any) => calibre.kilos);

  return (
    <Card className="w-full h-full">
      <CardBody className="w-full h-full">
        <div className="flex flex-row-reverse">
          <div className="flex flex-col md:flex-col w-full h-full">
            <div className="w-full h-[480px] border dark:border-zinc-700 px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1">
              <div className="lg:w-full h-full">
                {/* Gráfico de torta mostrando los calibres */}
                <PieChart series={valores || []} labels={labels || []} />
              </div>
              <div className="w-full h-full flex flex-col justify-center lg:mt-0">
                <h1 className="text-2xl text-center mb-2">Detalle Real Fruta Calibrada</h1>
                <div className="grid grid-cols-4 gap-x-5 gap-y-2">

                  {/* Verificar si 'calibres' existe antes de iterar */}
                  {programa?.calibres && Object.entries(programa.calibres).length > 0 ? (
                    Object.entries(programa.calibres).map(([calibre, data], index) => {
                      const { kilos, pct } = data as { kilos: number, pct: number }; // Casting explícito a tipo esperado
                      return (
                        <div key={index} className={`md:col-span-2 ${index % 2 === 0 ? '' : 'md:col-start-3'}`}>
                          <Label htmlFor="" className="text-center">{`Calibre ${calibre}`}</Label>
                          <div className="flex flex-col items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md">
                            {/* Mostrar los kilos y el porcentaje */}
                            <span>{`${kilos.toFixed(1)} kgs`}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 text-center">
                      <span>No hay datos de calibres disponibles</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardFrutaCalibradaSeleccion;
