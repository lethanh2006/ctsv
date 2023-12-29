import useInitModel from '@/hooks/useInitModel';
import { type LichSuNhapDiem } from '@/services/DaoTaoV2/KetQuaHocTap/LichSuNhapDiem/typing';

export default () => {
	const objInit = useInitModel<LichSuNhapDiem.IRecord>('log-diem');

	return {
		...objInit,
	};
};
