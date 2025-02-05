import useInitModel from '@/hooks/useInitModel';
import { checkPhanQuyen } from '@/services/DiemRenLuyen';
import { useState } from 'react';
import useCheckAccess from '@/hooks/useCheckAccess';

export default () => {
	const objInit = useInitModel<DotChamDiemRenLuyen.IRecord>('dot-cham-diem-ren-luyen');
	const [dataPhanQuyen, setDataPhanQuyen] = useState<DotChamDiemRenLuyen.IPhanQuyen>();
	const idDuyet = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet');
	const isKhoa = useCheckAccess('ctsv|diem-ren-luyen|minh-chung|khai-bao|duyet-tong');

	const handleCheckPhanQuyen = async () => {
		try {
			const res = await checkPhanQuyen();
			if (res) {
				setDataPhanQuyen({ ...res?.data?.data, isPhongCTSV: idDuyet, isKhoa: isKhoa });
			}
		} catch (e) {
			console.log(e);
		}
	};

	return {
		...objInit,
		handleCheckPhanQuyen,
		dataPhanQuyen,
	};
};
