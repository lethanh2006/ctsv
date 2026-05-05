import type { ETrangThaiDotDangKyKTX, ETrangThaiPhong, ETrangThaiSinhVienKTX, EGioiTinh, ELoaiKhoanThu, ERuleType } from './constant';

declare module KyTucXa {
	export interface IToaKTX {
		_id: string;
		ma: string;
		ten: string;
		diaChi: string;
	}

	export interface IPhongKTX {
		_id: string;
		ma: string;
		ten?: string;

		maGioiTinh?: EGioiTinh | string;
		soLuongToiDa?: number;
		soLuongHienTai?: number;
		cachBoTri?: string;
		maKhoanThuPhong?: string;
		maKhoanThuCoc?: string;
		danhSachTienIch?: { ten: string; moTa?: string }[];
		moTa?: string;
		danhSachAnh?: string[];
		maToaNha?: string;
		dangKyKyTucXaRule?: IRuleDangKy;
	}

	export interface IRuleDangKy {
		_id?: string;
		phongId?: string;
		gioiTinh?: EGioiTinh | string;
		maxPerKhoa?: number;
		minAge?: number;
		maxAge?: number;
	}

	export interface IKhoanThuKTX {
		_id: string;
		maNamHoc: string;
		ten: string;
		loai: ELoaiKhoanThu;
		maDoiTuong: string;
		unitLabel: string;
		maMucThu: string;
		tenMucThu: string;
		unitAmount: number;
		currency: string;
	}

	export interface INamHoc {
		_id: string;
		ma: string;
		ten: string;
		thoiGianBatDau: string;
	}

	export interface IUnitLabel {
		_id: string;
		ma: string;
		donViTinh: string;
	}

	export interface IMucThuKTX {
		_id: string;
		ma: string;
		name: string;
		unitAmount: number;
	}

	// export interface IRuleDangKyThueKTX {
	// 	_id: string;
	// 	ma: string;
	// 	ten: string;
	// 	loai: ERuleType;
	// 	stt?: number;
	// 	maToaNha?: string;
	// 	maPhong?: string;
	// 	isActive: boolean;
	// 	noiDungLyDo?: string;
	// 	giaTri: IRuleDangKyThueGiaTri;
	// }

	// export type IRuleDangKyThueGiaTri =
	// 	| { gioiTinh: EGioiTinh }
	// 	| { maxPerKhoa: number }
	// 	| { minAge: number }
	// 	| { maxAge: number }
	// 	| Record<string, never>;

	export interface IDotDangKyKTX {
        _id: string;
        tenDot: string;
        maHocKy: string;
        thoiGianBatDau: string;
        thoiGianKetThuc: string;
        maKhoaNganh: string[];
        ghiChu: string;
        soLuongDon: number;
    }
}
