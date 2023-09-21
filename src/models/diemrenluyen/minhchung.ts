import useInitModel from '@/hooks/useInitModel';
import {
	ETrangThaiMinhChungDiemRenLuyen,
	locationPathMappingToELoaiMinhChungDiemRenLuyen,
} from '@/services/DiemRenLuyen/MinhChung/constants';
import { type MinhChungDiemRenLuyen } from '@/services/DiemRenLuyen/MinhChung/typing';
import { message } from 'antd';
import { last } from 'lodash';

export default () => {
	const objInit = useInitModel<MinhChungDiemRenLuyen.IRecord>('minh-chung');

	const { getModel, setLoading, putService } = objInit;

	const getLoaiMinhChung = () => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToELoaiMinhChungDiemRenLuyen[suKienType];
	};

	const getModel_: typeof getModel = (
		paramCondition,
		filterParams,
		sortParam,
		paramPage,
		paramLimit,
		path,
		otherQuery,
		isSetDanhSach,
		isAbsolutePath,
	) => {
		return getModel(
			{ ...paramCondition, loaiMinhChung: getLoaiMinhChung() },
			filterParams,
			sortParam,
			paramPage,
			paramLimit,
			path,
			otherQuery,
			isSetDanhSach,
			isAbsolutePath,
		);
	};

	const duyetMinhChungModel = async (_id: string, payload: any, getData?: any) => {
		try {
			setLoading(true);
			await putService(_id, payload);
			message.success('Cập nhật thành công');
			if (getData) getData();
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const boDuyetMinhChungModel = async (id: any, getData?: any) => {
		try {
			setLoading(true);
			await putService(id, { trangThai: ETrangThaiMinhChungDiemRenLuyen.CHO_DUYET });
			message.success('Cập nhật thành công');
			if (getData) getData();
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getLoaiMinhChung,
		getModel: getModel_,
		duyetMinhChungModel,
		boDuyetMinhChungModel,
	};
};
