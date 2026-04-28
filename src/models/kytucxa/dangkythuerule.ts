import useInitModel from '@/hooks/useInitModel';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KyTucXa.IRuleDangKyThueKTX>('dang-ky-thue-rule', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
