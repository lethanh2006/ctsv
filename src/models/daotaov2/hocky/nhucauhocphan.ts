import useInitModel from '@/hooks/useInitModel';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';

export default () => {
	const objInit = useInitModel<DangKyNhuCau.INhuCauHocPhan>('nhu-cau-hoc-phan');

	return {
		...objInit,
	};
};
