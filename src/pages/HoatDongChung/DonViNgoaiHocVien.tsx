import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const DonViNgoaiHocVien = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.NGOAI_HOC_VIEN}
			title='Các đơn vị ngoài Học viện'
		/>
	);
};

export default DonViNgoaiHocVien;
