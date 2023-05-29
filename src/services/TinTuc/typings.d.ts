declare module TinTuc {
  export interface IRecord {
    hinhThucDaoTaoId: number;
    danhSachVaiTro: string[];
    doiTuong: 'Tất cả' | 'Vai trò';
    _id: string;
    tieuDe: string;
    idTopic: string;
    moTa: string;
    urlAnhDaiDien: string;
    noiDung: string;
    ngayDang: string;
    phamVi: string;
    nguoiDang: {
      _id: string;
      fullname: string;
    };
  }
}
