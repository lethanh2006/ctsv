import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import type { ELoaiGiaTriMacDinh, EXepLoai } from '../constants';

declare module MauDiemRenLuyen {
	export interface TieuChiDanhGia {
		ma: string;
		ten: string;
		canDuoi: number;
		canTren: number;
		yeuCauMinhChung: boolean;
		danhSachCauHinhMinhChung: LoaiHinh.TruongThongTin[];
		coGiaTriMacDinh: boolean;
		loaiGiaTriMacDinh: ELoaiGiaTriMacDinh;
		giaTriMacDinhNhapSan: number;
		tenHamTuyBien: string;
		readonly: boolean;
	}

	export interface QuyTacXepLoai {
		canDuoi: string;
		canTren: string;
		xepLoai: EXepLoai;
	}

	export interface IRecord {
		_id: string;
		ten: string;
		ma: string;
		danhSachTieuChiDanhGia: TieuChiDanhGia[];
		danhSachQuyTacXepLoai: QuyTacXepLoai[];
	}
}
