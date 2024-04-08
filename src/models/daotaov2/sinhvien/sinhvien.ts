import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import { getKhoaNganhSinhVien, getThongKeTrangThaiSv, getTienTrinhSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SinhVien.IRecord>('sinh-vien', undefined, undefined, ipDaoTao);
	const [tienTrinhTotNghiep, setTienTrinhTotNghiep] = useState<SinhVien.ITienTrinhTotNghiep>();
	const [thongKeTrangThai, setThongKeTrangThai] = useState<SinhVien.TThongKeTrangThai>();
	const { setLoading, getModel, getService, setDanhSach } = objInit;
	const [khoaNganhSv, setKhoaNganhSv] = useState<KhoaNganh.TKhoaNganhSv>();

	const getTienTrinhTotNghiepModel = async (sinhVienSsoId: string): Promise<SinhVien.ITienTrinhTotNghiep> => {
		setLoading(true);
		try {
			const response = await getTienTrinhSinhVien(sinhVienSsoId);
			setTienTrinhTotNghiep(response?.data?.data);

			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const raSoatTienDoModel = async (
		maKhoaNganh: string,
		condition?: Partial<SinhVien.IRecord>,
	): Promise<SinhVien.IRecord[]> =>
		getModel(condition, undefined, undefined, undefined, undefined, `khoa-nganh/${maKhoaNganh}`);

	const getThongKeTrangThaiModel = async (): Promise<SinhVien.TThongKeTrangThai> => {
		setLoading(true);
		try {
			const res = await getThongKeTrangThaiSv();
			setThongKeTrangThai(res.data?.data);
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const searchSinhVienModel = async (keyword: string): Promise<SinhVien.IRecord[]> => {
		setLoading(true);
		try {
			const payloads = [
				{
					page: 1,
					limit: 20,
					filters: [{ active: true, field: 'ma', values: [keyword], operator: EOperatorType.CONTAIN }],
				},
				{
					page: 1,
					limit: 20,
					filters: [{ active: true, field: 'ten', values: [keyword], operator: EOperatorType.CONTAIN }],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: SinhVien.IRecord[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item.ssoId);
			setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getKhoaNganhSvModel = async (sinhVienSsoId: string): Promise<KhoaNganh.TKhoaNganhSv> => {
		setLoading(true);
		try {
			const response = await getKhoaNganhSinhVien(sinhVienSsoId);
			setKhoaNganhSv(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getTienTrinhTotNghiepModel,
		tienTrinhTotNghiep,
		raSoatTienDoModel,
		thongKeTrangThai,
		getThongKeTrangThaiModel,
		searchSinhVienModel,
		getKhoaNganhSvModel,
		khoaNganhSv,
		setKhoaNganhSv,
	};
};
