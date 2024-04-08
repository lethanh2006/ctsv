import { EHoatDongChungType1 } from '@/services/HoatDongChung/constants';
import ThongKeChung from './ThongKeChung';

const ThongKeGiaoDucChinhTriTuTuong = () => {
	return <ThongKeChung phanLoaiCap1={EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG} />;
};

export default ThongKeGiaoDucChinhTriTuTuong;
