import type { KyTucXa } from '@/services/KyTucXa/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UploadFile from '@/components/Upload/UploadFile';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import SelectKhoanThu from './SelectKhoanThu';
import { EGioiTinh } from '@/services/KyTucXa/constant';

const FormPhongKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { danhSach: danhSachToaNha, getAllModel: getAllToaNha } = useModel('kytucxa.toa');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('kytucxa.phong');

	useEffect(() => {
		getAllToaNha();
		if (!visibleForm) return;
		if (record?._id) form.setFieldsValue(record);
		else resetFieldsForm(form);
	}, [record?._id, visibleForm]);

	const isView = false;

	const onFinish = async (values: KyTucXa.IPhongKTX) => {
		try {
			const danhSachAnh = await buildUpLoadMultiFile(values, 'danhSachAnh');
			const { dangKyKyTucXaRule, ...restValues } = values as any;
			const finalValues = { 
				...restValues, 
				...(dangKyKyTucXaRule || {}),
				danhSachAnh: danhSachAnh ?? [] 
			};

			if (edit) {
				await putModel(record?.ma ?? record?._id ?? '', finalValues);
			} else {
				await postModel(finalValues);
			}
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} cấu hình phòng`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{edit && (
						<Col xs={24}>
							<div style={{ marginBottom: 12, padding: '8px 12px', background: '#f5f5f5', borderRadius: 6 }}>
								<span style={{ fontWeight: 500 }}>Phòng: </span>{record?.ten}
								{record?.maToaNha && <span style={{ marginLeft: 16 }}><span style={{ fontWeight: 500 }}>Tòa: </span>{danhSachToaNha?.find((item: KyTucXa.IToaKTX) => item?.ma === record?.maToaNha)?.ten || '-'}</span>}
							</div>
						</Col>
					)}
					<Col xs={24}>
						<div className='fw500' style={{ marginBottom: 8, marginTop: 12 }}>
							Quy định đăng ký
						</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'gioiTinh']} label='Giới tính cho phép'>
							<Select
								disabled={isView}
								placeholder='Chọn giới tính'
								options={[
									{ value: EGioiTinh.NAM, label: 'Nam' },
									{ value: EGioiTinh.NU, label: 'Nữ' },
								]}
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'maxPerKhoa']} label='Số SV tối đa mỗi khoa'>
							<InputNumber disabled={isView} min={1} style={{ width: '100%' }} placeholder='Ví dụ: 2' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'minAge']} label='Tuổi tối thiểu'>
							<InputNumber disabled={isView} min={0} style={{ width: '100%' }} placeholder='Ví dụ: 18' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['dangKyKyTucXaRule', 'maxAge']} label='Tuổi tối đa'>
							<InputNumber disabled={isView} min={0} style={{ width: '100%' }} placeholder='Ví dụ: 30' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soLuongToiDa' label='Số lượng tối đa' rules={[...rules.required]}>
							<InputNumber disabled={isView} min={1} style={{ width: '100%' }} placeholder='Nhập số lượng tối đa' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='cachBoTri' label='Cách bố trí phòng'>
							<Input disabled={isView} placeholder='Nhập cách bố trí (ví dụ: 3 tầng, mỗi tầng 2 phòng)' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoanThuPhong' label='Bảng giá phí phòng'>
							<SelectKhoanThu/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maKhoanThuCoc' label='Bảng giá phí cọc'>
							<SelectKhoanThu/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<div className='fw500' style={{ marginBottom: 8, marginTop: 12 }}>
							Danh sách tiện ích
						</div>
						<Form.List name='danhSachTienIch'>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<Row gutter={[12, 0]} key={field.key}>
											<Col xs={24} md={10}>
												<Form.Item
													label='Tên tiện ích'
													name={[index, 'ten']}
													rules={[...rules.required]}
													style={{ marginBottom: 0 }}
												>
													<Input disabled={isView} placeholder='Tên tiện ích (ví dụ: Điều hòa)' />
												</Form.Item>
											</Col>
											<Col xs={24} md={10}>
												<Form.Item
													label='Mô tả'
													name={[index, 'moTa']}
													style={{ marginBottom: 0 }}
												>
													<Input disabled={isView} placeholder='Mô tả (ví dụ: 1 máy)' />
												</Form.Item>
											</Col>
											<Col xs={24} md={4}>
												<Button
													disabled={isView}
													danger
													type='link'
													title='Xóa tiện ích'
													icon={<DeleteOutlined />}
													onClick={() => remove(field.name)}
													style={{ marginTop: 30 }}
												/>
											</Col>
										</Row>
									))}
									<Form.ErrorList errors={errors} />
									{!isView && (
										<Button
											disabled={isView}
											onClick={() => add({ ten: '', moTa: '' })}
											icon={<PlusOutlined />}
											size='small'
											type='default'
											style={{ marginBottom: 8 }}
										>
											Thêm tiện ích
										</Button>
									)}
								</>
							)}
						</Form.List>
					</Col>
					<Col xs={24}>
						<Form.Item name='moTa' label='Mô tả phòng'>
							<Input.TextArea rows={3} disabled={isView} placeholder='Nhập mô tả phòng' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='danhSachAnh' label='Ảnh phòng'>
							<UploadFile maxCount={10} accept='image/*' disabled={isView} />
						</Form.Item>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormPhongKTX;
