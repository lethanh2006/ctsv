import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { TFilter, type IColumn } from '@/components/Table/typing';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { officialColors } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapEvalidation,
	mapNameActivityCategory,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	MenuOutlined,
	SafetyCertificateOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { Button, Card, Popover, Segmented, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from './components/Form';
import StatActivityOutCome from './components/Stat';
import ModalChinhSuaImpact from './Modal/ModalImpact';
import ModalChinhSuaTrangThai from './Modal/ModalTrangThai';
import ModalXuLyActivityStudent from './Modal/ModalXuLy';

const HistoryActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleView, setRecord, getAnalyticsStaffModel, filters, setFilters } =
		useModel('cct.activityoutcome');
	const { getAllModel: getAllAtributes } = useModel('danhmuc.attributes');

	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);
	const [visibleStatus, setVisibleStatus] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();
	const [segmentSelected, setSegmentSelected] = useState<EActivityCategory | string>(EActivityCategory.REGISTERED);
	const valueFiltered = filters?.find((item) => item.field?.includes('workflow'))?.values ?? [];

	const PROCESSED = [EApprovalStatus.APPROVED, EApprovalStatus.REJECTED, EApprovalStatus.CHANGES_REQUIRED];

	const pending = valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.SUBMITTED;
	const processed = valueFiltered?.length === PROCESSED.length && PROCESSED.every((s) => valueFiltered.includes(s));

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	const getData = () => {
		const filters: any[] = [];

		if (segmentSelected !== 'ALL') {
			filters.push({
				active: true,
				field: 'activityCategory',
				values: [segmentSelected],
				operator: EOperatorType.INCLUDE,
			});
		}

		getModel(
			undefined,
			[
				...filters,
				{
					active: true,
					field: 'workflow',
					values: [EApprovalStatus.EVIDENCE_REQUIRED, EApprovalStatus.DRAFT],
					operator: EOperatorType.NOT_INCLUDE,
				},
			],
			processed
				? {
						approvalTime: -1,
					}
				: {
						submittedAt: 1,
					},
			undefined,
			undefined,
			'approval-task-list/page',
		);
	};

	const getThongKe = () => {
		getAnalyticsStaffModel();
	};

	const onCell = (rec: ActivityOutCome.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const isActivitiesNameFilter = <T,>(f: TFilter<T>) => {
		if (Array.isArray(f.field)) {
			return f.field[0] === 'activities' && f.field[1] === 'name';
		}
		return f.field === 'activitiesOutcomeName';
	};

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: 'Student Code',
			dataIndex: 'code',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Student Name',
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Activity Name',
			dataIndex: segmentSelected === EActivityCategory.REGISTERED ? ['activities', 'name'] : 'activitiesOutcomeName',
			width: 180,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED ? rec?.activities?.name : rec?.activitiesOutcomeName,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Role',
			dataIndex: 'rolesId',
			width: 180,
			render: (val, rec) => rec?.roles?.name ?? <i className='text-warning'>No info</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: 'Level',
			dataIndex: 'levelsId',
			width: 120,
			render: (val, rec) => rec?.levels?.name ?? <i className='text-warning'>No info</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
			onCell,
		},
		{
			title: 'Attribute',
			width: 160,
			render: (val, rec) => {
				const attriRe = rec?.activities?.coCurricularActivityEquivalency?.filter(
					(item) => item?.rolesId === rec?.rolesId,
				);

				const attriDec = rec?.activitiesType?.attributes;

				if (rec?.activityCategory === EActivityCategory.REGISTERED) {
					return (
						<Space wrap>
							{attriRe?.map((item: any) => (
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
							))}
						</Space>
					);
				} else
					return (
						<Space wrap>
							{attriDec?.map((item: any) => (
								<Tag color={item?.color}>{item?.name}</Tag>
							))}
						</Space>
					);
			},
			onCell,
		},
		{
			title: 'Competency',
			width: 220,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED ? (
					<ExpandText>
						{rec?.activities?.competencyList

							?.map((item) => item?.competency?.name)
							.filter(Boolean)
							.join(', ')}
					</ExpandText>
				) : (
					<ExpandText>
						{rec?.listAchievedCompetencies

							?.map((item) => item?.competencie?.name)
							.filter(Boolean)
							.join(', ')}
					</ExpandText>
				),
			onCell,
		},
		{
			title: 'Activity Type',
			width: 200,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? rec?.activities?.activitiesType?.name
					: rec?.activitiesType?.name,
			onCell,
		},
		{
			title: 'Track',
			width: 120,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? (rec?.activities?.activitiesType?.trackText ?? rec?.activities?.activitiesType?.track?.name)
					: (rec?.activitiesType?.trackText ?? rec?.activitiesType?.track?.name),
			onCell,
		},
		{
			title: 'Mentor/Supervisor',
			dataIndex: 'supervisorName',
			width: 150,
			filterType: 'string',
			onCell,
			hide: segmentSelected === EActivityCategory.REGISTERED,
		},
		{
			title: 'Submission Time',
			dataIndex: 'submittedAt',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: 'Approver',
			dataIndex: 'studentDeclarationApproverName',
			width: 150,
			render: (val, rec) => {
				const approvalWorkflow =
					rec?.workflow === EApprovalStatus.APPROVED ||
					rec?.workflow === EApprovalStatus.REJECTED ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED;

				return (
					<>
						{rec?.workflow === EApprovalStatus.APPROVED && !rec?.studentDeclarationApproverName
							? 'System'
							: approvalWorkflow
								? rec?.studentDeclarationApproverName
								: rec?.activities?.studentDeclarationApproverList
										?.map((item) => item?.name)
										.filter(Boolean)
										.join(', ')}
					</>
				);
			},
			filterType: 'string',
			onCell,
			hide: pending,
		},
		{
			title: 'Evidence Review Time',
			dataIndex: 'approvalTime',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			sortable: true,
			hide: pending,
			onCell,
		},
		{
			title: 'Impact',
			dataIndex: 'validation',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.workflow === EApprovalStatus.APPROVED && <Tag color={mapEvalidation[val as Evalidation]}>{val}</Tag>,
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(Evalidation).map((item) => ({
				value: item,
				label: item,
			})),
			onCell,
			hide: pending,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => {
				const now = dayjs();
				const endDateUpdateEvidence =
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED
						? rec?.dueDate
							? dayjs(rec?.dueDate)
							: null
						: rec?.activities?.allowPostEventResultsUpdate
							? rec?.activities?.dueDate
								? dayjs(rec?.activities?.dueDate)
								: null
							: rec?.activities?.endDate
								? dayjs(rec?.activities?.endDate)
								: null;

				const editableWorkflow =
					rec?.workflow === EApprovalStatus.DRAFT ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
					rec?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

				const isExpired =
					rec?.activityCategory === EActivityCategory.REGISTERED
						? editableWorkflow && now.isAfter(endDateUpdateEvidence)
						: rec?.workflow === EApprovalStatus.CHANGES_REQUIRED && now.isAfter(dayjs(rec?.dueDate));

				if (isExpired) {
					return (
						<Tag
							color={officialColors.official500}
							style={{
								color: officialColors.official300,
								fontWeight: 600,
							}}
						>
							Expired
						</Tag>
					);
				}
				return (
					<Tag
						color={mapColorApprovalStatus[val as EApprovalStatus]}
						style={{
							maxWidth: 120,
							whiteSpace: 'normal',
							wordBreak: 'break-word',
							textAlign: 'center',
							color: mapColorTextApprovalStatus[rec?.workflow as EApprovalStatus],
							fontWeight: 600,
						}}
					>
						{mapNameApprovalStatus[val as EApprovalStatus]}
					</Tag>
				);
			},
			fixed: 'right',
			filterType: !pending && !processed ? 'select' : undefined,
			filterData: Object.values(EApprovalStatus).map((item) => ({
				value: item,
				label: mapNameApprovalStatus[item as EApprovalStatus],
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, rec) => {
				if (rec?.workflow === EApprovalStatus.SUBMITTED) {
					return (
						<>
							<ButtonExtend
								// disabled={rec?.workflow === EApprovalStatus.APPROVED}
								tooltip={intl.formatMessage({ id: 'activityresult.button.duyet' })}
								onClick={() => {
									setRecord(rec);
									setTrangThai({
										title: intl.formatMessage({ id: 'activityresult.xuly.duyet' }),
										trangThai: EApprovalStatus.APPROVED,
									});
									setVisibleXuLy(true);
								}}
								type='link'
								icon={<CheckCircleOutlined />}
								className='btn-success'
							/>

							<Popover
								content={
									<Space direction='vertical' size={4} className='action-popover'>
										<ButtonExtend
											// disabled={rec?.workflow === EApprovalStatus.REJECTED}
											onClick={() => {
												setRecord(rec);
												setTrangThai({
													title: intl.formatMessage({ id: 'activityresult.xuly.tuchoi' }),
													trangThai: EApprovalStatus.REJECTED,
												});
												setVisibleXuLy(true);
											}}
											type='link'
											icon={<CloseCircleOutlined />}
											danger
											size='small'
										>
											{intl.formatMessage({ id: 'activityresult.button.tuchoi' })}
										</ButtonExtend>

										<ButtonExtend
											// disabled={rec?.workflow === EApprovalStatus.CHANGES_REQUIRED}
											onClick={() => {
												setRecord(rec);
												setTrangThai({
													title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
													trangThai: EApprovalStatus.CHANGES_REQUIRED,
												});
												setVisibleXuLy(true);
											}}
											type='link'
											icon={<EditOutlined />}
											size='small'
											className='btn-warning'
										>
											{intl.formatMessage({ id: 'activityresult.button.yccs' })}
										</ButtonExtend>
									</Space>
								}
								placement='bottomLeft'
							>
								<Button icon={<MenuOutlined />} type='link' />
							</Popover>
						</>
					);
				}
				return (
					<>
						<ButtonExtend
							tooltip='Change status'
							onClick={() => {
								setRecord(rec);
								setVisibleStatus(true);
							}}
							type='link'
							icon={<SyncOutlined />}
							size='small'
						/>

						<ButtonExtend
							tooltip='Verify impact'
							onClick={() => {
								setRecord(rec);
								setVisibleImpact(true);
							}}
							type='link'
							icon={<SafetyCertificateOutlined />}
							size='small'
							className='btn-success'
							disabled={rec?.workflow !== EApprovalStatus.APPROVED}
						/>
					</>
				);
			},
		},
	];

	return (
		<>
			<Card
				title={intl.formatMessage({ id: 'activityresult.title' })}
				className='card-big-title card-borderless'
				variant='borderless'
			>
				<Card style={{ marginBottom: 12 }}>
					<StatActivityOutCome getData={getThongKe} pending={pending} processed={processed} />
				</Card>

				<Card>
					<TableBase
						getData={getData}
						columns={columns}
						dependencies={[page, limit, segmentSelected]}
						modelName='cct.activityoutcome'
						title={intl.formatMessage({ id: 'activityresult.title' })}
						widthDrawer={1000}
						buttons={{ create: false }}
						onReload={() => {
							getData();
							getThongKe();
						}}
						hideCard
						otherButtons={[
							<Segmented
								options={[
									// {
									// 	value: 'ALL',
									// 	label: 'All',
									// },
									...Object.values(EActivityCategory).map((item) => ({
										value: item,
										label: mapNameActivityCategory[item],
									})),
								]}
								value={segmentSelected}
								onChange={(val) => {
									setSegmentSelected(val);
									setFilters((prev) => prev.filter((f) => !isActivitiesNameFilter(f)));
								}}
							/>,
						]}
					/>
				</Card>
			</Card>

			<FormActivityStudent
				getData={() => {
					getData();
					getThongKe();
				}}
			/>

			<ModalXuLyActivityStudent
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai ?? EApprovalStatus.DRAFT}
				getData={() => {
					getData();
					getThongKe();
				}}
			/>

			<ModalChinhSuaImpact
				visible={visibleImpact}
				setVisible={setVisibleImpact}
				getData={() => {
					getData();
					getThongKe();
				}}
			/>

			<ModalChinhSuaTrangThai
				visible={visibleStatus}
				setVisible={setVisibleStatus}
				getData={() => {
					getData();
					getThongKe();
				}}
			/>
		</>
	);
};

export default HistoryActivityPage;
