export enum ELoaiDanhMucChung {
	CTXH = 'Tham gia công tác xã hội',
	CAP_DAT_GIAI = 'Cấp đạt giải',
	KY_TUC_XA = 'Ký túc xá',
	PHONG_KTX = 'Phòng ký túc xá',
}

export const locationPathMappingToELoaiDungMucChung: Record<string, ELoaiDanhMucChung> = {
	'tham-gia-cong-tac-xa-hoi': ELoaiDanhMucChung.CTXH,
	'cap-dat-giai': ELoaiDanhMucChung.CAP_DAT_GIAI,
	'ky-tuc-xa': ELoaiDanhMucChung.KY_TUC_XA,
	'phong-ky-tuc-xa': ELoaiDanhMucChung.PHONG_KTX,
};

export const ELoaiDanhMucChungMappingToTitle: Record<ELoaiDanhMucChung, string> = {
	'Cấp đạt giải': 'Cấp đạt giải',
	'Ký túc xá': 'Ký túc xá',
	'Phòng ký túc xá': 'Phòng ký túc xá',
	'Tham gia công tác xã hội': 'Tham gia công tác xã hội',
};
