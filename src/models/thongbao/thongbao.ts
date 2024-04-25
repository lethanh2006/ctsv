import useInitModel from '@/hooks/useInitModel';
import { type ThongBao } from '@/services/ThongBao/typing';
import { ipNotif } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ThongBao.IRecord>('notification', undefined, undefined, ipNotif);
	const [sortTime, setSortTime] = useState<any[]>([]);
	return {
		...objInit,
		sortTime,
		setSortTime,
	};
};
