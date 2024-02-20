import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoKhenThuong = () => {
	return <CheDoSinhVienComponent title='Khen thưởng' loaiCheDoSinhVien={ELoaiCheDoSinhVien.KHEN_THUONG} />;
};

export default CheDoKhenThuong;
