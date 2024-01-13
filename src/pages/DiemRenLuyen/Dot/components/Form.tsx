import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import type { DotDiemRenLuyen } from '@/services/DiemRenLuyen/Dot/typings';
import { ELoaiDoiTuongChamDiem, MapKeyNameLoaiDoiTuongChamDiem } from '@/services/DiemRenLuyen/constants';
import rules from '@/utils/rules';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectBieuMau from '../../BieuMau/components/SelectBieuMau';
import moment from 'moment';

const FormDot = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('diemrenluyen.dot');

	useEffect(() => {
		if (record?._id)
			form.setFieldsValue({
				...record,
				danhSachDoiTuongChamDiem: record?.danhSachDoiTuongChamDiem?.map((item) => ({
					...item,
					thoiGian: [moment(item.thoiGianBatDauCham), moment(item.thoiGianKetThucCham)],
				})),
			});
		else form.resetFields();
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotDiemRenLuyen.IRecord) => {
		const payload = {
			...record,
			...values,
			danhSachDoiTuongChamDiem: values?.danhSachDoiTuongChamDiem?.map((item) => ({
				...item,
				thoiGianBatDauCham: item.thoiGian[0],
				thoiGianKetThucCham: item.thoiGian[1],
				thoiGian: undefined,
			})),
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
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'Đợt'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={24}>
						<Form.Item name='maHocKy' label='Học kỳ' rules={[...rules.required]}>
							<SelectHocKy selectMa />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='mauDrlId' label='Biểu mẫu áp dụng cho đợt này' rules={[...rules.required]}>
							<SelectBieuMau />
						</Form.Item>
					</Col>
				</Row>
				<>
					<div style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
						<div style={{ marginRight: 4, color: '#ff4d4f' }}>*</div>
						<div>Danh sách đối tượng tham gia chấm điểm</div>
					</div>
					<Form.List
						name='danhSachDoiTuongChamDiem'
						rules={[
							{
								validator: async (_, danhSachDoiTuongChamDiem) => {
									if (!danhSachDoiTuongChamDiem || danhSachDoiTuongChamDiem.length < 1) {
										return Promise.reject(new Error('Ít nhất 1 đối tượng'));
									}
								},
							},
						]}
					>
						{(fields, { add, remove, move }, { errors }) => (
							<>
								{fields.map((field, index) => (
									<div key={field.key}>
										<Form.Item label={''} required={false} key={field.key}>
											<Row gutter={[10, 0]}>
												<Col span={8}>
													<Form.Item
														{...field}
														name={[index, 'loaiDoiTuongChamDiem']}
														validateTrigger={['onChange', 'onBlur']}
														rules={[...rules.required, ...rules.text]}
														label='Loại đối tượng'
													>
														<Select
															placeholder='Loại đối tượng'
															options={Object.values(ELoaiDoiTuongChamDiem).map((item) => ({
																value: item,
																label: MapKeyNameLoaiDoiTuongChamDiem[item],
															}))}
														/>
													</Form.Item>
												</Col>
												<Col span={15}>
													<Form.Item
														{...field}
														name={[index, 'thoiGian']}
														validateTrigger={['onChange', 'onBlur']}
														rules={[...rules.required]}
														label='Thời gian chấm'
													>
														<MyDateRangePicker format={'HH:mm DD/MM/YYYY'} showTime placeholder={['Từ', 'đến']} />
													</Form.Item>
												</Col>
												<Col span={1}>
													<Form.Item label={' '}>
														<Button
															style={{ marginTop: 8 }}
															icon={<CloseOutlined />}
															type='link'
															danger
															onClick={() => remove(field.name)}
														/>
													</Form.Item>
												</Col>
											</Row>

											<Divider style={{ margin: 4 }} />
										</Form.Item>
									</div>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
										Thêm giá trị
									</Button>

									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						)}
					</Form.List>
				</>

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

export default FormDot;
