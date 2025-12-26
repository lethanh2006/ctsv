import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLevelsManagement from '../../Levels/components/Select';

const FormRoles = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.roles');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: true,
			});
		}
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: RolesManagement.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'rolesmanagement.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'rolesmanagement.form.chitiet' })
						: intl.formatMessage({ id: 'rolesmanagement.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'rolesmanagement.form.id' })}
							rules={[...rules.required]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'rolesmanagement.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'rolesmanagement.form.name' })}
							rules={[...rules.required]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'rolesmanagement.form.name.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='levelId'
							label={intl.formatMessage({ id: 'rolesmanagement.form.level' })}
							rules={[...rules.required]}
						>
							<SelectLevelsManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='order'
							label={intl.formatMessage({ id: 'rolesmanagement.form.order' })}
							rules={[...rules.required]}
						>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'rolesmanagement.form.order.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'rolesmanagement.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'rolesmanagement.form.des' })}
							rules={[...rules.text]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'rolesmanagement.form.des.place' })}
							/>
						</Form.Item>
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
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormRoles;
