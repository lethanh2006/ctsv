import { type ETrinhDoKqhtHocKy } from '../constant';

declare module KetQuaHocKy {
  export interface IRecord {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    hocKyId: string;
    hocKy?: HocKy.IRecord;
    gpa: number;
    cpa: number;
    soTinChiDat: number;
    tongSoTinChiTichLuy: number;
    tongSoTinChiNo: number;
    tongSoTinChiDaDk: number;
    trinhDo: ETrinhDoKqhtHocKy;
  }
}
