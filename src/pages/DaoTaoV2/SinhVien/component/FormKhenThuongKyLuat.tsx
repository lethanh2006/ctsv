import QuyetDinh from '@/pages/CheDoChinhSach/QuyetDinh';
import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { Collapse } from 'antd';
import { useModel } from 'umi';

const FormKhenThuongKyLuat = () => {
	const { record } = useModel('daotaov2.sinhvien.sinhvien');

	return (
		<>
			<Collapse destroyInactivePanel accordion>
				<Collapse.Panel header='Thông tin khen thưởng' key={'1'}>
					{/* <KhenThuongSinhVienPage/> */}
					<QuyetDinh
						filterWidth={600}
						ssoId={record?.ssoId}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.KHEN_THUONG}
						title='Danh sách sinh viên được khen thưởng'
					/>
				</Collapse.Panel>

				<Collapse.Panel header='Thông tin kỷ luật' key={'2'}>
					{/* <KyLuatSinhVienPage /> */}
					<QuyetDinh
						filterWidth={200}
						ssoId={record?.ssoId}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.KY_LUAT}
						title='Danh sách sinh viên được khen thưởng'
					/>
				</Collapse.Panel>
			</Collapse>
		</>
	);
};

export default FormKhenThuongKyLuat;
