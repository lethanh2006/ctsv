import useInitModel from '@/hooks/useInitModel';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh');

	return {
		...objInit,
	};
};
