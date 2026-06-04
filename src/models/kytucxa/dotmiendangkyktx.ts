import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';
import axios from '@/utils/axios';

export default () => {
    const objInit = useInitModel<KyTucXa.IDotMienDangKyKTX>('dot-dang-ky-ky-tuc-xa', undefined, undefined, ipCsvc);

    const postMienDangKy = (dotId: string, danhSachMaSinhVien: string[], headers?: any) => {
        return axios.post(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/mien-dang-ky`, { danhSachMaSinhVien }, { headers });
    };

    const getMienDangKy = (dotId: string, params?: any, headers?: any) => {
        return axios.get(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/mien-dang-ky`, { params, headers });
    };

    const deleteMienDangKy = (dotId: string, id: string, headers?: any) => {
        return axios.delete(`${ipCsvc}/dot-dang-ky-ky-tuc-xa/${dotId}/mien-dang-ky/${id}`, { headers });
    };

    return {
        ...objInit,
        postMienDangKy,
        getMienDangKy,
        deleteMienDangKy,
    };
};
