import SelectAttributesManagement from '@/pages/DanhMuc/Attributes/components/Select';
import SelectCompetency from '@/pages/DanhMuc/Competency/components/Select';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCompetencyMappingModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting, record } = useModel('cct.competencymapping');

	const attributesId: string = Form.useWatch('attributesId', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				...record,
				competencieId: record?.dsCompetencie?.map((item: any) => item?.competencie?._id),
			});
		}
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
		} else {
			const payload = (values.competencieId || []).map((id: string) => ({
				activitiesId: recActivity?._id,
				attributesId: values.attributesId,
				competencieId: id,
			}));

			for (const item of payload) {
				await postModel(item, () => {});
			}

			getData();
			setVisibleForm(false);
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='attributesId' label={intl.formatMessage({ id: 'activity.info.form.ccd.attribute' })}>
						<SelectAttributesManagement onChange={() => form.resetFields(['competencieId'])} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='competencieId' label={intl.formatMessage({ id: 'activity.info.form.ccd.competency' })}>
						<SelectCompetency multiple condition={{ attributesId: attributesId }} allowClear />
					</Form.Item>
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
	);
};

export default FormCompetencyMappingModel;
