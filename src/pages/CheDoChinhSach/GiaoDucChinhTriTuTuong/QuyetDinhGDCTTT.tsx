import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhGDCTTT = () => {
	return <QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG} title='Kết quả giáo dục chính trị tư tưởng' />;
};

export default QuyetDinhGDCTTT;
