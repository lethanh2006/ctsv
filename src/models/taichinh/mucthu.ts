import useInitModel from '@/hooks/useInitModel';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<MucThu.IRecord>('muc-thu', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
