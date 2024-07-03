import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const HoatDongHuyDongGiaoDucTuTuongChinhTri = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG}
			phanLoaiCap2={EHoatDongChungType2.HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI}
			title='Hoạt động huy động giáo dục tư tưởng chính trị'
		/>
	);
};

export default HoatDongHuyDongGiaoDucTuTuongChinhTri;
