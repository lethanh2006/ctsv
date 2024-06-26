import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getDanhSachChuaKhaiBao(idDot: string) {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/chua-dang-ky/many/${idDot}`);
}
export async function getDanhSachChuaKhaiBaoPage(idDot: string, page: number, limit: number) {
	return axios.get(`${ipDaoTao}/dot-cap-nhat-ho-so/chua-dang-ky/page/${idDot}`, {
		params: { page: page, limit: limit },
	});
}
