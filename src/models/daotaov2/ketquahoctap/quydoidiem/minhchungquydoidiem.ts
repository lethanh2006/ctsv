import useInitModel from '@/hooks/useInitModel';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';

export default () => {
	const objInit = useInitModel<DotQuyDoiDiem.IMinhChungQuyDoiDiem>('quy-doi-diem-sv-minh-chung');

	return {
		...objInit,
	};
};
