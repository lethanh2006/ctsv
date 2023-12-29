import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getHocTapHienTai(sinhVienSsoId: string) {
	return axios.get(`${ip3}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export async function exportLyLich(sinhVienSsoId: string) {
	return axios.get(`${ip3}/sinh-vien/${sinhVienSsoId}/export-ly-lich`, {
		responseType: 'arraybuffer',
	});
}

export async function getTienTrinhSinhVien(sinhVienSsoId: string) {
	return axios.get(`${ip3}/chung-chi-sv/chung-chi-chuan-dau-ra/tien-trinh/${sinhVienSsoId}`);
}

export async function getTrangThaiNoNghiaVu(dotXetTotNghiepId: string, sinhVienSsoId: string) {
	return axios.get(`${ip3}/chuan-tot-nghiep/sinh-vien/${sinhVienSsoId}/dot/${dotXetTotNghiepId}`);
}

export async function getThongKeTrangThaiSv() {
	return axios.get(`${ip3}/sinh-vien/thong-ke/trang-thai`);
}
