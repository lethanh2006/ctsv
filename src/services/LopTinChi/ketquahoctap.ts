import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function sinhVienGetDiemThanhPhanByHocKy(idHocKy?: number) {
  return axios.get(`${ip3}/odoo-sv-ltc-ds/sinh-vien/hoc-ky`, { params: { idHocKy } });
}

export async function sinhVienGetGiaLapDiem() {
  return axios.get(`${ip3}/odoo-sv-hp-ds/sinh-vien/hoc-phan/diem`);
}

export async function sinhVienAllGetDiemTongKet() {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/sinh-vien/me/all`);
}

export async function sinhVienGetDiemTongKetHienTai() {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/sinh-vien/me/kqht-general`);
}

export async function sinhVienGetDiemTongKetByHocKy(idHocKy: number) {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/sinh-vien/me/hoc-ky/${idHocKy}`);
}

export async function giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKy(
  idSinhVien: number,
  idHocKy?: number,
) {
  return axios.get(`${ip3}/odoo-sv-ltc-ds/nhan-vien-get-sinh-vien`, {
    params: { idSinhVien, idHocKy },
  });
}

export async function giangVienGetDiemTongKetSinhVienByIdSinhVien(idSinhVien: number) {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/nhan-vien/sinh-vien/${idSinhVien}/all`);
}

export async function giangVienGetDiemTongKetHienTaiSinhVien(idSinhVien: number) {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/giang-vien/kqht-general/sv/${idSinhVien}`);
}

export async function congDiemSinhVien(idLopTinChi: number, maSinhVien: string, lichSuDiem: any) {
  return axios.post(`${ip3}/odoo-lop-tin-chi/cong-diem-sinh-vien/`, {
    maSinhVien,
    idLopTinChi,
    lichSuDiem: [lichSuDiem],
  });
}
