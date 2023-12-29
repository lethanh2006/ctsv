import useInitModel from '@/hooks/useInitModel';
import { type KetQuaHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/KetQuaHocKy/typing';

export default () => {
	const objInit = useInitModel<KetQuaHocKy.IRecord>('kqht-hoc-ky');

	return {
		...objInit,
	};
};
