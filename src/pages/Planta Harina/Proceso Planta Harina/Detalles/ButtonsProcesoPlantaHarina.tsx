import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../../components/ui/Button';

type TTabsText = 'General' | 'Bins Para Procesar' | 'Operarios Planta Harina' | 'Bin Resultante' | 'Variables' | 'Rechazo'

export type TTabsPH = {
  text: TTabsText;
}

type TTabsKey = 'GN' | 'BPP' | 'OPH' | 'VRB' | 'RCZ' | 'BR'

export type TTabsKPH = {
  [key in TTabsKey]: TTabsPH;
}

export const OPTIONS_PH: TTabsKPH = {
  GN: { text: 'General'},
  BPP: { text: 'Bins Para Procesar' },
  OPH: { text: 'Operarios Planta Harina' },
  RCZ: { text: 'Rechazo' },
  VRB: { text: 'Variables' },
  BR: { text: 'Bin Resultante' },
}

interface IButtonsPlantaHarinaProps {
  activeTab: TTabsPH;
  setActiveTab: Dispatch<SetStateAction<TTabsPH>>
}

const ButtonsPlantaHarina: FC<IButtonsPlantaHarinaProps> = ({ activeTab, setActiveTab }) => {
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
      {Object.values(OPTIONS_PH).map((i) => (
        <Button
        key={i.text}
        {...(activeTab.text === i.text ? activeProps : defaultProps)}
        onClick={() => setActiveTab(i)}
      >
        {i.text}
      </Button>
      ))}
    </div>
  );
};

export default ButtonsPlantaHarina;

