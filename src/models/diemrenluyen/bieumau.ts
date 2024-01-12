import useInitModel from '@/hooks/useInitModel';
import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<MauDiemRenLuyen.IRecord>('drl/mau-drl');
	const [recordTieuChi, setRecordTieuChi] = useState<MauDiemRenLuyen.TieuChiDanhGia>();
	const [recordQuyTacXepLoai, setRecordQuyTacXepLoai] = useState<MauDiemRenLuyen.QuyTacXepLoai>();
	const [recordCauHinh, setRecordCauHinh] = useState<LoaiHinh.TruongThongTin>();
	const [recordCot, setRecordCot] = useState<LoaiHinh.Cot>();
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);

	return {
		...objInit,
		recordTieuChi,
		setRecordTieuChi,
		recordCauHinh,
		setRecordCauHinh,
		visiblePreview,
		setVisiblePreview,
		recordCot,
		setRecordCot,
		recordQuyTacXepLoai,
		setRecordQuyTacXepLoai,
	};
};
