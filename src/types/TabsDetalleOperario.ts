type TTabsText = 'Información Operario' | 'Skills Operario' 

export type TTabsOp = {
	text: TTabsText;
};

type TTabsKey = 'IO' | 'SO'

export type TTabsKOp = {
	[key in TTabsKey]: TTabsOp;
};

export const OPTIONS: TTabsKOp = {
  IO: { text: 'Información Operario'},
  SO: { text: 'Skills Operario' },
};
