export enum ETrangThaiKhaiBaoSucKhoe {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorETrangThaiKhaiBaoSucKhoe: Record<ETrangThaiKhaiBaoSucKhoe, string> = {
	[ETrangThaiKhaiBaoSucKhoe.CHO_DUYET]: 'blue',
	[ETrangThaiKhaiBaoSucKhoe.DA_DUYET]: 'green',
	[ETrangThaiKhaiBaoSucKhoe.KHONG_DUYET]: 'orange',
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
