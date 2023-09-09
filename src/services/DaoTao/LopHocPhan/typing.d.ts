import type { SinhVien } from '@/services/SinhVien/typings';
import type { ELoaiDiemChu, ELoaiLopHocPhan } from '../constant';

declare module LopHocPhan {
	export interface IRecord {
		_id: string;
		ten: string;
		tenCha?: string;
		// maLop: string;
		// maLopCha?: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		siSoToiDa: number;
		siSo?: number; // Sĩ số hiện tại
		loai: ELoaiLopHocPhan;
		// parentId?: string | null;
		soThuTuLop?: number;
		soThuTuNhom?: number;

		parent?: IRecord;
		children?: IRecord[];
		// maHoaLichHoc?: TMaHoaLichHoc[];
		// thoiKhoaBieuList?: ThoiKhoaBieu.IRecord;
	}

	export interface IRecordSinhVienLopHP extends IDiemThanhPhan, IDiemThi, IDiemTongKet {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan?: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;

		// khoa: boolean;
		// khoaDiemThi: boolean;
		// nopDiem: boolean;
		public?: boolean;
		publicDiemThi?: boolean;

		maSvHk?: string; // {ssoId}|{maHocKy}
		idPhieuDktc?: string;
		// phieuDktc: ;

		// loai?: ELoaiHocPhanDangKyTinChi;

		// temp for đăng ký học phần
		// lopChuyenToi?: IRecord; // Temp
		// trangThaiChuyenLop?: { success: boolean; reason: string };
	}

	export interface IDiemThanhPhan {
		diemThanhPhan1?: number;
		diemThanhPhan2?: number;
		diemThanhPhan3?: number;
		diemThanhPhan4?: number;
		diemThanhPhan5?: number;
		diemThanhPhan6?: number;
		diemThanhPhan7?: number;
		diemThanhPhan8?: number;
		diemThanhPhan9?: number;
		diemThanhPhan10?: number;
		// trangThaiThi?: ETrangThaiThi;
	}

	export interface IDiemThi {
		diemThi1?: number;
		diemThamDinh?: number;
		diemPhucKhao?: number;
		diemThi2?: number;
	}

	export interface IDiemTongKet {
		diemKthp?: number;
		diemTongKet?: number;
		diemThang4?: number;
		diemChu?: ELoaiDiemChu;
	}
}
