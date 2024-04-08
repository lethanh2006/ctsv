import { ip3 } from '@/utils/ip';
import axios from 'axios';

export const thongKe = async (payload: { condition?: any; filters?: any[] }) =>
	axios.get(`${ip3}/hoat-dong-ctsv/thong-ke/so-luong`, { params: payload });

export const thongKeChung = async (payload: { condition?: any; filters?: any[] }) =>
	axios.get(`${ip3}/hoat-dong-ctsv/thong-ke/chung`, { params: payload });
