import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function duyetSinhVienKTX(idDot: string, payLoad: any) {
	return axios.put(`${ip3}/sinh-vien-dang-ky-ktx/dot-dang-ky/${idDot}/trang-thai`, payLoad);
}

export async function chotDotDangKyKTX(idDot: string) {
	return axios.post(`${ip3}/dot-dang-ky-ktx/${idDot}/khoi-tao/bill`);
}

export async function exportCanKetSinhVien(idSinhVienKTX: string) {
	return axios.get(`${ip3}/sinh-vien-dang-ky-ktx/${idSinhVienKTX}/don-cam-ket`, {
		responseType: 'arraybuffer',
	});
}

export async function closeBillSinhVienKtx(idSinhVienKTX: string) {
	return axios.post(`${ip3}/sinh-vien-dang-ky-ktx/${idSinhVienKTX}/bill/close`);
}

export async function getDotSinhVienDangKyKTX(idDot: string) {
	return axios.get(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/sinh-vien-dang-ky`);
}

export async function postDotSinhVienDangKyKTX(idDot: string, payLoad: { danhSachMaSinhVien: string[] }) {
	return axios.post(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/sinh-vien-dang-ky`, payLoad);
}

export async function deleteDotSinhVienDangKyKTX(idDot: string, id: string) {
	return axios.delete(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/sinh-vien-dang-ky/${id}`);
}

export async function getDotMienDangKyKTX(idDot: string) {
	return axios.get(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/mien-dang-ky`);
}

export async function postDotMienDangKyKTX(idDot: string, payLoad: any) {
	return axios.post(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/mien-dang-ky`, payLoad);
}

export async function deleteDotMienDangKyKTX(idDot: string, id: string) {
	return axios.delete(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/mien-dang-ky/${id}`);
}

export async function duyetDotMienDangKyKTX(idDot: string, id: string) {
	return axios.post(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/mien-dang-ky/${id}/duyet`);
}

export async function tuChoiDotMienDangKyKTX(idDot: string, id: string) {
	return axios.post(`${ip3}/dot-dang-ky-ky-tuc-xa/${idDot}/mien-dang-ky/${id}/tu-choi`);
}

export async function getMeDotMienDangKyKTX() {
	return axios.get(`${ip3}/dang-ky-ky-tuc-xa/me/mien-dang-ky`);
}

export async function uploadMinhChungDotMienDangKyKTX(id: string, payLoad: any) {
	return axios.post(`${ip3}/dang-ky-ky-tuc-xa/me/mien-dang-ky/${id}/minh-chung`, payLoad);
}
