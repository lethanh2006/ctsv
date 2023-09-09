import MyDatePicker from '@/components/MyDatePicker';
import { Col, Form, Input, Row } from 'antd';

const FormTuyenSinh = () => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={12}>
				<Form.Item name='doiTuongDauVao' label='Đối tượng đầu vào'>
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={12} md={12}>
				<Form.Item name='diemTrungTuyen' label='Kết quả tuyển sinh'>
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item name='soQuyetDinhTrungTuyen' label='Số quyết định trúng tuyển'>
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item name='ngayKyQuyetDinhTrungTuyen' label='Ngày ký quyết định trúng tuyển'>
					<MyDatePicker disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item name='ngayNhapHoc' label='Ngày nhập học'>
					<MyDatePicker disabled />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormTuyenSinh;
