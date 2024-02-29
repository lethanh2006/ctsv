import useInitModel from '@/hooks/useInitModel';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiem/typings';

export default () => {
	const objInit = useInitModel<PhieuDiemRenLuyen.IRecord>('drl/phieu-drl');

	return {
		...objInit,
	};
};
