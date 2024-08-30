import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';

type TTabsText = 'Fruta Solicitada' | 'Fruta En Pedido'

export type TTabsPedidos = {
  text: TTabsText;
};

type TTabsKey =  'FS' | 'FEP' 

export type TTabsKPedido = {
  [key in TTabsKey]: TTabsPedidos;
};

export const OPTIONS_PEDIDO: TTabsKPedido = {
  FS: { text: 'Fruta Solicitada' },
  FEP: { text: 'Fruta En Pedido' },
};

interface IButtonsGuiaSalidaProps {
  activeTab: TTabsPedidos;
  setActiveTab: Dispatch<SetStateAction<TTabsPedidos>>
  retira_cliente: boolean | undefined
}

const ButtonsGuiaSalida: FC<IButtonsGuiaSalidaProps> = ({ activeTab, setActiveTab, retira_cliente }) => {
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
        (!retira_cliente) && (
          <Button
            key={i.text}
            {...(activeTab.text === i.text ? activeProps : defaultProps)}
            onClick={() => setActiveTab(i)}
          >
            {i.text}
          </Button>
        )
      ))}
    </div>
  );
};

export default ButtonsGuiaSalida;

