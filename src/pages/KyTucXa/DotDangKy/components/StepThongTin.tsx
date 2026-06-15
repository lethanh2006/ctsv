import MyDatePicker from '@/components/MyDatePicker';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select } from 'antd';

const StepThongTin = () => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item name='tenDot' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập tên đợt' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='maHocKy' label='Học kỳ' rules={[...rules.required]}>
					<SelectHocKy selectMa />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='ngayChuyenVao' label='Ngày chuyển vào' rules={[...rules.required]}>
					<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='ngayChuyenRa' label='Ngày chuyển ra' rules={[...rules.required]}>
					<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
					<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='thoiGianKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
					<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='loaiDot' label='Loại đợt' rules={[...rules.required]}>
					<Select
						options={[
							{ label: 'Theo khoa', value: 'Theo khoa' },
							{ label: 'Theo danh sách', value: 'Theo danh sách' },
						]}
						placeholder='Chọn loại đợt'
					/>
				</Form.Item>
			</Col>
			{/* <Col span={24} md={12}>
				<Form.Item name='hanDuyetMien' label='Hạn duyệt miễn'>
					<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' allowClear />
				</Form.Item>
			</Col> */}
			<Col xs={24}>
				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(2000)]}>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default StepThongTin;
