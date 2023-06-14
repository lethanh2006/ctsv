import { type ELoaiLopHocPhan } from '../constant';

declare module LopHocPhan {
  export interface IRecord {
    _id: string;
    ten: string;
    tenCha?: string;
    // maLop: string;
    // maLopCha?: string;
    maHocKy: string;
    // hocKy?: HocKy.IRecord;
    maHocPhan: string;
    hocPhan?: HocPhan.IRecord;
    siSoToiDa: number;
    siSo?: number; // Sĩ số hiện tại
    loai: ELoaiLopHocPhan;
    // parentId?: string | null;
    soThuTuLop?: number;
    soThuTuNhom?: number;

    parent?: IRecord;
    children?: IRecord[];
    // maHoaLichHoc?: TMaHoaLichHoc[];
    // thoiKhoaBieuList?: ThoiKhoaBieu.IRecord;
  }
}
