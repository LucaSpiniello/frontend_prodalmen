import Button, { IButtonProps } from "../../../../components/ui/Button";
import { Dispatch, FC, SetStateAction } from "react";
import { OPTIONS_RP, TTabsRP } from "../../../../types/TypesReproceso.types";


interface IButtonsReprocesoProps {
	activeTab: TTabsRP;
	setActiveTab: Dispatch<SetStateAction<TTabsRP>>;
}

const ButtonsReproceso: FC<IButtonsReprocesoProps> = (props) => {
	const { activeTab, setActiveTab } = props;

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
		<div className='flex flex-col w-full md:w-auto lg:w-auto md:flex-row lg:flex-row rounded-full md:border-2 lg:border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
			{Object.values(OPTIONS_RP).map((i) => (
				<Button
				//@ts-ignore
					key={i.text}
					// eslint-disable-next-line react/jsx-props-no-spreading
					//@ts-ignore
					{...(activeTab.text === i.text ? { ...activeProps } : { ...defaultProps })}
					onClick={() => {
						//@ts-ignore
						setActiveTab(i);
					}}>
					{i.text}
				</Button>
			))}
		</div>
	);
};

export default ButtonsReproceso;
