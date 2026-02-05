import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectAttributesManagement from '../../Attributes/components/Select';

const FormAttributesCCA = (props: { onOk: (val: ActivitiesManagement.IActivitiesTypeAttributes[]) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, edit } = useModel('danhmuc.ccaattributes');
	const { danhSach } = useModel('danhmuc.attributes');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: ActivitiesManagement.IActivitiesTypeAttributes) => {
		const attrIds = values.attributesId;

		const records =
			danhSach
				?.filter((item) => attrIds?.includes(item._id))
				.map((item) => ({
					attributesId: item._id,
					attributes: item,
				})) || [];

		onOk(records as any);
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='attributesId' label='Attributes' rules={[...rules.required]}>
						<SelectAttributesManagement multiple />
					</Form.Item>
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

export default FormAttributesCCA;
