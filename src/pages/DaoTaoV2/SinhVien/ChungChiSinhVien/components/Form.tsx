import MyDatePicker from '@/components/MyDatePicker';
import SelectChungChi from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/ChungChi/components/Select';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { EPhuongThucTinhDiem } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormChungChiSinhVien = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } =
		useModel('daotaov2.sinhvien.chungchi');
	const { danhSach: danhSachChungChi, record: recChungChi, setRecord } = useModel('daotaov2.danhmuc.chungchi');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { title, fromSinhVien } = props;
	const maChungChi = Form.useWatch('maChungChi', form);

	const getData = () => (fromSinhVien ? getModel({ sinhVienSsoId: recSinhVien?.ssoId }) : getModel());

	useEffect(() => {
		const findChungChi = danhSachChungChi.find((item) => item.ma === maChungChi);
		setRecord(findChungChi);
	}, [maChungChi]);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = fromSinhVien ? { ...values, sinhVienSsoId: recSinhVien?.ssoId } : values;
		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{!fromSinhVien ? (
						<Col xs={24} md={12}>
							<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
								<SelectSinhVienDebounce disabled={edit} />
							</Form.Item>
						</Col>
					) : null}
					<Col xs={24} md={12}>
						<Form.Item name='maChungChi' label='Chứng chỉ' rules={[...rules.required]}>
							<SelectChungChi selectMa onChange={() => form.setFieldsValue({ diem: undefined })} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='ngayCap' label='Ngày cấp' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='donViCap' label='Đơn vị cấp' rules={[...rules.required]}>
							<Input placeholder='Nhập đơn vị cấp' />
						</Form.Item>
					</Col>

					{recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC ? (
						<Col xs={24} md={12}>
							<Form.Item name='diem' label='Bậc chứng chỉ' rules={[...rules.required]}>
								<Select
									placeholder='Chọn bậc chứng chỉ'
									options={recChungChi?.bac?.map((item) => ({
										key: item.order,
										label: item.ten,
										value: item.order,
									}))}
								/>
							</Form.Item>
						</Col>
					) : recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item
									name='diem'
									label='Mức điểm'
									rules={[...rules.required, ...rules.number(recChungChi.max, recChungChi.min)]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={recChungChi.min}
										max={recChungChi.max}
										step={recChungChi.step}
										placeholder='Nhập điểm đạt được'
									/>
								</Form.Item>
							</Col>
						</>
					) : null}
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

export default FormChungChiSinhVien;
