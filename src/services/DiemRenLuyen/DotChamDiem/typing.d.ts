import { type EVaiTroBieuMau } from '@/services/TienIch/constant';
import { type EHeDaoTaoRenLuyen } from './constants';

declare module DotChamDiem {
	export type TThoiGianChamDiem = {
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
	};

	export interface IRecord {
		_id: string;
		tenDot: string;
		kyHoc: string;
		heDaoTao?: EHeDaoTaoRenLuyen;
		ghiChu?: string;

		thoiGianTiepNhanMinhChung?: TThoiGianChamDiem;
		thoiGianSVChamDiem?: TThoiGianChamDiem;
		thoiGianCanSuLopChamDiem?: TThoiGianChamDiem;
		thoiGianCVHTChamDiem?: TThoiGianChamDiem;

		filter?: {
			roles?: EVaiTroBieuMau[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopHocPhan: string;
		};
		receiverType: EReceiverType;
		topics?: string[];
		users?: IUser[];
		roles?: EVaiTroBieuMau[];
	}
	export interface IUser {
		code: string;
		firstname: string;
		lastname: string;
		vaiTro?: EVaiTroBieuMau;
		thamGia?: boolean;
		fullname?: string;
	}

	export type BaoCaoLop = {
		tongSo: number;
		tongHopLopDauKy: number;
		tongHopLopGiuaKy: number;
		tongHopLopCuoiKy: number;
	};

	export type BaoCaoSinhVien = {
		tongSo: number;
		tongNoiTru: number;
		tongNgoaiTru: number;
	};
	export type BaoCaoSuKien = {
		_id: string;
		tongSinhVien: number;
		suKien: SuKien.Record;
	};
}
