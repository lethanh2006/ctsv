import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSvLopHanhChinh = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postManyModel, putModel, formSubmiting, visibleForm, getModel } = useModel(
		'daotaov2.namhoc.sinhvienlophanhchinh',
	);
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { title } = props;

	const getData = () => getModel({ lopHanhChinhId: recLopHanhChinh?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postManyModel({ ...values, lopHanhChinhId: recLopHanhChinh?._id ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Lớp hành chính'>
							<Input value={recLopHanhChinh?.ten} disabled />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='sinhVienSsoIds' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce multiple />
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

export default FormSvLopHanhChinh;
