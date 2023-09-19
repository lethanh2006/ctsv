declare module KhoaNganh {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maChuongTrinh: string;
		chuongTrinh?: ChuongTrinhDaoTao.IRecord;
		maKhoaSinhVien: string;
		khoaSinhVien: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh: NganhDaoTao.IRecordCoSo;
		namBatDau?: number;
		namKetThuc?: number;
		createdAt?: string;
		updatedAt?: string;
	}
}
