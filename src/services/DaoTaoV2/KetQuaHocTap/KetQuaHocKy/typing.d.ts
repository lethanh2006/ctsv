import { type HocKy } from '@/services/HocKy/HocKy/typing';
import { type ELoaiHocLuc } from '@/services/HocKy/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import { type ETrinhDoKqhtHocKy } from '@/services/constant';
import { type LopHocPhan } from '@/services/HocKy/LopHocPhan/typing';

declare module KetQuaHocKy {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maSvHk: string;

		// Học kỳ
		trungBinhHocKy: number; //TBC học kỳ (hệ 10)
		trungBinhHocKyThang4: number; //TBC học kỳ (hệ 4)
		tongSoTinChiHocKy: number; //Số tín chỉ đạt học kỳ
		tongSoTinChiTichLuyHocKy: number; // Số tín chỉ tích lũy học kỳ
		trungBinhHocBongHocKyThang4: number; // TBC học bổng trong kỳ
		tongSoTinChiNoHocKy: number; // Số tín chỉ nợ trong kỳ

		// Toàn khóa
		trungBinhTichLuyToanKhoa: number;
		trungBinhTichLuyToanKhoaThang4: number;
		tongSoTinChiTichLuyToanKhoa: number;
		tongSoTinChiNoToanKhoa: number;

		tongSoTinChiDangKyHocKy: number;
		tongSoTinChiDangKyToanKhoa: number;

		tongSoTinChiHocCaiThien: number;
		tongSoTinChiHocLai: number;
		tongSoTinChiThiCaiThien: number;
		tongSoTinChiThiLai: number;

		trinhDo: ETrinhDoKqhtHocKy;
		hocLuc: ELoaiHocLuc;
		// lopHpSvList?: LopHocPhan.IRecordSinhVienLopHP[];

		thuTuHocKy?: number;
	}

	export interface IKetQuaTichLuy {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: SinhVien;

		trungBinh: number;
		trungBinhThang4: number;

		tongSoTinChi: number;
		tongSoTinChiNo: number;
		tongSoTinChiDangKy: number;

		tongSoTinChiHocLai?: number;
		tongSoTinChiHocCaiThien?: number;
		tongSoTinChiThiLai?: number;
		tongSoTinChiThiCaiThien?: number;

		hocLuc: ELoaiHocLuc;
		trinhDo: ETrinhDoKqhtHocKy;
		thuTuHocKy?: number;
	}
}
