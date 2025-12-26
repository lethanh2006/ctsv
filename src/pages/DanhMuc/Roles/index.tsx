import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Switch } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectLevelsManagement from '../Levels/components/Select';
import FormRoles from './components/Form';

const RolesPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, putModel, formSubmiting, handleView } = useModel('danhmuc.roles');

	const onChecked = (rec: RolesManagement.IRecord, isActive: boolean) => {
		if (rec._id) putModel(rec._id, { isActive }).catch((er) => console.log(er));
	};

	const onCell = (rec: RolesManagement.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<RolesManagement.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'rolesmanagement.column.order' }),
			dataIndex: 'order',
			align: 'center',
			width: 100,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'rolesmanagement.column.id' }),
			dataIndex: 'code',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'rolesmanagement.column.name' }),
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'rolesmanagement.column.des' }),
			dataIndex: 'description',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'rolesmanagement.column.level' }),
			dataIndex: 'levelId',
			width: 120,
			render: (val, rec) => rec?.level?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
		},
		{
			title: intl.formatMessage({ id: 'rolesmanagement.column.active' }),
			dataIndex: 'isActive',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<Switch checked={val} onChange={(checked) => onChecked(rec, checked)} size='small' loading={formSubmiting} />
			),
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
						title={intl.formatMessage({ id: 'rolesmanagement.confirm.delete' })}
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
			modelName='danhmuc.roles'
			title={intl.formatMessage({ id: 'rolesmanagement.title' })}
			Form={FormRoles}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default RolesPage;
