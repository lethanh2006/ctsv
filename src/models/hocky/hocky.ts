import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import { type HocKy } from '@/services/DaoTao/HocKy/typing';
import { ipDaoTao } from '@/utils/ip';

/** Trình độ đào tạo: Đại học */
export const initTrinhDo = '7';

/** Hình thức đào tạo: Chính quy */
export const initHinhThuc = '1';

export default () => {
	const objInit = useInitModel<HocKy.IRecord>('hoc-ky', undefined, undefined, ipDaoTao, undefined, [
		{
			active: true,
			field: 'maTrinhDoDaoTao',
			values: [initTrinhDo],
			operator: EOperatorType.INCLUDE,
		},
		{
			active: true,
			field: 'maHinhThucDaoTao',
			values: [initHinhThuc],
			operator: EOperatorType.INCLUDE,
		},
	]);

	return {
		...objInit,
	};
};
