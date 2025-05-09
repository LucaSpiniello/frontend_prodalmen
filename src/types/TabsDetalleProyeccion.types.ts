type TTabsText = 'Calibres Pepa' | 'Tabla Informativa' | 'Control Pepa' | 'Muestra Control' | 'Resultados Rendimiento' | 'Calidades Pepa';

export type TTabsPro = {
	text: TTabsText;
};

type TTabsKey = 'CP' | 'TD' | 'CPE' | 'MC' | 'RR' | 'CL';

export type TTabsK = {
	[key in TTabsKey]: TTabsPro;
};

export const OPTIONSPRO: TTabsK = {
  CP: { text: 'Calibres Pepa'},
  CPE: { text: 'Control Pepa'},
  MC: { text: 'Muestra Control'},
  TD: { text: 'Tabla Informativa' },
  RR: { text: 'Resultados Rendimiento' },
  CL: { text: 'Calidades Pepa' },
};
