import useInitModel from '@/hooks/useInitModel';
import type { ChungChi } from '@/services/DaoTaoV2/DanhMucHeThong/ChungChi/typing';

export default () => {
	const objInit = useInitModel<ChungChi.ILoaiChungChi>('loai-chung-chi');

	return {
		...objInit,
	};
};
