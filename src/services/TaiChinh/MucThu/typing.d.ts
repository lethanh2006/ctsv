declare module MucThu {
	export interface IRecord {
		_id: string;
		currency: string;
		unitAmount: number;
		ma: string;
		name: string;
		product: string;
		mucThu: [];
		active: true;
		createdAt: string;
		updatedAt: string;
		__v: 0;
		khoanThu: {
			_id: string;
			name: string;
			nguonThu: string;
			nguonThuChiTiet: {
				_id: string;
				name: string;
			}[];
		}[];

		[key: string]: any;
	}
}
