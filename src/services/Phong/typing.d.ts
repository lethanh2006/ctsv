import type { ETinhTrangSuDungTaiSan } from '@/services/SuDungTaiSanVatTu/constant';
import type { TaiSan } from '../TaiSan/typing';
import type { ELoaiDeAn, EPhanHeSuDungPhong, ETinhChatPhongHoc, ETinhTrangCoSoVatChat } from '../constant';

declare global {
	namespace Phong {
	export interface IRecord {
		_id: string;
		maToaNha: string;
		toaNha: ToaNha.IRecord;
		maKhuNha: string;
		khuNha: KhuNha.IRecord;
		tangThu: number;
		soPhong: string;
		ma: string;
		ten: string;
		maLoaiPhong: string;
		loaiPhong?: LoaiPhong.IRecord;
		idDonViSuDung: string;
		maDonViSuDung: string;
		tenDonViSuDung: string;
		sucChua: number;
		sucChuaHoc: number;
		sucChuaThi: number;
		thietBiCNC: boolean;
		danhSachTinhChatPhong: ITinhChatPhong[];
		danhSachTaiSan: TaiSan.IRecord[];
		tenVietTatTinhChatPhongCongNangChinh: string;

		dienTich: number;
		maHinhThucSoHuu: string;
		hinhThucSoHuu: HinhThucSoHuu.IRecord;
		tinhTrangCsvc: ETinhTrangCoSoVatChat;
		loaiDeAn: ELoaiDeAn;
		namDuaVaoSuDung: number;
		maLoaiCongTrinh: string;
		loaiCongTrinh: LoaiCongTrinh.IRecord;
		maMucDichSuDung: string;
		mucDichSuDung: MucDichSuDung.IRecord;
		doiTuongSuDung: string;
		vonBanDau: number;
		vonDauTu: number;
		trongTrinhTrongNha: boolean;
		soPhongCongVu: number;
		soPhongOCanBo: number;
		
		nhomPhanAnNinhId: string;
		hoanThienSanId: string;
		hoanThienTranId: string;
		heThongDieuHoaId: string;
		heThongPCCCId: string;
		mucDoHeThongNgheNhinId: string;
		chuanNoiThatId: string;
		BanVeId: string;
		maDonViSuDung: string;
		doiTuongSuDung: string	;
		createdAt: Date;
		diaChi: string;
		ghiChu: string;
		danhSachAnh?: string[] | null;
		ngayDoiTrangThai?: string;
	}

	export interface ITinhChatPhong {
		_id: string;
		maPhong: string;
		phong: IRecord;
		maLoaiPhong: string;
		loaiPhong?: LoaiPhong.IRecord;
		sucChua: 0;
		thongTinTinhChatPhong: string;
		congNangChinh: boolean;
		tinhChatPhongHoc: ETinhChatPhongHoc;
		maLinhVucDaoTao: string;
		tenLinhVucDaoTao: string;
		mucDoDapUngYeuCauNCKH: string;

		//fake data
		index: number;
	}

	export interface IDanhSachCSVC {
		_id: string;
		tenTaiSan: string;
		namSuDung: number;
		tinhTrangSuDung: string;
		soLuong: number;
	}

	export interface ILichSuSuDung {
		_id: string;
		maPhong: string;
		phong: Phong.IRecord;
		thoiGianBatDauSuDung: Date;
		thoiGianKetThucSuDung: Date;
		tenNguoiSuDung: string;
		maNguoiSuDung: string;
		ssoIdNguoiSuDung: string;
		donThueMuonPhongId: string;
		donViNguoiSuDung: string;
		maDonViSuDung: string;
		tenDonViSuDung: string;
		ghiChu: string;
		tinhTrangSuDungNhan?: ETinhTrangSuDungTaiSan;
		tinhTrangSuDungTra?: ETinhTrangSuDungTaiSan;
		sourceId: string;
		sourceType: EPhanHeSuDungPhong;

		nguoiHoc?: string[];
		canBo?: string[];

		thoiKhoaBieu?: ThoiKhoaBieu.IRecord;
	}

	//Thống kê
	export interface IThongKeTinhTrangDungPhong {
		_id: string;
		tinhTrangCsvc: ETinhTrangCoSoVatChat;
		soLuong: number;
	}

	export interface IThongKePhongDonVi {
		_id: string;
		maDonVi: string;
		tenDonVi: string;
		banKienCo: number;
		dangSuaChua: number;
		kienCo: number;
	}

	export interface IThongKeLoaiPhong {
		_id: string;
		dienTich: number;
		soLuongPhong: number;
		ten: string;
		tenVietTat: string;
	}
}
}
