import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { Button, Descriptions, Divider, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewDiemLopHocPhan = (props: {
	visible: boolean;
	setVisible: (vis: boolean) => void;
	sinhVienLopHocPhanId?: string;
}) => {
	const { visible, setVisible, sinhVienLopHocPhanId } = props;
	const { record, getByIdModel } = useModel('daotaov2.hocky.sinhvienlophocphan');
	// const { record: recordLopHP, getByIdModel: getLopHocPhan } = useModel('daotaov2.hocky.lophocphan');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');

	useEffect(() => {
		getDauDiem();
	}, []);

	useEffect(() => {
		if (visible && sinhVienLopHocPhanId) getByIdModel(sinhVienLopHocPhanId); //.then((diemLHP) => getLopHocPhan(diemLHP.lopHocPhanId));
	}, [visible, sinhVienLopHocPhanId]);

	return (
		<>
			<Modal
				open={visible}
				onCancel={() => setVisible(false)}
				title='Thông tin sinh viên lớp tín chỉ'
				width={600}
				footer={<Button onClick={() => setVisible(false)}>Đóng</Button>}
			>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					<Descriptions.Item label='Mã sinh viên'>{record?.sinhVien?.ma}</Descriptions.Item>
					<Descriptions.Item label='Họ tên'>{record?.sinhVien?.ten}</Descriptions.Item>
					<Descriptions.Item label='Lớp tín chỉ'>{record?.lopHocPhan?.ten}</Descriptions.Item>
					<Descriptions.Item label='Học phần'>
						{record?.lopHocPhan?.hocPhan?.ma ?? ''} - {record?.lopHocPhan?.hocPhan?.soTinChi ?? ''} tín chỉ
					</Descriptions.Item>
					<Descriptions.Item label='Tên học phần' span={2}>
						{record?.lopHocPhan?.hocPhan?.ten}
					</Descriptions.Item>
				</Descriptions>

				<Divider>Điểm thành phần</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					{danhSachDauDiem?.map((item) => (
						<Descriptions.Item label={item.ten} key={item._id}>
							{record?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IRecordSinhVienLopHP] ?? '--'}
						</Descriptions.Item>
					))}
				</Descriptions>

				<Divider>Điểm kết thúc học phần</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					<Descriptions.Item label='Điểm thi lần 1'>{record?.diemThi1 ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Điểm thẩm định'>{record?.diemThamDinh ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Điểm phúc khảo'>{record?.diemPhucKhao ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Điểm thi lần 2'>{record?.diemThi2 ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Điểm cuối'>{record?.diemKthp ?? '--'}</Descriptions.Item>
				</Descriptions>

				<Divider>Điểm tổng kết</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					<Descriptions.Item label='Điểm thang 10'>{record?.diemTongKet ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Điểm thang 4'>{record?.diemThang4 ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Điểm chữ'>{record?.diemChu ?? '--'}</Descriptions.Item>
				</Descriptions>
			</Modal>
		</>
	);
};

export default ViewDiemLopHocPhan;
