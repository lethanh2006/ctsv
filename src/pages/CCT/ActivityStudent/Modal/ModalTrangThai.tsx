import MyDatePicker from '@/components/MyDatePicker';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus, Evalidation, mapNameApprovalStatus } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Modal, Radio, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalChinhSuaTrangThai = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, putApproveActivityModel } = useModel('cct.activityoutcome');
	const workflow: EApprovalStatus = Form.useWatch('workflow', form);

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				workflow: record?.workflow ?? EApprovalStatus.DRAFT,
				dueDate: dayjs(record?.activities?.dueDate),
			});
		}
	}, [record?._id, visible]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putApproveActivityModel(record?._id ?? '', values, getData).then(() => {
			setVisible(false);
		});
	};

	return (
		<Modal open={visible} onCancel={() => setVisible(false)} title={'Change Status'} footer={null} width={600}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Col span={24}>
							<Form.Item name='workflow' label='Status' rules={[...rules.required]}>
								<Select
									placeholder='Select Status'
									options={Object.values([
										EApprovalStatus.APPROVED,
										EApprovalStatus.REJECTED,
										EApprovalStatus.CHANGES_REQUIRED,
									]).map((item) => ({
										value: item,
										label: mapNameApprovalStatus[item as EApprovalStatus],
									}))}
								/>
							</Form.Item>
						</Col>
					</Col>

					{workflow === EApprovalStatus.REJECTED && (
						<Col span={24}>
							<Form.Item
								name='activityRejectionNote'
								label={intl.formatMessage({ id: 'activityresult.xuly.activityRejectionNote' })}
								rules={[...rules.required]}
							>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'activityresult.xuly.activityRejectionNote.place' })}
								/>
							</Form.Item>
						</Col>
					)}

					{workflow === EApprovalStatus.CHANGES_REQUIRED && (
						<>
							<Col span={24}>
								<Form.Item
									name='dueDate'
									label={intl.formatMessage({ id: 'activity.info.form.duedate' })}
									rules={[
										...rules.required,
										...rules.sauNgay(dayjs(record?.endDate), intl.formatMessage({ id: 'activity.info.form.endDate' })),
									]}
								>
									<MyDatePicker
										showTime={{ showHour: true, showMinute: true }}
										format='HH:mm DD/MM/YYYY'
										disabledDate={(current) =>
											!!(
												dayjs(current).isBefore(dayjs().startOf('day')) ||
												(record?.endDate && dayjs(current).isBefore(record?.endDate))
											)
										}
										placeholder='Select Due Date'
										allowClear
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name='revisionNote'
									label={intl.formatMessage({ id: 'activityresult.xuly.revisionNote' })}
									rules={[...rules.required]}
								>
									<Input.TextArea
										rows={3}
										placeholder={intl.formatMessage({ id: 'activityresult.xuly.revisionNote.place' })}
									/>
								</Form.Item>
							</Col>
						</>
					)}

					{workflow === EApprovalStatus.APPROVED && (
						<Col span={24}>
							<Form.Item name='validation' label='Impact'>
								<Radio.Group>
									<Space direction='vertical'>
										<Radio value={Evalidation.VERIFIED}>
											<div>
												<div>
													<strong>Verified</strong>
												</div>
												<div style={{ color: '#666' }}>
													This activity has been verified for authenticity and completion.
												</div>
											</div>
										</Radio>

										<Radio value={Evalidation.ENDORSED}>
											<div>
												<div>
													<strong>Endorsed</strong>
												</div>
												<div style={{ color: '#666' }}>
													This activity demonstrates meaningful contribution and competency development, as endorsed by
													the approver.
												</div>
											</div>
										</Radio>

										<Radio value={Evalidation.FEATURED}>
											<div>
												<div>
													<strong>Featured</strong>
												</div>
												<div style={{ color: '#666' }}>
													This activity is recognized by VinUniversity as an outstanding and exemplary contribution.
												</div>
											</div>
										</Radio>
									</Space>
								</Radio.Group>
							</Form.Item>
						</Col>
					)}
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

export default ModalChinhSuaTrangThai;
