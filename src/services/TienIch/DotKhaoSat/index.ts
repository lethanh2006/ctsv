import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function kichHoatDotKhaoSat(payload: { id: string; data: { kichHoat: boolean } }) {
  return axios.post(`${ip3}/dot-khao-sat/${payload.id}/kich-hoat`, payload.data);
}

export async function getDotKhaoSatThongKe(payload: { id: string }) {
  return axios.get(`${ip3}/dot-khao-sat/${payload.id}/thong-ke`);
}

export async function exportKetQuaKhaoSat(payload: { idKhaoSat: string }) {
  return axios.get(`${ip3}/dot-khao-sat/${payload.idKhaoSat}/tong-hop`, {
    responseType: 'arraybuffer',
  });
}
