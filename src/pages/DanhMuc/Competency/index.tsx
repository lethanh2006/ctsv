import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Switch, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectAttributesManagement from '../Attributes/components/Select';
import FormCompetency from './components/Form';

const CompetencyPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, putModel, formSubmiting, handleView } = useModel('danhmuc.competency');

	const onChecked = (rec: Competency.IRecord, isActive: boolean) => {
		if (rec._id) putModel(rec._id, { isActive }).catch((er) => console.log(er));
	};

	const onCell = (rec: Competency.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<Competency.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'competency.column.order' }),
			dataIndex: 'order',
			align: 'center',
			width: 100,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'competency.column.id' }),
			dataIndex: 'code',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'competency.column.name' }),
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'competency.column.des' }),
			dataIndex: 'description',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'competency.column.attribute' }),
			dataIndex: 'attributesId',
			width: 200,
			render: (val, rec) => <Tag color={rec?.attributes?.color}>{rec?.attributes?.name}</Tag>,
			filterType: 'customselect',
			filterCustomSelect: <SelectAttributesManagement multiple />,
		},
		{
			title: intl.formatMessage({ id: 'competency.column.active' }),
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
						onConfirm={() =>
							deleteModel(rec._id, undefined, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'competency.confirm.delete' })}
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
			modelName='danhmuc.competency'
			title={intl.formatMessage({ id: 'competency.title' })}
			Form={FormCompetency}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default CompetencyPage;
