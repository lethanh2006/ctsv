import useInitModel from '@/hooks/useInitModel';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<CheDoSinhVien.QuyetDinhCheDoSinhVien>('quyet-dinh-cdsv');
	const [visibleView, setVisibleView] = useState<boolean>(false);
	return {
		...objInit,
		visibleView,
		setVisibleView,
	};
};
