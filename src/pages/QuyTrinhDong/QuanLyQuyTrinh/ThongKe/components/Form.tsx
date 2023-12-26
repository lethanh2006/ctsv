import JsonEditor from '@/components/JsonEditor';
import {
	ELoaiBieuDoThongKe,
	ELoaiFilterThongKe,
	ELoaiThongKeQuyTrinhDong,
	MapKeyLoaiThongKe,
} from '@/services/QuyTrinhDong/ThongKe/constant';
import type { ThongKeQuyTrinhDong } from '@/services/QuyTrinhDong/ThongKe/typings';

import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThongKe = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quytrinh.thongke');

	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');

	const danhSachFilterThongKe = Form.useWatch('danhSachFilterThongKe', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				aggregationArray: JSON.stringify(record?.aggregationArray ?? {}, undefined, 2),
			});
		} else {
			form.setFieldsValue({
				aggregationArray: undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ThongKeQuyTrinhDong.IRecord) => {
		const payload = {
			...record,
			...values,
			quyTrinhId: recordQuyTrinh?._id,
			aggregationArray: JSON.parse(values?.aggregationArray),
		};

		if (edit) {
			putModel(record?._id ?? '', payload);
		} else postModel(payload);
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'mẫu thống kê'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='ma' label='Mã' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Mã' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='loaiThongKe' label='Loại thống kê' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiThongKeQuyTrinhDong).map((item) => ({
									value: item,
									label: MapKeyLoaiThongKe[item],
								}))}
								placeholder='Loại thống kê'
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='ten' label='Tên' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Tên' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='loaiBieuDoThongKe' label='Loại biểu đồ thống kê' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiBieuDoThongKe).map((item) => ({
									value: item,
									label: item,
								}))}
								placeholder='Loại biểu đồ thống kê'
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label='Cấu hình biểu mẫu' name={'aggregationArray'} rules={[...rules.required, ...rules.json]}>
							<JsonEditor />
						</Form.Item>
					</Col>
				</Row>

				<div>Danh sách bộ lọc</div>
				<Form.List name='danhSachFilterThongKe'>
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<Card
									style={{ margin: '8px 0px' }}
									key={index}
									size='small'
									title={
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div>Bộ lọc {index + 1}</div>
											<div>
												<CloseOutlined className='dynamic-delete-button' onClick={() => remove(field.name)} />
											</div>{' '}
										</div>
									}
								>
									<Form.Item {...field} rules={[...rules.required]} label={'Tên bộ lọc'} name={[index, 'tenThongKe']}>
										<Input placeholder='Tên bộ lọc' />
									</Form.Item>
									<Form.Item
										{...field}
										rules={[...rules.required]}
										label='Loại bộ lọc'
										name={[index, 'loaiFilterThongKe']}
									>
										<Select
											placeholder='Loại bộ lọc'
											options={Object.values(ELoaiFilterThongKe).map((item) => ({ value: item, label: item }))}
										/>
									</Form.Item>
									{danhSachFilterThongKe?.[index]?.loaiFilterThongKe === ELoaiFilterThongKe.TRUONG_THONG_TIN && (
										<Form.Item
											{...field}
											rules={[...rules.required]}
											label={'Trường thông tin thống kê'}
											name={[index, 'truongThongTinThongKe']}
										>
											<Input placeholder='Trường thông tin thống kê' />
										</Form.Item>
									)}
								</Card>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
									Thêm bộ lọc
								</Button>
								<Form.ErrorList errors={errors} />
							</Form.Item>
						</>
					)}
				</Form.List>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongKe;
