import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';
import { EActivityCategory } from '../constant';

export async function putApproveActivity(idActivity: string, payLoad: any) {
	return axios.put(`${ipCCT}/activity-outcome/approve/${idActivity}`, payLoad);
}

export async function getAnalyticsStaff(activityCategory: EActivityCategory) {
	return axios.get(`${ipCCT}/activity-outcome/analytics/staff/${activityCategory}`);
}
