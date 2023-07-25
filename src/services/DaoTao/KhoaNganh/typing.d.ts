declare module KhoaNganh {
  export interface IRecord {
    _id: string;
    ten: string;
    chuongTrinhId: string;
    chuongTrinh?: ChuongTrinhDaoTao.IRecord;
    khoaSinhVienId: string;
    khoaSinhVien: KhoaSinhVien.IRecord;
    nganhId: string;
    nganh: NganhDaoTao.IRecordCoSo;
    namBatDau?: number;
    namKetThuc?: number;
    createdAt?: string;
    updatedAt?: string;
  }
}
