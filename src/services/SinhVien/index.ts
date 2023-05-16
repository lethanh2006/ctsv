import axios from '@/utils/axios';
import { ipQldt } from '@/utils/ip';

export async function getHocTapHienTai(sinhVienSsoId: string) {
  return axios.get(`${ipQldt}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

// export async function kichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/activate`);
// }

// export async function tatKichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/inactivate`);
// }
