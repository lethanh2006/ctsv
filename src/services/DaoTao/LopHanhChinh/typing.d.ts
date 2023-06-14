declare module LopHanhChinh {
  export interface IRecord {
    _id: string;
    ten: string;
    // khoaSinhVienId: string;
    // khoaSinhVien?: KhoaSinhVien.IRecord;
    // nganhId: string;
    // nganh?: NganhDaoTao.IRecordCoSo;
    siSo: number;
    nhanSuSsoId?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}
