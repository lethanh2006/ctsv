import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';

export async function getThongKeCongNoSinhVien(sinhVienSsoId: string) {
	return axios.get(`${ipTaiChinh}/chi-tiet-thu/thong-ke/cong-no/${sinhVienSsoId}`);
}
