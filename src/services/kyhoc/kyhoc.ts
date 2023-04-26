import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getAllKyHocSinhVien() {
  return axios.get(`${ip3}/odoo-ky-hoc/sinh-vien/me`);
}

export async function getAllKyHoc(payload?: { idHinhThuc: number }) {
  return axios.get(`${ip3}/odoo-ky-hoc/all`, { params: payload });
}

export async function giangVienGetAllKyHocSinhVienByIdSinhVien(idSinhVien: number) {
  return axios.get(`${ip3}/odoo-ky-hoc/giang-vien/sinh-vien/${idSinhVien}`);
}

export async function getAllKyHocByHinhThucDaoTaoGiangVien(idHinhThuc: number) {
  return axios.get(`${ip3}/odoo-ky-hoc/giang-vien/me?idHinhThuc=${idHinhThuc}`);
}

export async function getAllKyHocByIdHinhThuc(idHinhThuc: any) {
  return axios.get(`${ip3}/odoo-ky-hoc/all?idHinhThuc=${idHinhThuc}`);
}
