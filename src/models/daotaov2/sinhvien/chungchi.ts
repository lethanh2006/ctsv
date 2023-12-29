import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';

export default () => {
	const objInit = useInitModel<SinhVien.IChungChiSinhVien>('chung-chi-sv');

	return {
		...objInit,
	};
};
