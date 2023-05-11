import type { DichVuMotCuaV2 } from '../DichVuMotCuaV2/typing';
import type { ELoaiPhanHoi } from './constant';

declare module PhanHoi {
  export interface IRecord {
    _id: string;
    createdAt: string;
    updatedAt: string;
    idDonDVMC: DichVuMotCuaV2.Don;
    noiDungPhanHoi: string;
    noiDungTraLoiPhanHoi: string;
    daTraLoiPhanHoi: boolean;
    maChuyenVien: string;
    loaiPhanHoi: ELoaiPhanHoi;
  }
}
