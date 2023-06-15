declare module HinhThucDaoTao {
  export interface IRecordBo {
    _id: string;
    ma: string;
    ten: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IRecordCoSo {
    _id: string;
    danhMucHTDTId: string;
    danhMucHTDT?: IRecordBo;
    // ma: string;
    // ten: string;
    // canCuId: string;
    // canCu?: VanBanQuyDinh.IRecord;
    createdAt?: string;
    updatedAt?: string;
  }
}
