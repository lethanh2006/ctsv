import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import QuyetDinh from './ QuyetDinh';

const CheDoChinhSach = () => {
	return <QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.KY_LUAT} title='Danh sách sinh viên chịu kỷ luật' />;
};

export default CheDoChinhSach;
