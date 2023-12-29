import useInitModel from '@/hooks/useInitModel';
import { type QuyDoiDiem } from '@/services/DaoTaoV2/DanhMucHeThong/QuyDoiDiem/typing';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.IRecord>('quy-doi-diem');

	return {
		...objInit,
	};
};
