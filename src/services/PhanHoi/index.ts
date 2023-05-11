import { ip3 } from '@/utils/ip';
import axios from 'axios';

const url = 'phan-hoi';

export const traLoiPhanHoi = (idPhanHoi: string, payload: { noiDungTraLoiPhanHoi: string }) => {
  return axios.put(`${ip3}/${url}/${idPhanHoi}/tra-loi`, payload);
};

export const traLoiPhanHoiDvmc = (idDonDVMC: string, payload: { noiDungTraLoiPhanHoi: string }) => {
  return axios.put(`${ip3}/${url}/don-dvmc/${idDonDVMC}/tra-loi`, payload);
};
