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
		ssoId: string;
		cheDoSinhVienId: string;
		_id: string;
		thongTinQuyetDinh: any;
		danToc: string;
		hoVaTen: string;
		lop: {
			ten: string;
		};
		maSinhVien: string;
		nganh: {
			ten: string;
		};
		ngaySinh: string;
		gioiTinh: string;
		'nganh.ten': string;
		'lop.ten': string;
	}
}
