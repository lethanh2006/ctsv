declare module KhoaSinhVien {
  export interface IRecord {
    _id: string;
    ten: string;
    namHocId: string;
    namHoc?: NamHoc.IRecord;
    hinhThucDaoTaoId: string;
    hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
    createdAt?: string;
    updatedAt?: string;
  }
}
