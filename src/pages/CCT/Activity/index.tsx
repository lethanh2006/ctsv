import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Space, Tag } from 'antd';
import { uniqBy } from 'lodash';
import { useIntl, useModel } from 'umi';
import FormActivity from './components/Form';
import ModalActivity from './components/Modal';
import StatActivity from './components/Stat';

const ActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, handleView, edit, isView } = useModel('cct.activity');
	const { getAnalyticsActivityModel } = useModel('cct.activity');

	const onCell = (rec: Activity.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Activity.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activity.column.name' }),
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.attribute' }),
			width: 200,
			render: (val, rec) => {
				const attri = uniqBy(rec?.coCurricularActivityEquivalency ?? [], 'attributesId');

				if (attri) {
					return (
						<Space wrap>
							{attri?.map((item: any) => (
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
							))}
						</Space>
					);
				} else return null;
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.cca' }),
			dataIndex: 'activitiesTypeId',
			width: 170,
			render: (val, rec) => rec?.activitiesType?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectActivitiesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.date' }),
			dataIndex: 'startDate',
			width: 220,
			render: (val, rec) =>
				[dayjs(rec?.startDate).format('HH:mm DD/MM/YYYY'), dayjs(rec?.endDate).format('HH:mm DD/MM/YYYY')]
					.filter(Boolean)
					.join(' - '),
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>

					<Popconfirm
						onConfirm={() =>
							deleteModel(
								rec._id,
								() => {
									getModel();
									getAnalyticsActivityModel();
								},
								{
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								},
							)
						}
						title={intl.formatMessage({ id: 'activity.confirm.xoa' })}
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
			),
		},
	];

	return (
		<Card
			title={intl.formatMessage({ id: 'activity.title' })}
			className='card-big-title card-borderless'
			variant='borderless'
		>
			<Card style={{ marginBottom: 12 }}>
				<StatActivity />
			</Card>

			<Card>
				<TableBase
					columns={columns}
					dependencies={[page, limit]}
					modelName='cct.activity'
					title={intl.formatMessage({ id: 'activity.title' })}
					// Form={ModalActivity}
					Form={isView ? ModalActivity : FormActivity}
					showModalTitle
					modalTitle={
						edit
							? intl.formatMessage({ id: 'activity.form.chinhsua' })
							: isView
								? intl.formatMessage({ id: 'activity.form.chitet' })
								: intl.formatMessage({ id: 'activity.form.themmoi' })
					}
					formProps={{
						getData: () => {
							getModel();
							getAnalyticsActivityModel();
						},
					}}
					widthDrawer={1200}
					onReload={() => {
						getModel();
						getAnalyticsActivityModel();
					}}
					hideCard
				/>
			</Card>
		</Card>
	);
};

export default ActivityPage;
