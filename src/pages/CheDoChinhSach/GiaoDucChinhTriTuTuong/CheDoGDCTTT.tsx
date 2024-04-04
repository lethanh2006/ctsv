import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const GiaoDucChinhTriTuTuong = () => {
	return (
		<CheDoSinhVienComponent title='Giáo dục chính trị tư tưởng' loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG} />
	);
};

export default GiaoDucChinhTriTuTuong;
