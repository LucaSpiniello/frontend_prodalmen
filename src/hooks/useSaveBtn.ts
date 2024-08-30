import SAVE_BTN_STATUS from '../constants/common/saveBtn.constant';
import { TSaveBtnStatusValue } from '../types/common/saveBtn.type';
import { TColors } from '../types/colors.type';

const useSaveBtn = ({
	isNewItem,
	isSaving,
	isDirty,
}: {
	isNewItem: boolean;
	isSaving: boolean;
	isDirty: boolean;
}) => {
	const textFn = () => {
		if (isSaving) return SAVE_BTN_STATUS.GUARDANDO;
		if (!isSaving && isNewItem) return SAVE_BTN_STATUS.PUBLICADO;
		if (!isSaving && !isNewItem && !isDirty) return SAVE_BTN_STATUS.GUARDADO;
		return SAVE_BTN_STATUS.GUARDAR;
	};
	const saveBtnText: TSaveBtnStatusValue = textFn();

	const colorFn = () => {
		if (isSaving) return 'blue';
		if (!isSaving && isNewItem) return 'emerald';
		if (!isSaving && !isNewItem && !isDirty) return 'blue';
		return 'blue';
	};
	const saveBtnColor: TColors = colorFn();

	const saveBtnDisable: boolean = !isNewItem && !isDirty;

	return { saveBtnText, saveBtnColor, saveBtnDisable };
};
export default useSaveBtn;
