export enum EReceiverType {
  // Topic = 'Topic',
  // User = 'User',
  All = 'All',
  KhoaSinhVien = 'KhoaSinhVien',
  Khoa = 'Khoa',
  Nganh = 'Nganh',
  LopHanhChinh = 'LopHanhChinh',
  LopHocPhan = 'LopHocPhan',
}

export const LoaiDoiTuongThongBao = {
  [EReceiverType.All]: 'Toàn Học viện',
  [EReceiverType.Khoa]: 'Khoa',
  [EReceiverType.KhoaSinhVien]: 'Khóa sinh viên',
  [EReceiverType.Nganh]: 'Ngành đào tạo',
  [EReceiverType.LopHanhChinh]: 'Lớp hành chính',
  [EReceiverType.LopHocPhan]: 'Lớp học phần',
};
