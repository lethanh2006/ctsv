import type { ETinhTrangSucKhoe, ETrangThaiKhaiBaoSucKhoe } from './constant';

declare module DotKhamSucKhoe {
	export interface IRecord {
		_id: string;
		ten: string;
		maHocKy: string;
		tenHocKy: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		danhSachKhoaNganh: KhoaNganh.IRecord;
		trangThai: ETrangThaiKhaiBaoSucKhoe;
	}

	export interface ISucKhoeKhaoNganh {
		_id: string;
		dotKhamSucKhoeId: string;
		maKhoaNganh: string;
		tenKhoaNganh: string;
		maKhoaSinhVien: string;
		maNganh: string;
	}

	export interface ISucKhoeSinhVien {
		_id: string;
		dotKhamSucKhoeId: string;
		dotKhamSucKhoe: IRecord;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		tinhTrangSucKhoe: ETinhTrangSucKhoe;
	}
}
