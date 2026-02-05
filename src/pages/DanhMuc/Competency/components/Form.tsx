import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCompetency = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.competency');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: true,
			});
		}
	}, [record?._id, visibleForm]);

	const normalizeCompetencyAttributesForCreate = (list?: Competency.ICompetencyAttributes[]) =>
		list?.map((item) => ({
			attributesId: item.attributesId,
		}));

	const onFinish = async (values: Competency.IRecord) => {
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
		} else {
			const payload = {
				...values,
				// competencyAttributesList: normalizeCompetencyAttributesForCreate(values.competencyAttributesList),
			};

			postModel(payload as any, undefined, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'competency.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'competency.form.chitiet' })
						: intl.formatMessage({ id: 'competency.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='code' label={intl.formatMessage({ id: 'competency.form.id' })} rules={[...rules.required]}>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'competency.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'competency.form.name' })}
							rules={[...rules.required]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'competency.form.name.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='order'
							label={intl.formatMessage({ id: 'competency.form.order' })}
							// rules={[...rules.required]}
						>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'competency.form.order.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'competency.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'competency.form.des' })}
							rules={[...rules.text]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'competency.form.des.place' })}
							/>
						</Form.Item>
					</Col>

					{/* <Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							Evidence Example
						</Divider>
					</Col>

					<Col span={24}>
						<Form.List name='evidenceLExampleList'>
							{(fields, { add, remove }) => (
								<>
									{fields.map((field) => (
										<Form.Item key={field.key} required={false}>
											<Form.Item {...field} rules={[...rules.required]} noStyle>
												<Input placeholder='Enter value' style={{ width: '95%' }} disabled={isView} />
											</Form.Item>

											<Button
												disabled={isView}
												icon={<CloseOutlined />}
												type='link'
												danger
												onClick={() => remove(field.name)}
											/>
										</Form.Item>
									))}

									<Form.Item>
										<Button
											disabled={isView}
											type='dashed'
											onClick={() => add('')}
											style={{ width: '100%' }}
											icon={<PlusOutlined />}
										>
											Add new
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Col> */}

					<Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							Typical Activity
						</Divider>
					</Col>

					<Col span={24}>
						<Form.List name='typicalActivityList'>
							{(fields, { add, remove }) => (
								<>
									{fields.map((field) => (
										<Form.Item key={field.key} required={false}>
											<Form.Item {...field} rules={[...rules.required]} noStyle>
												<Input placeholder='Enter value' style={{ width: '95%' }} disabled={isView} />
											</Form.Item>

											<Button
												disabled={isView}
												icon={<CloseOutlined />}
												type='link'
												danger
												onClick={() => remove(field.name)}
											/>
										</Form.Item>
									))}

									<Form.Item>
										<Button
											disabled={isView}
											type='dashed'
											onClick={() => add('')}
											style={{ width: '100%' }}
											icon={<PlusOutlined />}
										>
											Add new
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Col>

					{/* <Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							Attributes
						</Divider>
					</Col> */}

					{/* <Col span={24}>
						{record?._id ? (
							<AttributesCompetencyModel disabled={isView} />
						) : (
							<Form.Item name='competencyAttributesList'>
								<FormItemAttributesCompetency disabled={isView} />
							</Form.Item>
						)}
					</Col> */}
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

export default FormCompetency;
