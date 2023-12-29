import useInitModel from '@/hooks/useInitModel';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan');

	return {
		...objInit,
	};
};
