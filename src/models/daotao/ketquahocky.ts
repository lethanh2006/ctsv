import useInitModel from '@/hooks/useInitModel';
import type { KetQuaHocKy } from '@/services/DaoTao/KetQuaHocTap/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KetQuaHocKy.IRecord>('kqht-hoc-ky', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
