declare module KhoanThu {
	export interface IRecord {
		_id: string;
		thuocTinhLoc: [];
		name: string;
		code: string;
		dinhKy: null;
		nguonThu: string;
		thuTheoDot: boolean;
		unitLabel: string;
		loaiTinhThue: string;
		xuatHoaDon: string;
		active: boolean;
		createdAt: string;
		updatedAt: string;
		__v: number;
		nguonThuChiTiet: {
			_id: string;
			name: string;
		}[];

		[key: string]: any;
	}
}
