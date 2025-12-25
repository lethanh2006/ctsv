import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
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
			form.setFieldsValue(record);
		}
	}, [record?._id, visible]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putApproveActivityModel(
			record?._id ?? '',
			{
				workflow: trangThai,
				activityRejectionNote: values.activityRejectionNote,
				revisionNote: values.revisionNote,
			},
			getData,
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
							>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'activityresult.xuly.activityRejectionNote.place' })}
								/>
							</Form.Item>
						</Col>
					)}

					{trangThai === EApprovalStatus.CHANGES_REQUIRED && (
						<Col span={24}>
							<Form.Item name='revisionNote' label={intl.formatMessage({ id: 'activityresult.xuly.revisionNote' })}>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'activityresult.xuly.revisionNote.place' })}
								/>
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
