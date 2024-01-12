import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableTieuChi from './TableTieuChi';
import TableQuyTacXepLoai from './TableQuyTacXepLoai';

const FormBieuMau = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('diemrenluyen.bieumau');

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MauDiemRenLuyen.IRecord) => {
		const payload = {
			...record,
			...values,
		};

		if (edit) {
			putModel(record?._id ?? '', payload)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'Biểu mẫu'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={24}>
						<Form.Item name='ten' label='Tên biểu mẫu' rules={[...rules.text, ...rules.required, ...rules.length(550)]}>
							<Input.TextArea placeholder='Tên biểu mẫu' />
						</Form.Item>
					</Col>
					<Col span={24} md={24}>
						<TableTieuChi />
					</Col>
					<Col span={24} md={24}>
						<TableQuyTacXepLoai />
					</Col>
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormBieuMau;
