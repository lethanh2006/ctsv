import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
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
import { Button, Card, Popover, Space, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from './components/Form';
import ModalChinhSuaImpact from './components/ModalImpact';
import ModalChinhSuaTrangThai from './components/ModalTrangThai';
import ModalXuLyActivityStudent from './components/ModalXuLy';
import StatActivityOutCome from './components/Stat';

const HistoryActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleView, setRecord, getAnalyticsStaffModel } = useModel('cct.activityoutcome');

	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);
	const [visibleStatus, setVisibleStatus] = useState<boolean>(false);
	const [tabActive, setTabActive] = useState<string>('1');
	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();

	const getData = () => {
		const filters: any[] = [];

		if (tabActive === '1') {
			filters.push({
				active: true,
				field: 'workflow',
				values: [EApprovalStatus.SUBMITTED],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (tabActive === '2') {
			filters.push({
				active: true,
				field: 'workflow',
				values: [EApprovalStatus.APPROVED, EApprovalStatus.REJECTED, EApprovalStatus.CHANGES_REQUIRED],
				operator: EOperatorType.INCLUDE,
			});
		}

		getModel(undefined, filters, undefined, undefined, undefined, 'approval-task-list/page');
	};

	const getThongKe = () => {
		getAnalyticsStaffModel();
	};

	const onCell = (rec: ActivityOutCome.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: 'Activity Category',
			dataIndex: 'activityCategory',
			width: 160,
			render: (val, rec) => mapNameActivityCategory[val as EActivityCategory],
			filterType: 'select',
			filterData: Object.values(EActivityCategory).map((item) => ({
				value: item,
				label: mapNameActivityCategory[item],
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.level' }),
			dataIndex: 'levelsId',
			width: 140,
			render: (val, rec) => rec?.levels?.name ?? <i className='text-warning'>No info</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.sv.name' }),
			dataIndex: 'name',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.name' }),
			width: 180,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED ? rec?.activities?.name : rec?.activitiesOutcomeName,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.cca' }),
			width: 200,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? rec?.activities?.activitiesType?.name
					: rec?.activitiesType?.name,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.attribute' }),
			width: 200,
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
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
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
				(rec?.activityCategory === EActivityCategory.REGISTERED ? rec?.activities?.competencyList : rec?.competencyList)
					?.map((item) => item?.competency?.name)
					.filter(Boolean)
					.join(', '),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.startdate' }),
			align: 'center',
			width: 120,
			render: (val, rec) =>
				(rec?.activityCategory === EActivityCategory.REGISTERED ? rec?.activities?.startDate : rec?.startDate) &&
				dayjs(
					rec?.activityCategory === EActivityCategory.REGISTERED ? rec?.activities?.startDate : rec?.startDate,
				).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.role' }),
			dataIndex: 'rolesId',
			width: 200,
			render: (val, rec) => rec?.roles?.name ?? <i className='text-warning'>No info</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: 'Impact',
			dataIndex: 'validation',
			align: 'center',
			width: 110,
			render: (val, rec) => (
				<Tag
					color={mapEvalidation[val as Evalidation]}
					style={{
						maxWidth: 120,
						whiteSpace: 'normal',
						wordBreak: 'break-word',
						textAlign: 'center',
					}}
				>
					{val}
				</Tag>
			),
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(Evalidation).map((item) => ({
				value: item,
				label: item,
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 100,
			render: (val, rec) => (
				<Tag
					color={mapColorApprovalStatus[val as EApprovalStatus]}
					style={{
						maxWidth: 120,
						whiteSpace: 'normal',
						wordBreak: 'break-word',
						textAlign: 'center',
					}}
				>
					{mapNameApprovalStatus[val as EApprovalStatus]}
				</Tag>
			),
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(EApprovalStatus).map((item) => ({
				value: item,
				label: mapNameApprovalStatus[item as EApprovalStatus],
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => {
				return (
					<>
						<ButtonExtend
							disabled={rec?.workflow === EApprovalStatus.APPROVED}
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
									{tabActive === '2' && (
										<>
											<ButtonExtend
												onClick={() => {
													setRecord(rec);
													setVisibleStatus(true);
												}}
												type='link'
												icon={<SyncOutlined />}
												size='small'
											>
												Change status
											</ButtonExtend>

											<ButtonExtend
												onClick={() => {
													setRecord(rec);
													setVisibleImpact(true);
												}}
												type='link'
												icon={<SafetyCertificateOutlined />}
												size='small'
												className='btn-success'
											>
												Verify impact
											</ButtonExtend>
										</>
									)}

									{tabActive === '1' && (
										<>
											<ButtonExtend
												disabled={rec?.workflow === EApprovalStatus.REJECTED}
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
												disabled={rec?.workflow === EApprovalStatus.CHANGES_REQUIRED}
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
										</>
									)}
								</Space>
							}
							placement='bottomLeft'
						>
							<Button icon={<MenuOutlined />} type='link' />
						</Popover>
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
					<StatActivityOutCome getData={getThongKe} />
				</Card>

				<Card>
					<TableBase
						getData={getData}
						formProps={{
							getData: () => {
								getData();
								getThongKe();
							},
							tabActive,
						}}
						columns={columns}
						dependencies={[page, limit, tabActive]}
						modelName='cct.activityoutcome'
						title={intl.formatMessage({ id: 'activityresult.title' })}
						Form={FormActivityStudent}
						widthDrawer={1000}
						buttons={{ create: false }}
						onReload={() => {
							getData();
							getThongKe();
						}}
						hideCard
					>
						<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab)}>
							<Tabs.TabPane key='1' tab='Pending' />
							<Tabs.TabPane key='2' tab='Processed' />
						</Tabs>
					</TableBase>
				</Card>
			</Card>

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

			<ModalChinhSuaImpact visible={visibleImpact} setVisible={setVisibleImpact} getData={getData} />
			<ModalChinhSuaTrangThai visible={visibleStatus} setVisible={setVisibleStatus} getData={getData} />
		</>
	);
};

export default HistoryActivityPage;
