import { type ELoaiThoiHoc } from '../constant';

declare module ThoiHoc {
  export interface IRecord {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    hocKyId: string;
    hocKy: HocKy.IRecord;
    loaiThoiHoc: ELoaiThoiHoc;
  }
}
