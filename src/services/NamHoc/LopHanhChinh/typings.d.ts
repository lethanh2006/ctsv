declare module LopHanhChinh {
  export interface IRecord {
    _id: string;
    ten: string;
    khoaSinhVienId: string;
    khoaSinhVien?: KhoaSinhVien.IRecord;
    nganhId: string;
    nganh?: NganhDaoTao.IRecordCoSo;
    siSo: number;
    nhanSuSsoId?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  export interface IRecordSinhVien {
    _id: string;
    lopHanhChinhId: string;
    lopHanhChinh: IRecord;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
  }
}
