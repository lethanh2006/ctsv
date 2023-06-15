import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function kichHoatBieuMau(payload: { id: string; data: { kichHoat: boolean } }) {
  return axios.post(`${ip3}/khao-sat/${payload.id}/kich-hoat`, payload.data);
}

export async function getBieuMauThongKe(payload: { id: string }) {
  return axios.get(`${ip3}/khao-sat/${payload.id}/thong-ke`);
}

export async function getIdBieuMauDaTraLoi(loaiBieuMau?: string) {
  return axios.get(`${ip3}/cau-tra-loi-bieu-mau/id-bieu-mau/da-tra-loi?loai=${loaiBieuMau}`);
}

export async function exportKetQuaKhaoSat(payload: { idKhaoSat: string }) {
  return axios.get(`${ip3}/khao-sat/${payload.idKhaoSat}/tong-hop`, {
    responseType: 'arraybuffer',
  });
}
