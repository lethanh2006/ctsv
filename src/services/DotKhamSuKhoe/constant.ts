import type { DotKhamSucKhoe } from './typing';

export enum ETrangThaiKhamSucKhoe {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export const colorETrangThaiKhaiBaoSucKhoe: Record<ETrangThaiKhamSucKhoe, string> = {
	[ETrangThaiKhamSucKhoe.CHO_DUYET]: 'blue',
	[ETrangThaiKhamSucKhoe.DA_DUYET]: 'green',
	[ETrangThaiKhamSucKhoe.YEU_CAU_CHINH_SUA]: 'orange',
};

export enum ETinhTrangSucKhoe {
	BINH_THUONG = 'Bình thường',
	CO_BENH = 'Có bệnh',
	CHUA_DANH_GIA = 'Chưa đánh giá',
}

export const colorETinhTrangSucKhoe: Record<ETinhTrangSucKhoe, string> = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'green',
	[ETinhTrangSucKhoe.CO_BENH]: 'red',
	[ETinhTrangSucKhoe.CHUA_DANH_GIA]: 'default',
};

export const fieldTinhTrangSucKhoe: Record<ETinhTrangSucKhoe, keyof DotKhamSucKhoe.IThongKeSucKhoeSinhVien> = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'binhThuong',
	[ETinhTrangSucKhoe.CO_BENH]: 'coBenh',
	[ETinhTrangSucKhoe.CHUA_DANH_GIA]: 'chuaDanhGia',
};
