import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';
import { Activity } from './typing';

export async function postManyEquivalency(
	activityId: string,
	payload: { listCoCurricularActivityEquivalency: Activity.IEquivalency[] },
) {
	return axios.post(`${ipCCT}/co-curricular-activity-equivalency/insert/${activityId}`, { ...payload });
}

export async function getAnalyticsActivity() {
	return axios.get(`${ipCCT}/activities/analytics`);
}
