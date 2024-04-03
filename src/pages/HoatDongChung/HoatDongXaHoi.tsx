import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const HoatDongXaHoi = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.HOAT_DONG_XA_HOI}
			title='Hoạt động xã hội, thiện nguyện'
		/>
	);
};

export default HoatDongXaHoi;
