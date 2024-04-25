import type { ThongBao } from '@/services/ThongBao/typing';

export enum EReceiverType {
	// Topic = 'Topic',
	User = 'User',
	All = 'All',
	KhoaSinhVien = 'KhoaSinhVien',
	Khoa = 'Khoa',
	Nganh = 'Nganh',
	LopHanhChinh = 'LopHanhChinh',
	LopHocPhan = 'LopHocPhan',
}

export const LoaiDoiTuongThongBao: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.User]: 'Người dùng cụ thể',
	[EReceiverType.All]: 'Toàn ' + APP_CONFIG_TIEN_TO_TRUONG,
	[EReceiverType.Khoa]: 'Đơn vị',
	[EReceiverType.KhoaSinhVien]: 'Khóa sinh viên',
	[EReceiverType.Nganh]: 'Ngành đào tạo',
	[EReceiverType.LopHanhChinh]: 'Lớp hành chính',
	[EReceiverType.LopHocPhan]: 'Lớp học phần',
};
export const FieldLoaiDoiTuongThongBao: Partial<Record<EReceiverType, keyof ThongBao.IThongKe>> = {
	[EReceiverType.All]: 'tatCa',
	[EReceiverType.Khoa]: 'theoKhoa',
	[EReceiverType.KhoaSinhVien]: 'theoKhoaSinhVien',
	[EReceiverType.Nganh]: 'theoNganh',
	[EReceiverType.LopHanhChinh]: 'theoLopHanhChinh',
	[EReceiverType.LopHocPhan]: 'theoLopHocPhan',
};
export const ColorLoaiDoiTuongThongBao: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.All]: 'blue',
	[EReceiverType.Khoa]: 'blue',
	[EReceiverType.KhoaSinhVien]: 'blue',
	[EReceiverType.Nganh]: 'blue',
	[EReceiverType.LopHanhChinh]: 'blue',
	[EReceiverType.LopHocPhan]: 'blue',
};
export enum NotificationType {
	ONESIGNAL = 'OneSignalService',
	EMAIL = 'Email',
}
