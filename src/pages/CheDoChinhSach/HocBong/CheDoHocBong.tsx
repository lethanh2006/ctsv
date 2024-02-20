import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoHocBong = () => {
	return <CheDoSinhVienComponent title='Học bổng' loaiCheDoSinhVien={ELoaiCheDoSinhVien.HOC_BONG} />;
};

export default CheDoHocBong;
