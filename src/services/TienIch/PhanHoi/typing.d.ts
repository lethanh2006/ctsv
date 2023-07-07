import type { DichVuMotCuaV2 } from '../DichVuMotCuaV2/typing';
import type { ELoaiPhanHoi } from './constant';

declare module PhanHoi {
  export interface IRecord {
    _id: string;
    maSv: string;
    createdAt: string;
    updatedAt: string;
    idDonDVMC: string;
    noiDungPhanHoi: string;
    noiDungTraLoiPhanHoi: string;
    daTraLoiPhanHoi: boolean;
    maChuyenVien: string;
    loaiPhanHoi: ELoaiPhanHoi;
    thoiGianTraLoi: string;
    urlPhanAnh?: string | null;
  }
}
