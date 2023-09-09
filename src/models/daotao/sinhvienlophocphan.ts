import useInitModel from '@/hooks/useInitModel';
import type { LopHocPhan } from '@/services/DaoTao/LopHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecordSinhVienLopHP>('lop-hp-sv', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
