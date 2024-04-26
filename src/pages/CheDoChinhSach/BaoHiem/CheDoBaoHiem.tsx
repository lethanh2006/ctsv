import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoBaoHiem = () => {
	return <CheDoSinhVienComponent title='Bảo hiểm xã hội' loaiCheDoSinhVien={ELoaiCheDoSinhVien.BAO_HIEM} />;
};

export default CheDoBaoHiem;
