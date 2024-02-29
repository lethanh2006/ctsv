import { ip3 } from '@/utils/ip';
import axios from 'axios';

export const thongKePhieuDiem = (maHocKy: string) => axios.get(`${ip3}/drl/phieu-drl/thong-ke/hoc-ky/${maHocKy}`);
