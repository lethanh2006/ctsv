import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import TableCauHinh from './TableCauHinh';

const FormCheDoChinhSach = () => {
	const [form] = Form.useForm();
	const { visibleForm, record, formSubmiting, edit, setVisibleForm, putModel, postModel } = useModel(
		'chedochinhsach.chedochinhsach',
	);
	const [formValues, setFormValues] = useState<any>(record);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue({ ...record });
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...record,
			...values,
		};

		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'chế độ, chính sách'}>
			<Form
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={onFinish}
				form={form}
				layout='vertical'
			>
				<Form.Item name='ten' label='Tên' rules={[...rules.required, ...rules.text]}>
					<Input placeholder='Tên' />
				</Form.Item>
				<Form.Item name='loaiCheDoSinhVien' label='Loại' rules={[...rules.required]}>
					<Select
						placeholder='Loại'
						options={Object.values(ELoaiCheDoSinhVien).map((item) => ({ value: item, label: item }))}
					/>
				</Form.Item>

				<TableCauHinh form={form} formValues={formValues} />
				{/* <Form.Item
					extra={<div>Để trống nếu muốn hiển thị tất cả các trường thông tin</div>}
					style={{ marginTop: 8 }}
					name='danhSachCotHienThi'
					label='Danh sách cột hiển thị'
				>
					<Select
						allowClear
						options={record?.danhSachCauHinhThongTin?.map((item) => ({ label: item.ten, value: item.ma }))}
						mode='multiple'
						placeholder='Danh sách trường thông tin hiển thị'
					/>
				</Form.Item> */}
				<div className='form-footer' style={{ marginTop: 16 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};
export default FormCheDoChinhSach;
