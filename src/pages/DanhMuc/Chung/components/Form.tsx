import type { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { ELoaiDanhMucNCKH } from '@/services/QuyTrinhDong/DanhMuc/constants';
import type { DanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/typings';
import { EPhanHe, MapKeyPhanHe } from '@/services/QuyTrinhDong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDanhMucChung = (props: { getData: any; maModule: ELoaiDanhMucChung }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quytrinh.danhmuc');

	const loaiDanhMucNckh = Form.useWatch('loaiDanhMucNckh', form) || ELoaiDanhMucNCKH.TUY_BIEN;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				loaiDanhMucNckh: record?.loaiDanhMucNckh ?? ELoaiDanhMucNCKH.TUY_BIEN,
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DanhMucChung.IRecord) => {
		const payload = {
			...values,
			maModule: props.maModule,
		};

		if (edit) {
			putModel(record?._id ?? '', payload, props.getData);
		} else postModel(payload, props.getData);
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'danh mục chung'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='maDanhMuc' label='Mã danh mục' rules={[...rules.required, ...rules.text]}>
					<Input autoFocus placeholder='Mã danh mục' />
				</Form.Item>

				<Form.Item name='loaiDanhMucNckh' label='Loại danh mục' rules={[...rules.required]}>
					<Select
						options={Object.values(ELoaiDanhMucNCKH).map((item) => ({ value: item, label: item }))}
						style={{ width: '100%' }}
						placeholder='Loại danh mục'
					/>
				</Form.Item>
				{loaiDanhMucNckh === ELoaiDanhMucNCKH.NOI_BO && (
					<>
						<Form.Item name={'internalPath'} rules={[...rules.required, ...rules.text]} label='InternalPath'>
							<Input placeholder='Giá trị' />
						</Form.Item>
						<Form.Item label={'Phân hệ'} name={'phanHe'} rules={[...rules.required]}>
							<Select
								placeholder={'Chọn phân hệ'}
								options={Object.values(EPhanHe)?.map((val) => {
									return {
										value: val,
										label: MapKeyPhanHe?.[val],
									};
								})}
							/>
						</Form.Item>
						<Form.Item name={'sendSsoId'} rules={[...rules.required]} label='Lấy thông tin cá nhân'>
							<Radio.Group
								options={[
									{ label: 'Có', value: true },
									{ label: 'Không', value: false },
								]}
							/>
						</Form.Item>
					</>
				)}
				{loaiDanhMucNckh === ELoaiDanhMucNCKH.TUY_BIEN && (
					<>
						<div style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
							<div style={{ marginRight: 4, color: '#ff4d4f' }}>*</div>
							<div>Danh sách giá trị</div>
						</div>
						<Form.List
							name='danhSachGiaTri'
							rules={[
								{
									validator: async (_, danhSachGiaTri) => {
										if (!danhSachGiaTri || danhSachGiaTri.length < 1) {
											return Promise.reject(new Error('Ít nhất 1 giá trị'));
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
												<Form.Item
													{...field}
													name={[index, 'value']}
													validateTrigger={['onChange', 'onBlur']}
													rules={[...rules.required, ...rules.text]}
													noStyle
												>
													<Input placeholder='Giá trị' style={{ width: '80%' }} />
												</Form.Item>

												<Button icon={<CloseOutlined />} type='link' danger onClick={() => remove(field.name)} />

												<Button
													disabled={index === 0}
													icon={<ArrowUpOutlined />}
													type='link'
													onClick={() => move(index, index - 1)}
												/>

												<Button
													disabled={index === fields.length - 1}
													icon={<ArrowDownOutlined />}
													type='link'
													onClick={() => move(index, index + 1)}
												/>
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
				)}

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

export default FormDanhMucChung;
