export enum EHoatDongChungType2 {
	CA_NHAN = 'Cá nhân',
	TAT_CA = 'Chung',
	TUAN_LE_CONG_DAN = 'Tuần sinh hoạt công dân',
	CAC_HOAT_DONG = 'Các hoạt động cho sinh viên',
	DAO_TAO_BOI_DUONG = 'Đào tạo bồi dưỡng',
	HOP_TAC_NGUYEN_CUU_CHUYEN_GAO = 'Hợp tác - Nghiên cứu - chuyển giao',
	THUC_THI_CHINH_SACH = 'Thực thi, phát triển chính sách',
	HOAT_DONG_XA_HOI = 'Hoạt động xã hội',
	VAN_HOA_VAN_NGHE_THE_THAO = 'Văn hóa, thể thao',
	HOAT_DONG_CAU_LAC_BO = 'Hoạt động câu lạc bộ',
	KHAC = 'Khác',
	HUONG_NGHIEP_VIEC_LAM = 'Hướng nghiệp - việc làm',
	HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI = 'Hoạt động huy động giáo dục tư tưởng chính trị',
	NGOAI_HOC_VIEN = 'Ngoài Học viện',
}

export enum ELoaiSuKienSinhVien {
	NGAY_HOI_VIEC_LAM = 'Ngày hội việc làm',
	HOI_THAO_CHUYEN_DE_VIEC_LAM = 'Hội thảo, nói chuyện chuyên đề về việc làm',
	DAO_TAO_KY_NANG_MEM = 'Đào tạo kỹ năng mềm',
}

export enum ECapHoatDongHuyDongGiaoDucTuTuongChinhTri {
	TW = 'Cấp Trung ương Hội/Bộ GD&ĐT và tương đương',
	HV = 'Cấp Học viện',
	KHOA = 'Cấp Khoa',
}

export enum EHoatDongChungType1 {
	GIAO_DUC_CHINH_TRI_TU_TUONG = 'Giáo dục chính trị tư tưởng',
	PHUC_VU_CONG_DONG = 'Phục vụ cộng đồng',
	VAN_HOA_THE_THAO = 'Văn hóa, thể thao',
}

export const MapKeyLabelTrangThaiThongKe: any = {
	chuaDienRa: 'Chưa diễn ra',
	dangDienRa: 'Đang diễn ra',
	daDienRa: 'Đã diễn ra',
};

export const MapKeyColorTrangThaiThongKe: any = {
	chuaDienRa: '#d46b08',
	dangDienRa: '#096dd9',
	daDienRa: '#389e0d',
};

//Dự toán kinh phí
export enum EDonViTinh {
	NGUOI = 'NGUOI',
	NGAY = 'NGAY',
	KHAC = 'KHAC',
}

export const mapDonViTinh: Record<EDonViTinh, string> = {
	[EDonViTinh.NGUOI]: 'Người',
	[EDonViTinh.NGAY]: 'Ngày',
	[EDonViTinh.KHAC]: 'Khác',
};

export enum ELoaiDoiTuong {
	NGOAI_HE_THONG = 'NGOAI_HE_THONG',
	TAT_CA = 'TAT_CA',
	DON_VI = 'DON_VI',
	KHOA_SV = 'KHOA_SV',
	NGANH = 'NGANH',
	LOP_HANH_CHINH = 'LOP_HANH_CHINH',
	LOP_HOC_PHAN = 'LOP_HOC_PHAN',
}

export const MapKeyLabelLoaiDoiTuong = {
	[ELoaiDoiTuong.NGOAI_HE_THONG]: 'Thành phần ngoài Học viện',
	[ELoaiDoiTuong.DON_VI]: 'Đơn vị',
	[ELoaiDoiTuong.KHOA_SV]: 'Khóa sinh viên',
	[ELoaiDoiTuong.LOP_HANH_CHINH]: 'Lớp hành chính',
	[ELoaiDoiTuong.LOP_HOC_PHAN]: 'Lớp học phần',
	[ELoaiDoiTuong.NGANH]: 'Ngành',
	[ELoaiDoiTuong.TAT_CA]: 'Toàn Học viện',
};

export enum ELoaiDonViPhoiHop {
	HOC_VIEN = 'Học viện',
	NGOAI_HOC_VIEN = 'Ngoài Học viện',
}
