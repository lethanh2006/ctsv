/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { LopTinChi } from './typings';

export async function sinhVienGetLopTinChiByHocKy(idHocKy: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/sinh-vien/hoc-ky/${idHocKy}`);
}

export async function giangVienGetLopTinChiByHocKy(idHocKy: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/giang-vien/hoc-ky/${idHocKy}`);
}

export async function getThongBaoLopTinChiById(payload: {
  idLop?: number;
  role?: string;
  page: number;
  limit: number;
  cond?: any;
}) {
  const idLop = payload?.idLop;
  const role = payload?.role;
  delete payload.idLop;
  delete payload.role;
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/${role}/notification/pageable`, {
    params: payload,
  });
}

export async function getURLImg(payload: any) {
  const form = new FormData();
  // eslint-disable-next-line array-callback-return
  Object.keys(payload).map((key) => {
    form.set(key, payload[key]);
  });
  return axios.post(`${ip3}/file/image/single`, form);
}

export async function addThongBao(payload: { idLop: any; newValues: any }) {
  const { idLop, newValues } = payload;
  return axios.post(`${ip3}/odoo-lop-tin-chi/${idLop}/giang-vien/notification`, {
    ...newValues,
  });
}

/**
 * Giảng viên gửi thông báo đến sinh viên lớp hành chính
 * @param payload idLop: idLop hành chính, newValues: nội dung thông báo
 * @returns
 */

export async function addThongBaoLopHanhChinh(payload: { idLop: number; newValues: any }) {
  const { idLop, newValues } = payload;
  return axios.post(`${ip3}/odoo-lop-hanh-chinh/${idLop}/can-bo/notification`, {
    ...newValues,
  });
}

/**
 *
 * @param idLop
 * @returns dùng cho get ds sv cho sv + giảng viên
 */
export async function getThongTinChungLopTinChiById(idLop: number) {
  if (localStorage.getItem('vaiTro') === 'nhan_vien') {
    return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/giang-vien/sv`);
  }
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/sinh-vien/gv-sv`);
}

export async function getLopTinChiById(idLop: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}`);
}

export async function getNhomLopTinChiById(idLop: number) {
  return axios.get(`${ip3}/odoo-nhom-lop-tin-chi/user/lop-tin-chi/${idLop}`);
}

export async function getDanhSachSinhVienByIdNhomLop(idNhomLop: number) {
  return axios.get(`${ip3}/odoo-nhom-lop-tin-chi/${idNhomLop}/user/danh-sach-sv`);
}

export async function getInfoMonHoc(idMonHoc: number) {
  return axios.get(`${ip3}/odoo-slide-channel/${idMonHoc}`);
}

export async function getAllMonHocSinhVien(payload: { condition: { idHocKy?: number } }) {
  return axios.get(`${ip3}/odoo-slide-channel/sinh-vien/all`, { params: payload });
}

export async function getAllLopTinChiSinhVien() {
  return axios.get(`${ip3}/odoo-lop-tin-chi/sinh-vien/all`);
}

export async function sinhVienGetKetQuaHocTapByIdLopTinChi(idLop: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/sinh-vien/ket-qua-hoc-tap`);
}

export async function giangVienGetKetQuaHocTapByIdLopTinChi(idLop: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/giang-vien/ket-qua-hoc-tap`);
}

export async function giangVienPutKetQuaHocTapByIdLopTinChi(
  idLop: number,
  data: { danhSachKetQua: LopTinChi.KetQuaHocTap[] },
) {
  return axios.put(`${ip3}/odoo-lop-tin-chi/${idLop}/giang-vien/ket-qua-hoc-tap`, data);
}

export async function getLopTinChi(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/pageable`, { params: payload });
}

export async function getDotDanhGia(kyHoc?: number) {
  return axios.get(`${ip3}/danh-gia-giang-vien/dot-danh-gia/ky-hoc/${kyHoc}`);
}

export async function getBieuMau(idBieuMau: string) {
  return axios.get(`${ip3}/bieu-mau/${idBieuMau}`);
}

export async function sinhVienThucHienBieuMau(payload: {
  idDotDanhGiaGiangVien?: string;
  idLopTinChi?: number;
  danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[];
}) {
  const idDot = payload.idDotDanhGiaGiangVien;
  const idLop = payload.idLopTinChi;
  delete payload.idDotDanhGiaGiangVien;
  delete payload.idLopTinChi;
  return axios.post(
    `${ip3}/danh-gia-giang-vien/dot-danh-gia/khai-bao/dot-danh-gia/${idDot}/lop-tin-chi/${idLop}`,
    payload,
  );
}

export async function verifyAccessDanhGia(idDot?: string, idLop?: number) {
  return axios.get(
    `${ip3}/danh-gia-giang-vien/verify-access/dot-danh-gia/${idDot}/lop-tin-chi/${idLop}`,
  );
}

export async function getBieuMauById(payload: { id: string }) {
  return axios.get(`${ip3}/bieu-mau/${payload.id}`);
}

export async function getBangDiem(idLopTinChi: number) {
  return axios.get(`${ip3}/odoo-sv-ltc-ds/nhan-vien/get-diem/lop-tin-chi/${idLopTinChi}`);
}

export async function giangVienNhapDiem(
  idLopTinChi: number,
  payload: { danhSachDiem: LopTinChi.KetQuaHocTap[] },
) {
  return axios.post(
    `${ip3}/odoo-sv-ltc-ds/nhan-vien/nhap-diem/lop-tin-chi/${idLopTinChi}`,
    payload,
  );
}
