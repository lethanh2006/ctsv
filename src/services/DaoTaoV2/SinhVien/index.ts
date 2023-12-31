import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getHocTapHienTai(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export async function exportLyLich(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/export-ly-lich`, {
		responseType: 'arraybuffer',
	});
}

export async function getTienTrinhSinhVien(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/chung-chi-sv/chung-chi-chuan-dau-ra/tien-trinh/${sinhVienSsoId}`);
}

export async function getTrangThaiNoNghiaVu(dotXetTotNghiepId: string, sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/chuan-tot-nghiep/sinh-vien/${sinhVienSsoId}/dot/${dotXetTotNghiepId}`);
}

export async function getThongKeTrangThaiSv() {
	return axios.get(`${ipDaoTao}/sinh-vien/thong-ke/trang-thai`);
}
