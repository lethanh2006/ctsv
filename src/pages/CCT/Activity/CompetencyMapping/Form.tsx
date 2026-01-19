import SelectAttributesManagement from '@/pages/DanhMuc/Attributes/components/Select';
import SelectCompetency from '@/pages/DanhMuc/Competency/components/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCompetencyMapping = (props: { onOk: (val: Activity.ICompetencyMapping) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, edit, record } = useModel('cct.competencymapping');
	const { danhSach: dscompetency } = useModel('danhmuc.competency');
	const { danhSach: dsattributes } = useModel('danhmuc.attributes');
	const attributesId: string = Form.useWatch('attributesId', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				...record,
				competencieId: record?.dsCompetencie?.map((item) => item?._id),
			});
		}
	}, [visibleForm]);

	const onFinish = async (values: Activity.ICompetencyMapping) => {
		values.attributes = dsattributes?.find((item) => item?._id === values.attributesId);
		values.dsCompetencie = dscompetency?.filter((item) => values.competencieId.includes(item?._id));

		onOk({ ...values });
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='attributesId' label={intl.formatMessage({ id: 'activity.info.form.ccd.attribute' })}>
						<SelectAttributesManagement />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='competencieId' label={intl.formatMessage({ id: 'activity.info.form.ccd.competency' })}>
						<SelectCompetency multiple condition={{ attributesId: attributesId }} allowClear />
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

export default FormCompetencyMapping;
