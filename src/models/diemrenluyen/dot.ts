import useInitModel from '@/hooks/useInitModel';
import type { DotDiemRenLuyen } from '@/services/DiemRenLuyen/Dot/typings';

export default () => {
	const objInit = useInitModel<DotDiemRenLuyen.IRecord>('drl/dot-drl');

	return {
		...objInit,
	};
};
