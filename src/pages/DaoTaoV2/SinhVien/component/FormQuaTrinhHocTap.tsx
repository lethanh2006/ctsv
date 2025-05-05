import { Collapse } from 'antd';
import { useModel } from 'umi';
import HocTapSinhVienHienTaiPage from '../HocTapSinhVienHienTai';
import LopHanhChinhSinhVien from '../LopHanhChinhSinhVien';
import LopTinChiSinhVien from '../LopTinChi';

const FormQuaTrinhHocTap = () => {
	const { record } = useModel('daotaov2.sinhvien.sinhvien');

	return (
		<>
			<HocTapSinhVienHienTaiPage sinhVienSsoId={record?.ssoId} />

			<Collapse>
				<Collapse.Panel header='Lớp hành chính' key='1'>
					<LopHanhChinhSinhVien />
				</Collapse.Panel>

				<Collapse.Panel header='DS lớp tín chỉ đã học' key='2'>
					<LopTinChiSinhVien />
				</Collapse.Panel>
			</Collapse>
		</>
	);
};

export default FormQuaTrinhHocTap;
