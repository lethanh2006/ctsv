import useInitModel from '@/hooks/useInitModel';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';

export default () => {
	const objInit = useInitModel<BieuMau.Record>('khao-sat');

	return {
		...objInit,
	};
};
