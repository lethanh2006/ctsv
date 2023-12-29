import useInitModel from '@/hooks/useInitModel';
import { type CongNhanKQHT } from '@/services/DaoTaoV2/KetQuaHocTap/CongNhan/typing';

export default () => {
	const objInit = useInitModel<CongNhanKQHT.IRecord>('cong-nhan-kqht');

	return {
		...objInit,
	};
};
