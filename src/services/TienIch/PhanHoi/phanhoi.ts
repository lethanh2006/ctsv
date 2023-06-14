import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getPhanHoiAdmin(payload: {
  page: number;
  limit: number;
  condition?: any;
  idHinhThuc: number;
}) {
  return axios.get(`${ip3}/phan-hoi/pageable`, { params: payload });
}

export async function traLoiPhanHoi(payload: { id: string; data: any }) {
  return axios.put(`${ip3}/phan-hoi/${payload.id}/tra-loi`, payload.data);
}

export async function getPhanHoiUser(payload: {
  page: number;
  limit: number;
  condition: { daTraLoi?: boolean };
}) {
  return axios.get(`${ip3}/phan-hoi/me/pageable`, { params: payload });
}

export async function getPhanHoiFromOther(payload: {
  page: number;
  limit: number;
  daTraLoi?: boolean;
}) {
  return axios.get(`${ip3}/phan-hoi/from-other/pageable`, { params: payload });
}

export async function deletePhanHoiAdmin(idPhanHoi: string) {
  return axios.delete(`${ip3}/phan-hoi/${idPhanHoi}`);
}
