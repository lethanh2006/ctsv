import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DauDiemHocPhan.IRecord>('hinh-thuc-danh-gia', undefined, undefined, undefined, {
		field: 1,
	});

	return {
		...objInit,
	};
};
