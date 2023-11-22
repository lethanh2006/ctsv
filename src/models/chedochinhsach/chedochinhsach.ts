import useInitModel from '@/hooks/useInitModel';
import {
	getDanhMucDoiTuongMienGiam,
	getDanhMucLoaiCheDoChinhSach,
	getDanhMucMucMienGiam,
} from '@/services/CheDoChinhSach/index';
import type { CheDoChinhSach } from '@/services/CheDoChinhSach/typings';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<CheDoChinhSach.IRecord>('che-do-chinh-sach');

	const [danhMucLoaiCheDoChinhSach, setDanhMucLoaiCheDoChinhSach] = useState<string[]>([]);
	const [danhMucMucMienGiam, setDanhMucMucMienGiam] = useState<string[]>([]);
	const [danhMucDoiTuongMienGiam, setDanhMucDoiTuongMienGiam] = useState<string[]>([]);

	const getDanhMucLoaiCheDoChinhSachModel = async () => {
		const res = await getDanhMucLoaiCheDoChinhSach();
		setDanhMucLoaiCheDoChinhSach(res?.data?.data ?? []);
	};
	const getDanhMucMucMienGiamModel = async (loaiCheDoChinhSach: string) => {
		const res = await getDanhMucMucMienGiam(loaiCheDoChinhSach);
		setDanhMucMucMienGiam(res?.data?.data ?? []);
	};
	const getDanhMucDoiTuongMienGiamModel = async (loaiCheDoChinhSach: string, loaiMucMienGiam: string) => {
		const res = await getDanhMucDoiTuongMienGiam(loaiCheDoChinhSach, loaiMucMienGiam);
		setDanhMucDoiTuongMienGiam(res?.data?.data ?? []);
	};

	return {
		...objInit,
		danhMucDoiTuongMienGiam,
		danhMucLoaiCheDoChinhSach,
		danhMucMucMienGiam,
		setDanhMucDoiTuongMienGiam,
		setDanhMucLoaiCheDoChinhSach,
		setDanhMucMucMienGiam,
		getDanhMucDoiTuongMienGiamModel,
		getDanhMucLoaiCheDoChinhSachModel,
		getDanhMucMucMienGiamModel,
	};
};
