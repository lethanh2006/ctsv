export enum ELoaiDoiTuong {
  TAT_CA = 'Tất cả',
  // VAI_TRO = 'Vai trò',
  LOP_TIN_CHI = 'Lớp tín chỉ',
  LOP_HANH_CHINH = 'Lớp hành chính',
  NGANH = 'Ngành',
  // DON_VI = 'Đơn vị',
  KHOA = 'Khóa',
  NGUOI_DUNG_CU_THE = 'Người dùng cụ thể',
}

export enum ELoaiCauHoi {
  SingleChoice = 'Chọn 1 đáp án',
  MultipleChoice = 'Chọn nhiều đáp án',
  GridSingleChoice = 'Dạng bảng (chọn một)',
  GridMultipleChoice = 'Dạng bảng (chọn nhiều)',
  NumericRange = 'Đánh giá (dạng số)',
  Text = 'Câu trả lời Text',
  UploadFile = 'Tải lên file',
}

export enum EVaiTroBieuMau {
  SINH_VIEN = 'sinh_vien',
  NHAN_VIEN = 'nhan_vien',
}

export const TenVaiTroBieuMau = {
  [EVaiTroBieuMau.SINH_VIEN]: 'Sinh viên',
  [EVaiTroBieuMau.NHAN_VIEN]: 'Cán bộ, giảng viên',
};

export enum ELoaiBieuMau {
  KHAO_SAT = 'Khảo sát',
  TRAC_NGHIEM = 'Trắc nghiệm',
  KHAI_BAO_Y_TE = 'Khai báo y tế',
  DANH_GIA_GIANG_VIEN = 'Đánh giá giảng viên',
}

export enum ELoaiDot {
  BIEU_MAU = 'BIEU_MAU',
}
