import type { MauDiemRenLuyen } from '../BieuMau/typings';
import type { ELoaiDoiTuongChamDiem } from '../constants';

declare module DotDiemRenLuyen {
	export interface DoiTuongChamDiem {
		thoiGian: any;
		loaiDoiTuongChamDiem: ELoaiDoiTuongChamDiem;
		thoiGianBatDauCham: string;
		thoiGianKetThucCham: string;
	}

	export interface IRecord {
		_id: string;
		maHocKy: string;
		danhSachDoiTuongChamDiem: DoiTuongChamDiem[];
		mauDrlId: string;
		mauDrl: MauDiemRenLuyen.IRecord;
	}
}
