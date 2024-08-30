import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';

type TTabsText = 'Información Transportista' | 'Fruta en Despacho' | 'Dirección'

export type TTabsDespacho = {
  text: TTabsText;
};

type TTabsKey =  'IT' | 'FED' | 'D'

export type TTabsKPedido = {
  [key in TTabsKey]: TTabsDespacho;
};

export const OPTIONS_DESPACHO: TTabsKPedido = {
  D: {text: 'Dirección'},
  IT: { text: 'Información Transportista' },
  FED: { text: 'Fruta en Despacho' },
};

interface IButtonsDespachoProps {
  activeTab: TTabsDespacho;
  setActiveTab: Dispatch<SetStateAction<TTabsDespacho>>
}

const ButtonsDespacho: FC<IButtonsDespachoProps> = ({ activeTab, setActiveTab }) => {
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
      {Object.values(OPTIONS_DESPACHO).map((i) => (
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

export default ButtonsDespacho;

