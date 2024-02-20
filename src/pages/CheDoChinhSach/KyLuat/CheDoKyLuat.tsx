import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoKyLuat = () => {
	return <CheDoSinhVienComponent title='Kỷ luật' loaiCheDoSinhVien={ELoaiCheDoSinhVien.KY_LUAT} />;
};

export default CheDoKyLuat;
