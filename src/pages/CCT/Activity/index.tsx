import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
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
			title: 'Activity name',
			dataIndex: 'name',
			align: 'center',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Activity attributes',
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activitiesType?.attributes?.name,
			onCell,
		},
		{
			title: 'Co-curricular activity (CCA)',
			dataIndex: 'activitiesTypeId',
			width: 170,
			render: (val, rec) => rec?.activitiesType?.name,
			onCell,
		},
		{
			title: 'Date',
			width: 220,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />

					<Popconfirm onConfirm={() => deleteModel(rec._id)} title='Xác nhận xóa' placement='topLeft'>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
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
			title='Activity Management'
			Form={ModalActivity}
			widthDrawer={1000}
		/>
	);
};

export default ActivityPage;
