import useInitModel from '@/hooks/useInitModel';
import { importNguoiNhanThongBao } from '@/services/ThongBao';
import { type ThongBao } from '@/services/ThongBao/typing';
import type { EVaiTroBieuMau } from '@/utils/constants';
import { ipNotif } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ThongBao.IRecord>('notification', undefined, undefined, ipNotif);
	const [sortTime, setSortTime] = useState<any[]>([]);

	const { formSubmiting, setFormSubmiting } = objInit;

	const importNguoiNhanThongBaoModel = async (payload: any, role: EVaiTroBieuMau): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		try {
			const response = await importNguoiNhanThongBao(payload, role);
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		sortTime,
		setSortTime,
		importNguoiNhanThongBaoModel,
	};
};
