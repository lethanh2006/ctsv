import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';
import axios from '@/utils/axios';

export default () => {
    const objInit = useInitModel<KyTucXa.IDotDangKyKTX>('dot-dang-ky-ky-tuc-xa');

     const postSinhVienDangKy = (dotId: string, danhSachMaSinhVien: string[], headers?: any) => {
        return axios.post(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/sinh-vien-dang-ky`, { danhSachMaSinhVien }, { headers });
    };
    return {
        ...objInit,
        postSinhVienDangKy,
    };
};
