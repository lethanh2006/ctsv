import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function putApproveActivity(idActivity: string, payLoad: any) {
	return axios.put(`${ipCCT}/activity-outcome/approve/${idActivity}`, payLoad);
}

export async function getAnalyticsStaff() {
	return axios.get(`${ipCCT}/activity-outcome/analytics/staff`);
}

export async function getAnalyticsApprovers() {
	return axios.get(`${ipCCT}/activity-outcome/analytics/overview`);
}
