
import { Dispatch, FC, SetStateAction } from "react";
import Button, { IButtonProps } from "../../../components/ui/Button";
import { TTabsKOp, TTabsOp } from "../../../types/TabsDetalleOperario";


interface IButtonsDetailOpProps {
	activeTab: TTabsOp;
	setActiveTab: Dispatch<SetStateAction<TTabsOp>>;
}

const ButtonsDetailOp: FC<IButtonsDetailOpProps> = (props) => {
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


	const OPTIONS: TTabsKOp = {
		IO: { text: 'Información Operario' },
		SO: { text: 'Skills Operario' },
	};

	return (
		<div className='flex rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
			{Object.values(OPTIONS).map((i) => (
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

export default ButtonsDetailOp;
