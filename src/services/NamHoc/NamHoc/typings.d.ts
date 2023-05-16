declare module NamHoc {
  export interface IRecord {
    _id: string;
    ten: string;
    thoiGianBatDau: string;
    hinhThucDaoTaoId: string;
    hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
    trinhDoDaoTaoId: string;
    trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
    soTuan: number;
    soKyChinh: number;
    soKyPhu: number;
    createdAt?: string;
    updatedAt?: string;
  }
}
