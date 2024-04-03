import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const HuongNghiepViecLam = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG}
			phanLoaiCap2={EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM}
			title='Hoạt động hướng nghiệp, việc làm và kỹ năng mềm'
		/>
	);
};

export default HuongNghiepViecLam;
