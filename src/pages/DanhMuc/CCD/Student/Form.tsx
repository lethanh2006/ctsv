import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormStudentDomain = (props: { onOk: (val: ActivitiesTypeDomain.IStudentDeclaration) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, edit } = useModel('danhmuc.studentdomain');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: ActivitiesTypeDomain.IStudentDeclaration) => {
		onOk({ ...values });
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='ssoId' label={intl.formatMessage({ id: 'activitiestypedomain.form.student' })}>
						<SelectNhanSuDebounce
							onChange={(val, option) => {
								const nhanSu = option?.rawData;
								form.setFieldsValue({
									name: nhanSu?.hoTen ? nhanSu?.hoTen : [nhanSu?.hoDem, nhanSu?.ten].filter(Boolean).join(' '),
									email: nhanSu?.emailCanBo ?? nhanSu?.email,
								});
							}}
						/>
					</Form.Item>
					<Form.Item name='name' hidden />
					<Form.Item name='email' hidden />
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.chinhsua' })}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Form>
	);
};

export default FormStudentDomain;
