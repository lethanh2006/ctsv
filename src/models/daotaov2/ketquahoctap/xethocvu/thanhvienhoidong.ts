import useInitModel from '@/hooks/useInitModel';
import type { DotXetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/DotXetHocVu/typing';

export default () => {
	const objInit = useInitModel<DotXetHocVu.IThanhVienHoiDong>('hoi-dong-hoc-vu');

	return {
		...objInit,
	};
};
