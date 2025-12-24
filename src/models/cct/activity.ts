import useInitModel from '@/hooks/useInitModel';
import { Activity } from '@/services/CCT/Activity/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Activity.IRecord>('activities', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
