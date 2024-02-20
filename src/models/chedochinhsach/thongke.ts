import useInitModel from '@/hooks/useInitModel';
import { getDataThongKeExcel } from '@/services/CheDoSinhVien';
import type { ThongKeQuyTrinhDong } from '@/services/QuyTrinhDong/ThongKe/typings';
import fileDownload from 'js-file-download';

export default () => {
	const objInit = useInitModel<ThongKeQuyTrinhDong.IRecord>('thong-ke-cdsv');
	const { setLoading } = objInit;

	const getDataThongKeExcelModel = async (tenThongKe: string, id: string, payload?: { filters: string[] }) => {
		try {
			setLoading(true);
			const res = await getDataThongKeExcel(id, payload);
			fileDownload(res.data, `${tenThongKe}.xlsx`);
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getDataThongKeExcelModel,
	};
};
