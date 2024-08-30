import React, { Dispatch, FC, SetStateAction } from 'react';
import Button, { IButtonProps } from '../../../../components/ui/Button';

type TTabsText = 'Clientes' | 'Sucursales' | 'Cuentas Corrientes' | 'Representantes'

export type TTabsClientes = {
  text: TTabsText;
};

type TTabsKey =  'CT' | 'SR' | 'CC' | 'R'

export type TTabsKPedido = {
  [key in TTabsKey]: TTabsClientes;
};

export const OPTIONS_CLIENTES: TTabsKPedido = {
  CT: { text: 'Clientes' },
  SR: { text: 'Sucursales' },
  CC: { text: 'Cuentas Corrientes' },
  R: { text: 'Representantes' }
};

interface IButtonsClientesProps {
  activeTab: TTabsClientes;
  setActiveTab: Dispatch<SetStateAction<TTabsClientes>>
  tipo_cliente?: string 
}

const ButtonsClientes: FC<IButtonsClientesProps> = ({ activeTab, setActiveTab, tipo_cliente }) => {
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

  console.log("Tipo Cliente:", tipo_cliente);

  return (
    <div className='flex rounded-full border-2 border-zinc-500/20 p-1 drop-shadow-xl dark:border-zinc-800'>
      {Object.values(OPTIONS_CLIENTES)
        .filter(i => {
          console.log("Evaluating:", i.text);
          if (tipo_cliente === 'clienteexportacion') {
            console.log("Excluding Cuentas Corrientes and Representantes for cliente_exportacion");
            return i.text !== 'Cuentas Corrientes' && i.text !== 'Representantes';
          }
          return true;
        })
        .map(i => (
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

export default ButtonsClientes;
