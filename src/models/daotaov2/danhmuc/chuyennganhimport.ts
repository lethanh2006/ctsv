import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<NganhDaoTao.IRecordCoSo>('chuyen-nganh');

	return {
		...objInit,
	};
};
