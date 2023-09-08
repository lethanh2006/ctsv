import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecordSinhVien>('lop-hc-sv', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
