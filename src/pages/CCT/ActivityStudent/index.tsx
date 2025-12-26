import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	mapColorApprovalStatus,
	mapNameActivityCategory,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	MenuOutlined,
	RedoOutlined,
} from '@ant-design/icons';
import { Button, Card, Checkbox, Popconfirm, Popover, Tabs, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from './components/Form';
import FormPerstionActivityOutCome from './components/FormPerstion';
import ModalXuLyActivityStudent from './components/ModalXuLy';
import StatActivityOutCome from './components/Stat';

const HistoryActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleView, deleteModel, setRecord } = useModel('cct.activityoutcome');
	const { getAllModel, danhSach: dsAtribute } = useModel('danhmuc.attributes');
	const { getAnalyticsStaffModel } = useModel('cct.activityoutcome');

	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);

	const [tabActive, setTabActive] = useState<EActivityCategory>(EActivityCategory.REGISTERED);

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();

	useEffect(() => {
		getAllModel(undefined, { order: 1 });
	}, []);

	const getData = () => {
		getModel(
			{
				activityCategory: tabActive,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			'approval-task-list/page',
		);
	};

	const getThongKe = () => {
		getAnalyticsStaffModel(tabActive);
	};

	const attributeColumns: IColumn<any>[] = useMemo(() => {
		if (!dsAtribute?.length) return [];

		return dsAtribute.map((attr: any) => ({
			title: attr.code,
			width: 90,
			align: 'center',
			render: (val, rec) => {
				const check = rec?.activities?.coCurricularActivityEquivalency;

				const isChecked = check?.some((item: any) => item.rolesId === rec.rolesId && item.attributesId === attr._id);

				return <Checkbox checked={isChecked} />;
			},
			onCell,
		}));
	}, [dsAtribute]);

	const onCell = (rec: ActivityOutCome.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.name' }),
			dataIndex: 'activitiesOutcomeName',
			width: 150,
			filterType: 'string',
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.cca' }),
			dataIndex: 'activitiesTypeId',
			width: 160,
			render: (val, rec) => rec?.activitiesType?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectActivitiesManagement multiple />,
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.activity' }),
			width: 150,
			render: (val, rec) => rec?.activities?.name,
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.attribute' }),
			align: 'center',
			width: 200,
			render: (val, rec) => (
				<Tag color={rec?.activities?.activitiesType?.attributes?.color}>
					{rec?.activities?.activitiesType?.attributes?.name}
				</Tag>
			),
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.cca' }),
			width: 170,
			render: (val, rec) => rec?.activities?.activitiesType?.name,
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.startdate' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activities?.startDate && dayjs(rec?.activities?.startDate).format('DD/MM/YYYY'),
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.created' }),
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
			sortable: true,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.role' }),
			dataIndex: 'rolesId',
			width: 120,
			render: (val, rec) => rec?.roles?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.level' }),
			width: 140,
			render: (val, rec) => rec?.roles?.level?.name,
			onCell,
		},
		...attributeColumns,
		{
			title: 'Rejection Note',
			dataIndex: 'activityRejectionNote',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Revision Note',
			dataIndex: 'revisionNote',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={mapColorApprovalStatus[val as EApprovalStatus]}>
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
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
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
							<>
								<ButtonExtend
									disabled={rec?.workflow === EApprovalStatus.REJECTED}
									tooltip={intl.formatMessage({ id: 'activityresult.button.tuchoi' })}
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
								/>
								<ButtonExtend
									disabled={rec?.workflow === EApprovalStatus.CHANGES_REQUIRED}
									tooltip={intl.formatMessage({ id: 'activityresult.button.yccs' })}
									onClick={() => {
										setRecord(rec);
										setTrangThai({
											title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
											trangThai: EApprovalStatus.CHANGES_REQUIRED,
										});
										setVisibleXuLy(true);
									}}
									type='link'
									icon={<RedoOutlined />}
								/>
								{/* <ButtonExtend tooltip='Edit' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} /> */}
								<Popconfirm
									onConfirm={() =>
										deleteModel(
											rec?._id,
											() => {
												getData();
												getThongKe();
											},
											undefined,
											intl.formatMessage({ id: 'global.message.xoathanhcong' }),
										)
									}
									title={intl.formatMessage({ id: 'activityresult.comfirm.xoa' })}
									placement='topLeft'
								>
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
										danger
										type='link'
										icon={<DeleteOutlined />}
									/>
								</Popconfirm>
							</>
						}
						placement='bottomLeft'
					>
						<Button icon={<MenuOutlined />} type='link' />
					</Popover>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'activityresult.title' })}>
			<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab as EActivityCategory)}>
				{Object.values(EActivityCategory).map((item) => (
					<Tabs.TabPane tab={mapNameActivityCategory[item]} key={item} />
				))}
			</Tabs>

			<StatActivityOutCome getData={getThongKe} dependency={tabActive} />

			<TableBase
				getData={getData}
				formProps={{
					getData: () => {
						getData();
						getThongKe();
					},
				}}
				columns={columns}
				dependencies={[page, limit, tabActive]}
				modelName='cct.activityoutcome'
				title={intl.formatMessage({ id: 'activityresult.title' })}
				Form={tabActive === EActivityCategory.REGISTERED ? FormActivityStudent : FormPerstionActivityOutCome}
				widthDrawer={800}
				hideCard
				buttons={{ create: false }}
				onReload={() => {
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
		</Card>
	);
};

export default HistoryActivityPage;
