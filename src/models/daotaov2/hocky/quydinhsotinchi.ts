import useInitModel from '@/hooks/useInitModel';
import type { HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';

export default () => {
	const objInit = useInitModel<HocKy.IQuyDinhSoTinChiDangKy>('quy-dinh-so-tin-chi');

	return {
		...objInit,
	};
};
