export type TDarkModeKEY = 'DARK' | 'LIGHT'
export type TDarkMode = 'dark' | 'light' 

export type TDarkModes = {
	[key in TDarkModeKEY]: TDarkMode;
};
