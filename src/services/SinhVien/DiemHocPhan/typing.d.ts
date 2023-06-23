import { type ELoaiDiemChu } from '../constant';

declare module DiemHocPhan {
  export interface IRecord {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    hocPhanId: string;
    hocPhan?: HocPhan.IRecord;
    diemTongKet: number;
    diemThang4: number;
    diemChu: ELoaiDiemChu;
  }
}
