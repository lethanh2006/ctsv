import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type MinhChungDiemRenLuyen } from '../MinhChung/typing';

const url = 'dashboard/diem-ren-luyen';

export function getBaoCaoDiemRL(idDotChamDiem: string, type: 'lop-hanh-chinh' | 'sinh-vien' | 'su-kien') {
	return axios.get(`${ip3}/${url}/dot/${idDotChamDiem}/${type}`);
}

export function postBaoCaoMinhChung(data: Partial<MinhChungDiemRenLuyen.IRecord>) {
	return axios.post(`${ip3}/${url}/minh-chung/count`, data);
}
