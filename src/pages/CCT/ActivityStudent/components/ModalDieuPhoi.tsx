import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalDieuPhoiActivityStudent = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, putModel } = useModel('cct.activityoutcome');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visible]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putModel(record?._id ?? '', values, getData).then(() => {
			setVisible(false);
		});
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			title={'Student Declaration Approvers'}
			footer={null}
			width={600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='studentDeclarationApproverSsoId'
							label='Student Declaration Approvers'
							rules={[...rules.required]}
						>
							<Select
								placeholder='Select student seclaration approver'
								options={record?.activitiesType?.activitiesTypeDomain?.studentDeclarationApproverList?.map((item) => ({
									value: item.ssoId,
									label: item.name,
									rawData: item,
								}))}
								onChange={(val, option: any) => {
									const nhanSu = option?.rawData;
									form.setFieldsValue({
										studentDeclarationApproverName: nhanSu?.name,
									});
								}}
							/>
						</Form.Item>
						<Form.Item name='studentDeclarationApproverName' hidden />
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalDieuPhoiActivityStudent;
