import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectAttributesManagement from '../../Attributes/components/Select';

const FormCompetencyCCAModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData } = props;
	const { record: recCCA } = useModel('danhmuc.activities');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting, danhSach } = useModel('danhmuc.ccaattributes');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: ActivitiesManagement.IActivitiesTypeAttributes) => {
		if ((danhSach?.length ?? 0) >= 2) {
			return message.error('An activity type can have a maximum of 2 attributes.');
		}

		return postModel(
			{
				...values,
				activitiesTypeId: recCCA?._id,
			},
			getData,
			undefined,
			intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
		)
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<Card title={edit ? 'Edit Graduating Attribute' : 'Add New Graduating Attribute'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='attributesId' label='Graduating Attribute' rules={[...rules.required]}>
							<SelectAttributesManagement />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCompetencyCCAModel;
