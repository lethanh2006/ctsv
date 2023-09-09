import { Divider } from 'antd';
import { useModel } from 'umi';
import HocTapSinhVienHienTaiPage from '../HocTapSinhVienHienTai';
import LopHanhChinhSinhVien from '../LopHanhChinhSinhVien';

const FormQuaTrinhHocTap = () => {
	const { record } = useModel('sinhvien.sinhvien');

	return (
		<>
			<HocTapSinhVienHienTaiPage sinhVienSsoId={record?.ssoId} />

			<Divider orientation='center'>Lớp hành chính</Divider>
			<LopHanhChinhSinhVien />
		</>
	);
};

export default FormQuaTrinhHocTap;
