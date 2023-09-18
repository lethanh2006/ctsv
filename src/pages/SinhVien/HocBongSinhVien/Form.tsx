import MyDatePicker from '@/components/MyDatePicker';
import SelectLoaiHocBong from '@/pages/DanhMuc/LoaiHocBong/components/Select';
import { type SinhVien } from '@/services/SinhVien/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormHocBongSinhVien = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel('sinhvien.hocbong');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { title } = props;

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id]);

	const getData = () => getModel({ sinhVienSsoId: recSinhVien?.ssoId });

	const onFinish = async (values: SinhVien.IHocBongSinhVien) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel({ ...values, sinhVienSsoId: recSinhVien?.ssoId ?? '' }, getData)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='ten' label='Tên học bổng' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên học bổng' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='donViTaiTro' label='Đơn vị tài trợ' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập đơn vị tài trợ' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='thoiGianTraoTangHocBong' label='Thời gian trao tặng học bổng' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='loaiHocBongId' label='Loại học bổng'>
							<SelectLoaiHocBong />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='giaTriHocBong' label='Giá trị học bổng'>
							<InputNumber placeholder='Nhập số tiền học bổng trao tặng' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormHocBongSinhVien;
