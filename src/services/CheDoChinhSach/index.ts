import { ip3 } from '@/utils/ip';
import axios from 'axios';

const url = 'che-do-chinh-sach';

export const getDanhMucLoaiCheDoChinhSach = () => {
	return axios.get(`${ip3}/${url}/dm-loai-che-do-chinh-sach`);
};

export const getDanhMucMucMienGiam = (loaiCheDoChinhSach: string) => {
	return axios.get(`${ip3}/${url}/dm-muc-mien-giam/${loaiCheDoChinhSach}`);
};

export const getDanhMucDoiTuongMienGiam = (loaiCheDoChinhSach: string, loaiMucMienGiam: string) => {
	return axios.get(`${ip3}/${url}/dm-doi-tuong-mien-giam/${loaiCheDoChinhSach}/${loaiMucMienGiam}`);
};
