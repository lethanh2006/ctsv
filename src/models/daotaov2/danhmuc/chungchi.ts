import useInitModel from '@/hooks/useInitModel';
import type { ChungChi } from '@/services/DaoTaoV2/DanhMucHeThong/ChungChi/typing';

export default () => {
	const objInit = useInitModel<ChungChi.IRecord>('chung-chi');

	return {
		...objInit,
	};
};
