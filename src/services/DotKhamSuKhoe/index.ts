import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function postManyKhoaNganh(dotKhamSucKhoeId: string, payLoad: any) {
	return axios.post(`${ip3}/dot-kham-suc-khoe-khoa-nganh/dot-kham-suc-khoe/${dotKhamSucKhoeId}/many`, payLoad);
}
