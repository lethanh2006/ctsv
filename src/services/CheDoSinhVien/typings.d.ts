import type { LoaiHinh } from '../QuyTrinhDong/LoaiHinh/typing';
import type { ELoaiCheDoSinhVien } from './constant';

declare module CheDoSinhVien {
	export interface IRecord {
		_id: string;
		ten: string;
		loaiCheDoSinhVien: ELoaiCheDoSinhVien;
		danhSachCauHinhThongTin: LoaiHinh.TruongThongTin[];
	}

	export interface QuyetDinhCheDoSinhVien {
		cheDoSinhVienId: string;
		_id: string;
		thongTinQuyetDinh: any;
	}
}
