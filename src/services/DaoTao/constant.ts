export enum ELoaiDiemChu {
	// A_PLUS = 'A+',
	A = 'A',
	B_PLUS = 'B+',
	B = 'B',
	C_PLUS = 'C+',
	C = 'C',
	D_PLUS = 'D+',
	D = 'D',
	F = 'F',
	HOAN_THI = 'I', // hoãn thi
	CHUA_DU_DU_LIEU = 'X', // chưa đủ dữ liệu
	MIEN_THI = 'R', // miễn thi
}

export enum ELoaiLopHocPhan {
	CHINH = 'C',
	LY_THUYET = 'LT',
	THUC_HANH = 'TH',
	THI_NGHIEM = 'TN',
	BAI_TAP = 'BT',
	BAI_TAP_LOP = 'BTL',
	DO_AN_TOT_NGHIEP = 'DATN',
}

export enum ETrinhDoKqhtHocKy {
	NAM_THU_1 = 'Năm thứ nhất',
	NAM_THU_2 = 'Năm thứ hai',
	NAM_THU_3 = 'Năm thứ ba',
	NAM_THU_4 = 'Năm thứ bốn',
	NAM_THU_5 = 'Năm thứ năm',
}

export enum ELoaiHocLuc {
	XUAT_SAC = 'Xuất sắc',
	GIOI = 'Giỏi',
	KHA = 'Khá',
	TRUNG_BINH = 'Trung bình',
	YEU = 'Yếu',
	KEM = 'Kém',
}

export const colorLoaiHocLuc: Record<ELoaiHocLuc, string> = {
	[ELoaiHocLuc.XUAT_SAC]: '#52c41a',
	[ELoaiHocLuc.GIOI]: '#7ecb08',
	[ELoaiHocLuc.KHA]: '#ffee04',
	[ELoaiHocLuc.TRUNG_BINH]: '#ffc20a',
	[ELoaiHocLuc.YEU]: '#ef9b20',
	[ELoaiHocLuc.KEM]: '#ea5545',
};
