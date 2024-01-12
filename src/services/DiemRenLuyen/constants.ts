export enum ELoaiGiaTriMacDinh {
	NHAP_SAN = 'NHAP_SAN',
	QUY_DOI_MINH_CHUNG = 'QUY_DOI_MINH_CHUNG',
	HAM_TUY_BIEN = 'HAM_TUY_BIEN',
}

export const MapKeyNameLoaiGiaTriMacDinh = {
	[ELoaiGiaTriMacDinh.NHAP_SAN]: 'Nhập sẵn',
	[ELoaiGiaTriMacDinh.QUY_DOI_MINH_CHUNG]: 'Quy đổi từ minh chứng',
	[ELoaiGiaTriMacDinh.HAM_TUY_BIEN]: 'Hàm tùy biến',
};

export enum EXepLoai {
	XUAT_SAC = 'XUAT_SAC',
	TOT = 'TOT',
	KHA = 'KHA',
	TRUNG_BINH = 'TRUNG_BINH',
	YEU = 'YEU',
	KEM = 'KEM',
}

export const MapKeyNameXepLoai = {
	[EXepLoai.XUAT_SAC]: 'Xuất sắc',
	[EXepLoai.TOT]: 'Tốt',
	[EXepLoai.KHA]: 'Khá',
	[EXepLoai.TRUNG_BINH]: 'Trung bình',
	[EXepLoai.YEU]: 'Yếu',
	[EXepLoai.KEM]: 'Kém',
};
