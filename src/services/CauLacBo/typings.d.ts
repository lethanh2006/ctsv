import type { EChucVuThanhVienCauLacBo, EVaiTroThanhVienPhongBan } from './constant';

declare module CauLacBo {
	export interface IRecord {
		_id: string;
		ten: string;
		logo: string | null;
		slogan: string;
		mucDich: string;
		yNghia: string;
		donViQuanLy: string;
		noiQuyQuyChe: string | null;
		quyetDinhThanhLap: string | null;
	}

	export interface PhongBan {
		_id: string;
		cauLacBoId: string;
		ten: string;
		moTa: string;
	}

	export interface ThanhVien {
		_id: string;
		sinhVienSsoId: string;
		hoTen: string;
		maSinhVien: string;
		cauLacBoId: string;
		chucVuThanhVienCauLacBo: EChucVuThanhVienCauLacBo;
		namHoc: string;
		vaiTroThanhVienBanBoPhan: EVaiTroThanhVienPhongBan;
		banBoPhanId: string;
	}
}
