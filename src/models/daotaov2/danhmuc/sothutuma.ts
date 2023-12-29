import useInitModel from '@/hooks/useInitModel';
import type { SinhMaTuDong } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/typing';

export default () => {
	const objInit = useInitModel<SinhMaTuDong.ISoThuTu>('increment');

	return {
		...objInit,
	};
};
