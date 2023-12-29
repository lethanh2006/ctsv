import useInitModel from '@/hooks/useInitModel';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';

export default () => {
	const objInit = useInitModel<DotQuyDoiDiem.IRecord>('dot-quy-doi-diem-sinh-vien');

	return {
		...objInit,
	};
};
