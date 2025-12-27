import ViewTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/ViewKhaoSat/View';
import { EApprovalStatus } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalXuLyActivityStudent from './ModalXuLy';

const FormActivityStudent = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('cct.activityoutcome');

	const { getByIdModel, loading, record: recBieuMau } = useModel('tienich.bieumau');
	const {
		getByIdModel: getCauTraLoiMe,
		loading: loadingCauTraLoi,
		record: cauTraLoi,
	} = useModel('tienich.cautraloikhaosat');
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();

	useEffect(() => {
		if (record?.answerId) {
			getCauTraLoiMe(record.answerId, true).catch(console.log);
		}

		if (record?.selfAssessmentQuestionsId) {
			getByIdModel(record?.selfAssessmentQuestionsId).catch(console.log);
		}
	}, [record?._id]);

	return (
		<Card title='Detail activity'>
			<Spin spinning={loadingCauTraLoi || loading}>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} style={{ marginBottom: 12 }}>
					<Descriptions.Item label='Name'>{record?.name}</Descriptions.Item>
					<Descriptions.Item label='Email'>{record?.email}</Descriptions.Item>
					<Descriptions.Item label='Role'>
						{record?.roles?.name} ({record?.roles?.code})
					</Descriptions.Item>
					<Descriptions.Item label='Level'>{record?.roles?.level?.name}</Descriptions.Item>
					<Descriptions.Item label='Activity Name'>{record?.activities?.name}</Descriptions.Item>
					<Descriptions.Item label='Co-curricular Activities (CCA)'>
						{record?.activities?.activitiesType?.name}
					</Descriptions.Item>
					<Descriptions.Item label='Attribute'>
						<Tag color={record?.activities?.activitiesType?.attributes?.color}>
							{record?.activities?.activitiesType?.attributes?.name}
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='Organizer'>{record?.activities?.organizer}</Descriptions.Item>
					<Descriptions.Item label='Facility'>{record?.activities?.facilityName}</Descriptions.Item>
					<Descriptions.Item label='Start Date'>
						{record?.activities?.startDate ? dayjs(record.activities.startDate).format('HH:mm DD/MM/YYYY') : '-'}
					</Descriptions.Item>
					<Descriptions.Item label='End Date'>
						{record?.activities?.endDate ? dayjs(record.activities.endDate).format('HH:mm DD/MM/YYYY') : '-'}
					</Descriptions.Item>
					<Descriptions.Item label='Workflow'>
						<Tag
							color={
								record?.workflow === EApprovalStatus.APPROVED
									? 'green'
									: record?.workflow === EApprovalStatus.REJECTED
										? 'red'
										: 'orange'
							}
						>
							{record?.workflow}
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='Rejection Note'>{record?.activityRejectionNote}</Descriptions.Item>
					<Descriptions.Item label='Revision Note'>{record?.revisionNote}</Descriptions.Item>
				</Descriptions>

				<ViewTraLoiKhaoSat khaoSat={recBieuMau} cauTraLoi={cauTraLoi} />

				<div className='form-footer'>
					<Button
						type='primary'
						disabled={record?.workflow === EApprovalStatus.APPROVED}
						className='btn-success'
						onClick={() => {
							setTrangThai({
								title: intl.formatMessage({ id: 'activityresult.xuly.duyet' }),
								trangThai: EApprovalStatus.APPROVED,
							});
							setVisibleXuLy(true);
						}}
						icon={<CheckCircleOutlined />}
					>
						{intl.formatMessage({ id: 'activityresult.button.duyet' })}
					</Button>
					<Button
						type='primary'
						disabled={record?.workflow === EApprovalStatus.REJECTED}
						onClick={() => {
							setTrangThai({
								title: intl.formatMessage({ id: 'activityresult.xuly.tuchoi' }),
								trangThai: EApprovalStatus.REJECTED,
							});
							setVisibleXuLy(true);
						}}
						className='btn-error'
						icon={<CloseCircleOutlined />}
					>
						{intl.formatMessage({ id: 'activityresult.button.tuchoi' })}
					</Button>
					<Button
						type='primary'
						disabled={record?.workflow === EApprovalStatus.CHANGES_REQUIRED}
						onClick={() => {
							setTrangThai({
								title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
								trangThai: EApprovalStatus.CHANGES_REQUIRED,
							});
							setVisibleXuLy(true);
						}}
						className='btn-warning'
						icon={<RedoOutlined />}
					>
						{intl.formatMessage({ id: 'activityresult.button.yccs' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Spin>

			<ModalXuLyActivityStudent
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai ?? EApprovalStatus.DRAFT}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>
		</Card>
	);
};

export default FormActivityStudent;
