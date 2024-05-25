import type { EVaiTroPhamViQuyTrinh } from '../QuyTrinhDong/constant';
import type { EDonViTinh, ELoaiDoiTuong } from './constants';

declare module HoatDongChung {
	export interface IDuToanKinhPhi {
		_id: string;
		soThuTu: number;
		keHoachHoatDongNamId: string;
		hoatDong: string;
		donViTinh: string;
		donViTinhKhac: string;
		soLuong: number;
		soLuongNguoi: number;
		soLuongNgay: number;
		soLuongKhac: number;
		dinhMuc: number;
		ghiChu: string;
		tienDoHoanThanh: string;
		tepDinhKem: string[] | null;
		chungTuYeuCau: string;
		info: string;

		//fake data
		index: number;
	}

	export interface PhamViHoatDong {
		loaiDoiTuong: ELoaiDoiTuong;
		danhSachLoaiVaiTro: EVaiTroPhamViQuyTrinh[];
		ghiChu: string;
		danhSachMaThamChieu: string[];
	}

	export interface IRecord {
		_id: string;
		phanLoaiCap1: string;
		phanLoaiCap2: string;
		ten: string;
		maHocKy: string;
		loai: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		danhSachDuToanKinhPhi: IDuToanKinhPhi[];
		danhSachPhamVi: PhamViHoatDong[];
		diaDiem: string;
		soLuongThamGia: number;
		info: {
			type: string;
			refId: string;
		};
	}
}
