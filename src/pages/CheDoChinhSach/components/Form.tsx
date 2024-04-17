import { ELoaiBoLoc, ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popover, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import TableCauHinh from './TableCauHinh';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';

const FormCheDoChinhSach = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const { visibleForm, record, formSubmiting, edit, setVisibleForm, putModel, postModel } = useModel(
		'chedochinhsach.chedochinhsach',
	);
	const [formValues, setFormValues] = useState<any>(record);
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');
	const danhSachBoLoc = Form.useWatch('danhSachBoLoc', form);

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
			putModel(record?._id ?? '', payload, props.getData);
		} else {
			postModel(payload, props.getData);
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

				<div>Danh sách bộ lọc</div>
				<Form.List name='danhSachBoLoc'>
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
									<Row gutter={[8, 0]}>
										<Col span={16}>
											<Form.Item {...field} rules={[...rules.required]} label={'Tên bộ lọc'} name={[index, 'ten']}>
												<Input placeholder='Tên bộ lọc' />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item {...field} rules={[...rules.required]} label='Loại bộ lọc' name={[index, 'loai']}>
												<Select
													placeholder='Loại bộ lọc'
													options={Object.values(ELoaiBoLoc).map((item) => ({ value: item, label: item }))}
												/>
											</Form.Item>
										</Col>
										<Col span={24}>
											<Form.Item {...field} rules={[...rules.required]} label={'Path'} name={[index, 'path']}>
												<Input placeholder='Path' />
											</Form.Item>
										</Col>
										{danhSachBoLoc[index]?.loai === ELoaiBoLoc.MANG && (
											<Col span={24}>
												<Form.Item
													{...field}
													rules={[...rules.required]}
													label='Danh sách giá trị'
													name={[index, 'danhSachGiaTri']}
												>
													<Select placeholder='Danh sách giá trị' mode='tags' />
												</Form.Item>
											</Col>
										)}
										{danhSachBoLoc[index]?.loai === ELoaiBoLoc.DANH_MUC && (
											<>
												<Col span={12}>
													<Form.Item
														{...field}
														rules={[...rules.required]}
														label='Mã Module danh mục'
														name={[index, 'maModule']}
													>
														<Select
															placeholder='Mã module'
															options={Object.values(ELoaiDanhMucChung).map((item) => ({ value: item, label: item }))}
														/>
													</Form.Item>
												</Col>
												<Col span={12}>
													<Form.Item
														{...field}
														style={{ marginTop: -10 }}
														rules={[...rules.required]}
														label={
															<span>
																Danh mục (
																<Button
																	loading={loadingDanhMucChung}
																	onClick={() => {
																		getAllDanhMucChung(false, undefined, { maModule: danhSachBoLoc[index]?.maModule });
																	}}
																	style={{ padding: 0 }}
																	type='link'
																>
																	Làm mới
																</Button>
																)
															</span>
														}
														name={[index, 'maDanhMuc']}
													>
														<Select
															showSearch
															options={danhSach.map((item) => ({
																label: (
																	<Popover
																		placement='left'
																		content={() => {
																			return (
																				<div>
																					{item.danhSachGiaTri.map((giaTri: { value: string }) => (
																						<div key={giaTri.value}>- {giaTri.value}</div>
																					))}
																				</div>
																			);
																		}}
																	>
																		{item.maDanhMuc}
																	</Popover>
																),
																value: item.maDanhMuc,
															}))}
															placeholder='Danh mục'
														/>
													</Form.Item>
												</Col>
											</>
										)}
									</Row>
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
