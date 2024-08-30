import Card, { CardBody } from "../../../components/ui/Card";
import { FC } from "react";
import TablaInformativa from "./TablaInformativa.tabla";
import { TControlCalidad } from "../../../types/TypesControlCalidad.type";
import { TTabsPro } from "../../../types/TabsDetalleProyeccion.types";


interface ICardTablaInformativaProps {
	activeTab: TTabsPro
	filtro: string
}

const CardTablaInformativa: FC<ICardTablaInformativaProps> = ({ filtro }) => {

	return (
		<Card className="w-full h-full">
			<CardBody className="w-full h-full">
        <TablaInformativa filtro={filtro}/>
			</CardBody>
		</Card>
	);
};

export default CardTablaInformativa;
