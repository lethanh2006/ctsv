declare module CanhCaoHocTap {
  export interface IRecord {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    hocKyId: string;
    hocKy?: HocKy.IRecord;
    loaiCanhCaoId: string;
    loaiCanhCao?: ILoaiCanhCao;
    ghiChu: string;
  }

  export interface ILoaiCanhCao {
    _id: string; //'string';
    ten: string; //'string';
    active: boolean;
  }
}
