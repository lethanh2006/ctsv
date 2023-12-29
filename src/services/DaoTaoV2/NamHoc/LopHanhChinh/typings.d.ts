import { type SinhVien } from '@/services/SinhVien/typings';
import { type ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type { EDoiTuongLopHanhChinh } from '@/services/constant';

declare module LopHanhChinh {
	export interface IRecord {
		_id: string;
		ten: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		siSo: number;
		nhanSuSsoId?: string;
		nhanSu?: ToChucNhanSu.INhanSu;
		doiTuong?: EDoiTuongLopHanhChinh;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordSinhVien {
		_id: string;
		lopHanhChinhId: string;
		lopHanhChinh?: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
	}
}
