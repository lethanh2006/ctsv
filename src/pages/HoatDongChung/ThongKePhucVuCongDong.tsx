import { EHoatDongChungType1 } from '@/services/HoatDongChung/constants';
import ThongKeChung from './ThongKeChung';

const ThongKePhucVuCongDong = () => {
	return <ThongKeChung phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG} />;
};

export default ThongKePhucVuCongDong;
