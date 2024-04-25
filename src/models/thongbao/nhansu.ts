import type { TFilter } from '@/components/Table/typing';
import { postReceiver } from '@/services/ThongBao';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>();
	const [danhSach, setDanhSach] = useState<ThongBao.IUser[]>([]);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [filters, setFilters] = useState<TFilter<ThongBao.IUser>[]>([]);

	const getModel = async (danhSachDoiTuong?: Record<string, string[]>): Promise<ThongBao.IUser[]> => {
		setLoading(true);
		try {
			const payload = { role: EVaiTroBieuMau.NHAN_VIEN, ...(danhSachDoiTuong ?? {}) };
			const params = { page, limit, filters };
			const response = await postReceiver(payload, params);
			setDanhSach(response?.data?.data?.result ?? []);
			setTotal(response?.data?.data?.total ?? 0);

			return response?.data?.data?.result;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		setLoading,
		danhSach,
		setDanhSach,
		page,
		setPage,
		limit,
		setLimit,
		total,
		setTotal,
		filters,
		setFilters,
		getModel,
	};
};
