import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalActivity from './components/Modal';

const ActivityPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, handleView } = useModel('cct.activity');

	const onCell = (rec: Activity.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Activity.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activity.column.name' }),
			dataIndex: 'name',
			align: 'center',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.attribute' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activitiesType?.attributes?.name,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.cca' }),
			dataIndex: 'activitiesTypeId',
			width: 170,
			render: (val, rec) => rec?.activitiesType?.name,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.date' }),
			width: 220,
			render: (val, rec) =>
				`${dayjs(rec?.startDate).format('DD/MM/YYYY')} - ${dayjs(rec?.endDate).format('DD/MM/YYYY')}`,
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
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>

					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
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
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='cct.activity'
			title={intl.formatMessage({ id: 'activity.title' })}
			Form={ModalActivity}
			widthDrawer={1000}
		/>
	);
};

export default ActivityPage;
