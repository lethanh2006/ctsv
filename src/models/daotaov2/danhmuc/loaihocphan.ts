import useInitModel from '@/hooks/useInitModel';
import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';

export default () => {
	const objInit = useInitModel<HocPhan.ILoaiHocPhan>('loai-hoc-phan');

	return {
		...objInit,
	};
};
