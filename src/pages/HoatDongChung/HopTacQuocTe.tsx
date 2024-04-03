import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const HopTacQuocTe = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO}
			title='Nghiên cứu khoa học và chuyển giao công nghệ'
		/>
	);
};

export default HopTacQuocTe;
