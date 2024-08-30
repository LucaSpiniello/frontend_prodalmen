import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../../components/ui/Button';

type TTabsText = 'Clientes Mercado Interno' | 'Clientes Exportación'

export type TTabsTableClientes = {
  text: TTabsText;
};

type TTabsKey =  'CMI' | 'CE'

export type TTabsTableCliente = {
  [key in TTabsKey]: TTabsTableClientes;
};

export const OPTIONS_TABLA_CLIENTES: TTabsTableCliente = {
  CMI: { text: 'Clientes Mercado Interno' },
  CE: { text: 'Clientes Exportación' },
};

interface IButtonsTablaClientesProps {
  activeTab: TTabsTableClientes;
  setActiveTab: Dispatch<SetStateAction<TTabsTableClientes>>
  tipo_cliente?: string 
}

const ButtonsTablaClientes: FC<IButtonsTablaClientesProps> = ({ activeTab, setActiveTab }) => {
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
      {Object.values(OPTIONS_TABLA_CLIENTES).map(i => (
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

export default ButtonsTablaClientes;
