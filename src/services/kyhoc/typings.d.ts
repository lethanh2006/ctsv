declare module KyHoc {
  export interface Record {
    id: number;
    nam_hoc_id: [number, string];
    ten_ky_nam_hoc: string;
    ma_ky_nam_hoc: string;
    thoi_gian_bat_dau: string;
    thoi_gian_ket_thuc: string;
    soThuTu: number;
    hinh_thuc_dao_tao_id: [number, string];
  }

  export interface KyHocRecord {
    id: number;
    is_ky_chinh: boolean;
    ma_ky_nam_hoc: string;
    nam_hoc_id: [number, string];
    ten_ky_nam_hoc: string;
  }
}
