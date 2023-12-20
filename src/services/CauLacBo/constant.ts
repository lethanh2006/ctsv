export enum EChucVuThanhVienCauLacBo {
	CHU_NHIEM = 'CHU_NHIEM',
	PHO_CHU_NHIEM = 'PHO_CHU_NHIEM',
	UY_VIEN = 'UY_VIEN',
}

export enum EVaiTroThanhVienPhongBan {
	TRUONG_BAN = 'TRUONG_BAN',
	PHO_TRUONG_BAN = 'PHO_TRUONG_BAN',
}

export const MapKeyChucVuThanhVienCLB = {
	[EChucVuThanhVienCauLacBo.UY_VIEN]: 'Ủy viên',
	[EChucVuThanhVienCauLacBo.PHO_CHU_NHIEM]: 'Phó chủ nhiệm',
	[EChucVuThanhVienCauLacBo.CHU_NHIEM]: 'Chủ nhiệm',
};

export const MapKeyVaiTroThanhVienPhongBanCLB = {
	[EVaiTroThanhVienPhongBan.PHO_TRUONG_BAN]: 'Phó trưởng ban',
	[EVaiTroThanhVienPhongBan.TRUONG_BAN]: 'Trưởng ban',
};
