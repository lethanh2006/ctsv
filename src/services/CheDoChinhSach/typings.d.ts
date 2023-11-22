import type { ELoaiThoiGianMienGiam } from './constant';

declare module CheDoChinhSach {
	export interface IRecord {
		_id: string;
		ssoId: string;
		hoTen: string;
		maDinhDanh: string;
		lop: string;
		ngaySinh: string;
		danToc: string;
		hoKhauThuongTru: string;
		loaiCheDoChinhSach: string;
		mucMienGiam: string;
		doiTuongMienGiam: string;
		loaiThoiGianMienGiam: ELoaiThoiGianMienGiam;
		maHocKyMienGiam: string;
		tenHocKyMienGiam: string;
		thoiGianMienGiamBatDau: string;
		thoiGianMienGiamKetThuc: string;
	}
}
