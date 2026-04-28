import { EGioiTinh, ERuleType, transRuleType } from '@/services/KyTucXa/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectPhongKTX from './SelectPhongKtx';
import SelectToaKTX from './SelectToaKtx';

const FormRuleDangKyKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('kytucxa.dangkythuerule');

	const RULE_FIELD_MAP: Record<string, string> = {
		[ERuleType.GIOI_TINH]: 'gioiTinh',
		[ERuleType.MAX_PER_KHOA]: 'maxPerKhoa',
		[ERuleType.MIN_AGE]: 'minAge',
		[ERuleType.MAX_AGE]: 'maxAge',
	};

	const selectedLoai = Form.useWatch('loai', form);

	useEffect(() => {
		if (visibleForm) {
			if (record?._id) form.setFieldsValue(record);
			else resetFieldsForm(form);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const { gioiTinh, maxPerKhoa, minAge, maxAge, loai, ...rest } = values;
		const ruleValues: Record<string, any> = { gioiTinh, maxPerKhoa, minAge, maxAge };
		const loaiArr = Array.isArray(loai) ? loai : (loai ? [loai] : []);

		const getPayload = (ruleType: ERuleType) => {
			const fieldName = RULE_FIELD_MAP[ruleType as string];
			return {
				...rest,
				loai: ruleType,
				giaTri: fieldName ? { [fieldName]: ruleValues[fieldName] } : {},
			};
		};

		try {
			if (edit) {
				await putModel(record?._id ?? '', getPayload(loaiArr[0]));
			} else {
				await Promise.all(loaiArr.map((l: ERuleType) => postModel(getPayload(l))));
			}
		} catch (er) {
			console.log(er);
		}
	};

	const handleChangeLoai = (selectedValues: ERuleType[]) => {
		const removedFields = Object.entries(RULE_FIELD_MAP)
			.filter(([type]) => !selectedValues.includes(type as ERuleType))
			.map(([, fieldName]) => fieldName);

		if (removedFields.length > 0) {
			form.resetFields(removedFields);
		}
	};

	const ruleTypeOptions = Object.values(ERuleType).map((v) => ({
		value: v,
		label: transRuleType[v],
	}));

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} quy tắc đăng ký`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='ma' label='Mã rule' rules={[...rules.required]}>
							<Input placeholder='Ví dụ: RULE-GIOI-TINH-B1' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ten' label='Tên rule' rules={[...rules.required]}>
							<Input placeholder='Ví dụ: Giới hạn giới tính tòa B1' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='loai' label='Loại rule' rules={[...rules.required]}>
							<Select
								mode='multiple'
								placeholder='Chọn loại rule'
								options={ruleTypeOptions}
								onChange={handleChangeLoai}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='stt' label='Thứ tự ưu tiên'>
							<InputNumber min={1} style={{ width: '100%' }} placeholder='Số thứ tự (nhỏ hơn = cao hơn)' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='maToaNha' label='Áp dụng cho tòa'>
							<SelectToaKTX/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='maPhong' label='Áp dụng cho phòng cụ thể'>
							<SelectPhongKTX/>
						</Form.Item>
					</Col>
					{selectedLoai?.includes?.(ERuleType.GIOI_TINH) && (
						<Col xs={24} md={12}>
							<Form.Item name='gioiTinh' label='Giới tính cho phép' rules={[...rules.required]}>
								<Select
									placeholder='Chọn giới tính'
									options={[
										{ value: EGioiTinh.NAM, label: 'Nam' },
										{ value: EGioiTinh.NU, label: 'Nữ' },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					{selectedLoai?.includes?.(ERuleType.MAX_PER_KHOA) && (
						<Col xs={24} md={12}>
							<Form.Item name={['giaTri', 'maxPerKhoa']} label='Số SV tối đa mỗi khoa' rules={[...rules.required]}>
								<InputNumber min={1} style={{ width: '100%' }} placeholder='Ví dụ: 2' />
							</Form.Item>
						</Col>
					)}
					{selectedLoai?.includes?.(ERuleType.MIN_AGE) && (
						<Col xs={24} md={12}>
							<Form.Item name='minAge' label='Tuổi tối thiểu' rules={[...rules.required]}>
								<InputNumber min={0} style={{ width: '100%' }} placeholder='Ví dụ: 18' />
							</Form.Item>
						</Col>
					)}
					{selectedLoai?.includes?.(ERuleType.MAX_AGE) && (
						<Col xs={24} md={12}>
							<Form.Item name='maxAge' label='Tuổi tối đa' rules={[...rules.required]}>
								<InputNumber min={0} style={{ width: '100%' }} placeholder='Ví dụ: 30' />
							</Form.Item>
						</Col>
					)}
					<Col xs={24} md={12}>
						<Form.Item name='noiDungLyDo' label='Nội dung lý do'>
							<Input placeholder='Ví dụ: Phòng dành cho sinh viên Nam' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='isActive' label='Kích hoạt' valuePropName='checked'>
							<Switch />
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

export default FormRuleDangKyKTX;
