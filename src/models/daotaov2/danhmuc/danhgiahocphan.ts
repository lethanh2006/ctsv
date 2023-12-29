import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DanhGiaHocPhan.IRecord>('danh-gia-hoc-phan');

	return {
		...objInit,
	};
};
