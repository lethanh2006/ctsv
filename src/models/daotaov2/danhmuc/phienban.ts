import useInitModel from '@/hooks/useInitModel';
import { type PhienBan } from '@/services/DaoTaoV2/DanhMucHeThong/PhienBan/typing';

export default () => {
	const objInit = useInitModel<PhienBan.IRecord>('phien-ban');

	return {
		...objInit,
	};
};
