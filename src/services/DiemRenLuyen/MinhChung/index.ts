import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function duyetMinhChung(_id: string, payload: any) {
	return axios.post(`${ip3}/minh-chung/${_id}/duyet`, payload);
}
export async function boDuyetMinhChung(id: string) {
	return axios.post(`${ip3}/minh-chung/${id}/bo-duyet`);
}
