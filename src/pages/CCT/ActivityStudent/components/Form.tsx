import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	Evalidation,
	mapEvalidation,
	mapNameActivityCategory,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, CloseCircleOutlined, FileOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Empty, List, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChinhSuaImpact from './ModalImpact';
import ModalChinhSuaTrangThai from './ModalTrangThai';
import ModalXuLyActivityStudent from './ModalXuLy';

const FormActivityStudent = (props: any) => {
	const { getData, tabActive, isActivity } = props;
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('cct.activityoutcome');

	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);
	const [visibleStatus, setVisibleStatus] = useState<boolean>(false);

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();

	const columnsCompetency: IColumn<ActivityOutCome.ICompetencyActivity>[] = [
		{
			title: intl.formatMessage({ id: 'competency.column.name' }),
			dataIndex: ['competency', 'name'],
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Description',
			dataIndex: ['competency', 'description'],
			width: 250,
			render: (val, rec) => val && <ExpandText>{val}</ExpandText>,
		},
	];

	const isRegistered = record?.activityCategory === EActivityCategory.REGISTERED;

	const startDate = isRegistered ? record?.activities?.startDate : record?.startDate;

	const endDate = isRegistered ? record?.activities?.endDate : record?.endDate;

	const attri = isRegistered
		? record?.activities?.coCurricularActivityEquivalency?.filter((item) => item?.rolesId === record?.rolesId)
		: record?.activitiesType?.attributes;

	return (
		<Card title='Detail activity'>
			<Divider className='divider-big-title' orientation='left'>
				General Information
			</Divider>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} style={{ marginBottom: 12 }}>
				<Descriptions.Item label='Activity Category' span={24}>
					{mapNameActivityCategory[record?.activityCategory as EActivityCategory]}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.sv.name' })}>
					{record?.name}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.sv.email' })}>
					{record?.email}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.role' })} span={24}>
					{record?.roles?.name} ({record?.roles?.code})
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.level' })}>
					{record?.levels?.name}
				</Descriptions.Item>
				{!isRegistered && (
					<Descriptions.Item label='Activity Group' span={24}>
						{record?.activitiesType?.activitiesTypeDomain?.name}
					</Descriptions.Item>
				)}
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.activity' })} span={24}>
					{isRegistered ? record?.activities?.name : record?.activitiesOutcomeName}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.cca' })} span={24}>
					{isRegistered ? record?.activities?.activitiesType?.name : record?.activitiesType?.name}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.attribute' })} span={24}>
					<Space wrap>
						{attri?.map((item: any) => (
							<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
						))}
					</Space>
				</Descriptions.Item>
				{isRegistered && (
					<>
						<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.organizer' })}>
							{record?.activities?.organizer}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.facility' })}>
							{record?.activities?.facilityName}
						</Descriptions.Item>
					</>
				)}
				{!isRegistered && (
					<>
						<Descriptions.Item label='Organizer'>{record?.organizer}</Descriptions.Item>
						<Descriptions.Item label='Location'>{record?.location}</Descriptions.Item>
					</>
				)}
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.startdate' })}>
					{startDate ? dayjs(startDate).format('HH:mm DD/MM/YYYY') : '-'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.enddate' })}>
					{endDate ? dayjs(endDate).format('HH:mm DD/MM/YYYY') : '-'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.work' })}>
					<Tag
						color={
							record?.workflow === EApprovalStatus.APPROVED
								? 'green'
								: record?.workflow === EApprovalStatus.REJECTED
									? 'red'
									: 'orange'
						}
					>
						{mapNameApprovalStatus[record?.workflow as EApprovalStatus]}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Impact'>
					<Tag color={mapEvalidation[record?.validation as Evalidation]}>{record?.validation}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.approvers' })}>
					{record?.studentDeclarationApproverName}
				</Descriptions.Item>
				<Descriptions.Item label='Reflection'>{record?.reflection}</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.reject' })}>
					{record?.activityRejectionNote}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.revi' })}>
					{record?.revisionNote}
				</Descriptions.Item>
			</Descriptions>

			<Divider className='divider-big-title' orientation='left'>
				Evidence Required
			</Divider>

			<List
				size='small'
				dataSource={record?.evidenceFile ?? []}
				locale={{ emptyText: <Empty description='No competency file' /> }}
				renderItem={(item: any) => (
					<List.Item>
						<Typography.Link
							href={item.file}
							target='_blank'
							rel='noopener noreferrer'
							style={{ display: 'flex', alignItems: 'center', gap: 8 }}
						>
							<FileOutlined />
							<span>{item.name}</span>
						</Typography.Link>
					</List.Item>
				)}
			/>

			<Divider className='divider-big-title' orientation='left'>
				List competency
			</Divider>

			<TableStaticData columns={columnsCompetency} data={record?.competencyList ?? []} size='small' hasTotal />

			<div className='form-footer'>
				{!isActivity && (
					<>
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

						{tabActive === '2' && (
							<>
								<Button
									type='primary'
									onClick={() => {
										setVisibleStatus(true);
									}}
									icon={<CheckCircleOutlined />}
								>
									Change status
								</Button>
								<Button
									type='primary'
									className='btn-success'
									onClick={() => {
										setVisibleImpact(true);
									}}
									icon={<CheckCircleOutlined />}
								>
									Verify impact
								</Button>
							</>
						)}

						{tabActive === '1' && (
							<>
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
							</>
						)}
					</>
				)}

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>

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

			<ModalChinhSuaImpact
				visible={visibleImpact}
				setVisible={setVisibleImpact}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>

			<ModalChinhSuaTrangThai
				visible={visibleStatus}
				setVisible={setVisibleStatus}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>
		</Card>
	);
};

export default FormActivityStudent;
