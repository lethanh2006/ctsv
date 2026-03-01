import MyDatePicker from '@/components/MyDatePicker';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus, Evalidation } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Radio, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalXuLyActivityStudent = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	title: string;
	trangThai: EApprovalStatus;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, title, trangThai, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, putApproveActivityModel } = useModel('cct.activityoutcome');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				validation: record?.validation ?? Evalidation?.VERIFIED,
				dueDate: dayjs(record?.activities?.dueDate),
			});
		}
	}, [record?._id, visible]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putApproveActivityModel(
			record?._id ?? '',
			{
				...values,
				workflow: trangThai,
			},
			getData,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		).then(() => {
			setVisible(false);
		});
	};

	return (
		<Modal open={visible} onCancel={() => setVisible(false)} title={title} footer={null} width={600}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div
					style={{ fontSize: 48 }}
					className={
						trangThai === EApprovalStatus.APPROVED
							? 'text-success'
							: trangThai === EApprovalStatus.REJECTED
								? 'text-error'
								: 'text-warning'
					}
				>
					{trangThai === EApprovalStatus.APPROVED ? (
						<CheckCircleOutlined />
					) : trangThai === EApprovalStatus.REJECTED ? (
						<CloseCircleOutlined />
					) : (
						<WarningOutlined />
					)}
				</div>
				<div>{`${title} !`}</div>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{trangThai === EApprovalStatus.REJECTED && (
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

					{trangThai === EApprovalStatus.CHANGES_REQUIRED && (
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

					{trangThai === EApprovalStatus.APPROVED && (
						<Col span={24}>
							<Form.Item name='validation' label='Impact' rules={[...rules.required]}>
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

export default ModalXuLyActivityStudent;
