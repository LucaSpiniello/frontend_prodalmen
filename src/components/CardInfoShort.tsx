import React, { FC } from 'react';
import Card, { CardBody } from './ui/Card';
import Icon from './icon/Icon';
import Tooltip from './ui/Tooltip';
import Balance from './Balance';
import { TProgramasInfo } from '../types/coreTypes.type';
import { MdFactory } from "react-icons/md";
import PickUp from './icon/svg-icons/CustomPickUp';

interface CardProps {
	data?: TProgramasInfo | undefined
}

const CardInfoShort: FC<CardProps> = ({ data }) => {

	


	return (
		<Card>
			<CardBody>
				<div className='flex flex-col gap-2 px-5'>
					<div className='w-full flex items-center justify-between'>
						<div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
							{
								data?.tipo_programa === 'Produccion'
									? <MdFactory className='text-4xl'/>
									: data?.tipo_programa === 'Reproceso'
										? <MdFactory className='text-4xl'/>
										: data?.tipo_programa === 'Seleccion'
											? <PickUp fill="white" stroke="black" width="200pt" height="220pt"/>
											: null
							}
						</div>
						<span className='text-2xl'>{data?.tipo_programa}</span>
					</div>
					<div className='w-full flex items-center justify-between'>
						<div className='flex flex-col items-center'>
							<span className='font-semibold text-lg'>Kilos Ingresados: </span>
							<span>{data?.total_kilos_introducidos}</span>
						</div>
						<div className='flex flex-col items-center'>
							<span className='font-semibold text-lg'>Kilos Resultantes</span>
							<span>{data?.total_kilos_resultantes}</span>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default CardInfoShort
