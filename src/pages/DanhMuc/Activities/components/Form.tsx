import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectAttributesManagement from '../../Attributes/components/Select';
import StudenModelPage from '../StudenModel';
import FormItemStudent from '../Student/FormItem';

const FormActivities = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.activities');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: true,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ActivitiesManagement.IRecord) => {
		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'activitiesmanagement.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'activitiesmanagement.form.chitiet' })
						: intl.formatMessage({ id: 'activitiesmanagement.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.id' })}
							rules={[...rules.required]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.name' })}
							rules={[...rules.required]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.name.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='attributesId'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.attributes' })}
							rules={[...rules.required]}
						>
							<SelectAttributesManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='order'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.order' })}
							rules={[...rules.required]}
						>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.order.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.des' })}
							rules={[...rules.text]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.des.place' })}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						{record?._id ? (
							<>
								<div className='fw500' style={{ marginBottom: 8 }}>
									{intl.formatMessage({ id: 'activitiesmanagement.form.student' })}
								</div>
								<StudenModelPage disabled={isView} mode='activitiesType' />
							</>
						) : (
							<Form.Item
								name='studentDeclarationApproverList'
								label={intl.formatMessage({ id: 'activitiesmanagement.form.student' })}
							>
								<FormItemStudent />
							</Form.Item>
						)}
					</Col>
				</Row>

				<div className='form-footer'>
					{!isView && (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.chinhsua' })}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormActivities;
