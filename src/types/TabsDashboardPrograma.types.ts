type TTabsText = 'General' | 'Envases de Lotes Seleccionados' | 'Operarios en Programa' | 'Tarja Resultante'

export type TTabs = {
	text: TTabsText;
};

type TTabsKey = 'GN' | 'ELS' | 'OP' | 'TR'

export type TTabsK = {
	[key in TTabsKey]: TTabs;
};

export const OPTIONS: TTabsK = {
  GN: { text: 'General'},
  ELS: { text: 'Envases de Lotes Seleccionados' },
  OP: { text: 'Operarios en Programa' },
  TR: { text: 'Tarja Resultante' },
};
