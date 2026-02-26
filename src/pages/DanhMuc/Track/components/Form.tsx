import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTrack = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.track');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: false,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Track.IRecord) => {
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
		<Card title={edit ? 'Edit new track' : isView ? 'Detail new track' : 'Add new track'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='code' label='Code' rules={[...rules.required, ...rules.length(10)]}>
							<Input disabled={isView} placeholder='Enter code' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='name' label='Name' rules={[...rules.required, ...rules.length(80)]}>
							<Input disabled={isView} placeholder='Enter name' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='order' label='Display order'>
							<InputNumber disabled={isView} style={{ width: '100%' }} placeholder='Enter Display order' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='isActive' label='Active' valuePropName='checked'>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='description' label='Description' rules={[...rules.text, ...rules.length(255)]}>
							<Input.TextArea disabled={isView} rows={3} placeholder='Enter Description' showCount />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					{!isView && (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormTrack;
