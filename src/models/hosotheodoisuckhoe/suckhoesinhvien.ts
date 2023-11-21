import useInitModel from '@/hooks/useInitModel';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';

export default () => {
	const objInit = useInitModel<DotKhamSucKhoe.ISucKhoeSinhVien>('tinh-trang-suc-khoe-sinh-vien');

	return {
		...objInit,
	};
};
