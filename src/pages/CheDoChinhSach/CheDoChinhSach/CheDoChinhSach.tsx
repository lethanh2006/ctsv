import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoChinhSach = () => {
	return <CheDoSinhVienComponent title='Chế độ chính sách' loaiCheDoSinhVien={ELoaiCheDoSinhVien.CHE_DO_CHINH_SACH} />;
};

export default CheDoChinhSach;
