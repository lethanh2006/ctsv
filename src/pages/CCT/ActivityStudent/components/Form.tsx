import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { primaryColor } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus, Evalidation, mapEvalidation } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Space, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChinhSuaImpact from './ModalImpact';
import ModalXuLyActivityStudent from './ModalXuLy';

const FormActivityStudent = (props: any) => {
	const { getData, tabActive, isActivity } = props;
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('cct.activityoutcome');

	const { getByIdModel, loading, record: recBieuMau } = useModel('tienich.bieumau');
	const {
		getByIdModel: getCauTraLoiMe,
		loading: loadingCauTraLoi,
		record: cauTraLoi,
	} = useModel('tienich.cautraloikhaosat');
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);

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

	const columns = [
		{
			title: 'Evidence',
			dataIndex: 'name',
			render: (_: any, r: any) => <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{r.name}</div>,
		},
		{
			title: 'File',
			dataIndex: 'file',
			render: (_: any, r: any) =>
				_ ? (
					<Space wrap>
						{_?.map((item: any) => (
							<Tag style={{ cursor: 'pointer' }} onClick={() => window.open(item)} color={primaryColor}>
								Detail
							</Tag>
						))}
					</Space>
				) : (
					<i className='text-warning'>No info</i>
				),
		},
	];

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

	const attriRe = record?.activities?.coCurricularActivityEquivalency?.filter(
		(item) => item?.rolesId === record?.rolesId,
	);

	return (
		<Card title='Detail activity'>
			<Spin spinning={loadingCauTraLoi || loading}>
				<Divider className='divider-big-title' orientation='left'>
					General Information
				</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} style={{ marginBottom: 12 }}>
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
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.activity' })} span={24}>
						{record?.activities?.name}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.cca' })} span={24}>
						{record?.activities?.activitiesType?.name}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.attribute' })} span={24}>
						{attriRe && (
							<Space wrap>
								{attriRe?.map((item: any) => (
									<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
								))}
							</Space>
						)}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.organizer' })}>
						{record?.activities?.organizer}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.facility' })}>
						{record?.activities?.facilityName}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.startdate' })}>
						{record?.activities?.startDate ? dayjs(record.activities.startDate).format('HH:mm DD/MM/YYYY') : '-'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'activityresult.column.enddate' })}>
						{record?.activities?.endDate ? dayjs(record.activities.endDate).format('HH:mm DD/MM/YYYY') : '-'}
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
							{record?.workflow}
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

				{record?.evidenceFile?.length && (
					<>
						<Divider className='divider-big-title' orientation='left'>
							Evidence Required
						</Divider>

						<TableStaticData
							columns={columns as any}
							data={record?.evidenceFile}
							size='small'
							hasTotal
							addStt
							otherProps={{
								pagination: false,
								scroll: {
									y: 350,
								},
							}}
						/>
					</>
				)}

				{record?.competencyList?.length && (
					<>
						<Divider className='divider-big-title' orientation='left'>
							List competency
						</Divider>

						<TableStaticData columns={columnsCompetency} data={record?.competencyList} size='small' hasTotal />
					</>
				)}

				{/* <Divider className='divider-big-title' orientation='left'>
					Self-Assessment Questions
				</Divider>
				<ViewTraLoiKhaoSat khaoSat={recBieuMau} cauTraLoi={cauTraLoi} /> */}

				<div className='form-footer'>
					{tabActive === 'IMPACT' && (
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
					)}
					{tabActive === EActivityCategory.REGISTERED && (
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

			<ModalChinhSuaImpact
				visible={visibleImpact}
				setVisible={setVisibleImpact}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>
		</Card>
	);
};

export default FormActivityStudent;
