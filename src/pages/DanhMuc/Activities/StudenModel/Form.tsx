import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormStudentDomainModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData, mode } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { record: recActi } = useModel('danhmuc.activities');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting } = useModel('danhmuc.studentdomain');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: ActivitiesManagement.IStudentDeclaration) => {
		postModel(
			mode === 'activitiesType'
				? {
						...values,
						activitiesTypeId: recActi?._id,
					}
				: {
						...values,
						activitiesId: recActivity?._id,
					},
			getData,
			undefined,
			intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
		)
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'activitiestypedomain.student.form.chinhsua' })
					: intl.formatMessage({ id: 'activitiestypedomain.student.form.themmoi' })
			}
		>
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
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.chinhsua' })}
					</Button>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormStudentDomainModel;
