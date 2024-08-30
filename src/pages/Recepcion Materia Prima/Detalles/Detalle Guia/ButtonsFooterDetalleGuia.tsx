
import { Dispatch, FC, SetStateAction } from "react";
import Button, { IButtonProps } from "../../../../components/ui/Button";
import { TGuia } from "../../../../types/TypesRecepcionMP.types";


type TTabsText = 'Lotes Por Aprobar' | 'Lotes Aprobados' | 'Lotes Rechazados' 

export type TTabsguia = {
	text: TTabsText;
};

type TTabsKey = 'LP' | 'LA' | 'LR'

export type TTabsGuia = {
	[key in TTabsKey]: TTabsguia;
};

export const OPTIONS_GUIA: TTabsGuia = {
  LP: { text: 'Lotes Por Aprobar'},
  LA: { text: 'Lotes Aprobados' },
  LR: { text: 'Lotes Rechazados' },
};


interface IButtonsDetailGuiaProps {
	activeTab: TTabsguia;
	setActiveTab: Dispatch<SetStateAction<TTabsguia>>;
  guia_recepcion?: TGuia | null 
}

const ButtonsDetailGuia: FC<IButtonsDetailGuiaProps> = (props) => {
	const { activeTab, setActiveTab, guia_recepcion } = props;

	const defaultProps: IButtonProps = {
		size: 'sm',
		color: 'zinc',
		rounded: 'rounded-full',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
		variant: 'solid',
	};


	return (
		<div className='flex rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
			{Object.values(OPTIONS_GUIA).map((i) => (
        (i.text === 'Lotes Por Aprobar' && guia_recepcion?.estado_recepcion === '4')
        ? null // No renderizar el botón si la pestaña es "Lotes Procesados" y el estado de la guía no es '4'
        : (
            <Button
                key={i.text}
                {...(activeTab.text === i.text ? { ...activeProps } : { ...defaultProps })}
                onClick={() => setActiveTab(i)}
            >
                {i.text}
            </Button>
        )
    ))}
		</div>
	);
};

export default ButtonsDetailGuia;
