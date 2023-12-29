import useInitModel from '@/hooks/useInitModel';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';

export default () => {
	const objInit = useInitModel<XetHocVu.IKyLuat>('ky-luat');

	return {
		...objInit,
	};
};
