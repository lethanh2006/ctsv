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

  export interface Data extends INhanVienSinhVien {
    id: number;
    ten_lop_hanh_chinh?: string;
    khoi_lop_id?: any[];
    nganh?: any[];
    chuyen_nganh?: boolean;
    canBo: Login.Profile;
    can_bo_id: (string | number)[];
    si_so?: number;
    danhSachSinhVien?: ISinhVienDiemHanhChinh[];
  }

  export interface INhanVienSinhVien {
    diemTichLuyLonNhat: number;
    diemTichLuyNhoNhat: number;
    diemTichLuyTB: number;
    sinhVienList: ISinhVienDiemHanhChinh[];
  }

  export interface ISinhVienDiemHanhChinh extends Login.Profile {
    diemTongKet: {
      diem_tich_luy_thang_4: number; //0;
      id: number; //47614;
      ma_dinh_danh: string; //'B21DVQT004';
      tong_so_tin_chi_da_hoc: number; //0;
      tong_so_tin_chi_tich_luy: number; //0;
    };
  }

  export interface HinhThucDaoTao {
    canCu: {
      createdAt: string;
      ma: string;
      noiDung: string;
      ten: string;
      updatedAt: string;
      url: string;
      _id: string;
    };
    canCuId: string;
    createdAt: string;
    danhMucHTDT: {
      createdAt: string;
      ma: string;
      ten: string;
      updatedAt: string;
      _id: string;
    };
    danhMucHTDTId: string;
    ma: string;
    _id: string;
  }

  export interface RecordAdmin {
    id: number;
    nganh: number | string[];
    chuyen_nganh: string;
    can_bo_id: number | string[];
    khoi_lop_id: number | string[];
    si_so: number;
    ten_lop_hanh_chinh: string;
    hinh_thuc_dao_tao_id: (number | string)[];
    co_so_dao_tao_moi: number | string[];
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}
