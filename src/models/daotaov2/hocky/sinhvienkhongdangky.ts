import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';

export default () => {
	const objInit = useInitModel<SinhVien.IRecord>('sinh-vien/khong-dang-ky-nhu-cau');

	return {
		...objInit,
	};
};
