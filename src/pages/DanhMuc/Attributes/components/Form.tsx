import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { Colorpicker } from 'antd-colorpicker';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormAttributes = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, setFormSubmiting, formSubmiting, visibleForm } =
		useModel('danhmuc.attributes');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: false,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AttributesManagement.IRecord) => {
		setFormSubmiting(true);
		const icon = await buildUpLoadFile(values, 'icon');
		values.icon = icon;
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, isActive: true })
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'attributesmanagement.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'attributesmanagement.form.chitiet' })
						: intl.formatMessage({ id: 'attributesmanagement.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='icon'
							label={intl.formatMessage({ id: 'attributesmanagement.form.icon' })}
							rules={[...rules.required]}
						>
							<UploadFile disabled={isView} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='color'
							label={intl.formatMessage({ id: 'attributesmanagement.form.color' })}
							rules={[...rules.required]}
						>
							<Colorpicker disabled={isView} popup onColorResult={(color) => color.hex} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'attributesmanagement.form.id' })}
							rules={[...rules.required]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'attributesmanagement.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'attributesmanagement.form.name' })}
							rules={[...rules.required]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'attributesmanagement.form.name.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='order'
							label={intl.formatMessage({ id: 'attributesmanagement.form.order' })}
							rules={[...rules.required]}
						>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'attributesmanagement.form.order.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'attributesmanagement.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'attributesmanagement.form.des' })}
							rules={[...rules.text]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'attributesmanagement.form.des.place' })}
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

export default FormAttributes;
