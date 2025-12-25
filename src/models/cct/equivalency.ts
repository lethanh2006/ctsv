import useInitModel from '@/hooks/useInitModel';
import { postManyEquivalency } from '@/services/CCT/Activity';
import { Activity } from '@/services/CCT/Activity/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Activity.IEquivalency>(
		'co-curricular-activity-equivalency',
		undefined,
		undefined,
		ipCCT,
	);
	const { setFormSubmiting } = objInit;

	const postManyEquivalencyModel = async (
		activityId: string,
		payload: { listCoCurricularActivityEquivalency: Activity.IEquivalency[] },
		getData?: () => void,
	): Promise<Activity.IEquivalency> => {
		setFormSubmiting(true);
		try {
			const res = await postManyEquivalency(activityId, payload);

			if (getData) getData();

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postManyEquivalencyModel,
	};
};
