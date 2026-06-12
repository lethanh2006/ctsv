import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';
import axios from '@/utils/axios';

export default () => {
    const objInit = useInitModel<KyTucXa.IDotMienDangKyKTX>('danh-sach-mien-ky-tuc-xa', undefined, undefined, ipCsvc);

    const postMienDangKySinhVien = (danhSachId: string, danhSachMaSinhVien: string[], headers?: any) => {
        return axios.post(`${ipCsvc}/danh-sach-mien-ky-tuc-xa/${danhSachId}/sinh-vien`, { danhSachMaSinhVien }, { headers });
    };

    const postDuyet = (id: string, headers?: any) => {
        return axios.post(`${ipCsvc}/danh-sach-mien-ky-tuc-xa/sinh-vien/${id}/duyet`, {}, { headers });
    };

    const postTuChoi = (id: string, body?: any, headers?: any) => {
        return axios.post(`${ipCsvc}/danh-sach-mien-ky-tuc-xa/sinh-vien/${id}/tu-choi`, body, { headers });
    };

    return {
        ...objInit,
        postMienDangKySinhVien,
        postDuyet,
        postTuChoi,
    };
};
