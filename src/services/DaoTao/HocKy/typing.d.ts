import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { type ELoaiThoiGianNhapDiem, type ELoaiHocLuc } from '../constant';

declare module HocKy {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		namHocId: string;
		namHoc?: NamHoc.IRecord;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maHinhThucDaoTao: string;
		hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;

		thoiGianBatDau: string;
		soTuan: number;
		isKyChinh: boolean;
		isToChucDangKyNhuCau: boolean;

		nhomTietHocId: string;
		nhomTietHoc?: NhomTietHoc.IRecordCoSo;
		sySoDuKienBatBuoc: number;
		// trinhDoDaoTaoId: string;
		// trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		// hinhThucDaoTaoId: string;
		// hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
		// sySoDuKienTuChon: number;

		loaiThoiGianNhapDiemHocKy: ELoaiThoiGianNhapDiem;
		thoiGianNhapDiemBatDau?: string;
		thoiGianNhapDiemKetThuc?: string;
		soNgayNhapDiem?: number;

		active?: boolean;
		namBatDau?: number;

		// Đợt xét học vụ
		tgXetHvuSb?: string;
		tgTbKqXetHvuSb?: string;
		tgBdLayYKienHvu?: string;
		tgKtLayYKienHvu?: string;
		tgHopHoiDongHvu?: string;
		tgTbKqHvu?: string;
	}

	export interface IQuyDinhSoTinChiDangKy {
		_id: string;
		mahocKy: string;
		hocKy?: HocKy.IRecord;
		loaiHocLuc: ELoaiHocLuc;
		soTinChiToiThieu: number;
		soTinChiToiDa: number;
	}

	export interface IDeCuongHocPhanHocKy {
		_id: string;
		maHocKy: string;
		hocKy: IRecord;
		deCuongId: string;
		deCuong: HocPhan.IDeCuongHocPhan;
	}
}
