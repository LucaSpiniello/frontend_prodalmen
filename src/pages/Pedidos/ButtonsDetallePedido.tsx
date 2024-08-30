import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../components/ui/Button';

type TTabsTextP = 'Fruta Solicitada' | 'Fruta En Pedido'

export type TTabsPedidos = {
  text: TTabsTextP;
};

type TTabsKey =  'FS' | 'FEP'

export type TTabsKPedido = {
  [key in TTabsKey]: TTabsPedidos;
};

export const OPTIONS_PEDIDO: TTabsKPedido = {
  FS: { text: 'Fruta Solicitada' },
  FEP: { text: 'Fruta En Pedido' },
};

interface IButtonsProduccionProps {
  activeTab: TTabsPedidos;
  setActiveTab: Dispatch<SetStateAction<TTabsPedidos>>
  retira_cliente: boolean | undefined
}

const ButtonsProduccion: FC<IButtonsProduccionProps> = ({ activeTab, setActiveTab }) => {
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
      {Object.values(OPTIONS_PEDIDO).map((i) => (
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

export default ButtonsProduccion;

