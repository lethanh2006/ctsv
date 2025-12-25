import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function putApproveActivity(idActivity: string, payLoad: any) {
	return axios.put(`${ipCCT}/activity-outcome/approve/${idActivity}`, payLoad);
}
