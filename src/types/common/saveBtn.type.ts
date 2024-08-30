export type TSaveBtnStatusValue = 'Publicado' | 'Guardar' | 'Guardando' | 'Guardado';
export type TSaveBtnStatus = {
	[key in 'PUBLICADO' | 'GUARDAR' | 'GUARDANDO' | 'GUARDADO']: TSaveBtnStatusValue;
};
