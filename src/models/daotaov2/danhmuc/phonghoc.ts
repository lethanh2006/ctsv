import useInitModel from '@/hooks/useInitModel';
import type { PhongHoc } from '@/services/DaoTaoV2/DanhMucHeThong/PhongHoc/typing';

export default () => {
	const objInit = useInitModel<PhongHoc.IRecord>('phong');

	return {
		...objInit,
	};
};
