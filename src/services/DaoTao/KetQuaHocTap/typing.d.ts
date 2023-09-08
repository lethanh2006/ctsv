import { type SinhVien } from '@/services/SinhVien/typings';
import type { ELoaiHocLuc, ETrinhDoKqhtHocKy } from '../constant';

declare module KetQuaHocKy {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maSvHk: string;

		soTinChiDat: number;
		tongSoTinChiTichLuy: number;
		tongSoTinChiNo: number;
		tongSoTinChiDaDk: number;

		trungBinhHocBong: number;
		trungBinhHocKy: number;
		trungBinhTichLuy: number;
		trinhDo: ETrinhDoKqhtHocKy;
		hocLuc: ELoaiHocLuc;
		// lopHpSvList?: LopHocPhan.IRecordSinhVienLopHP[];
	}
}
