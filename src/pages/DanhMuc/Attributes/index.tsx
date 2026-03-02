import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Image, Popconfirm, Switch, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormAttributes from './components/Form';

const AttributesPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, putModel, formSubmiting, handleView } = useModel('danhmuc.attributes');

	const onChecked = (rec: AttributesManagement.IRecord, isActive: boolean) => {
		if (rec._id) putModel(rec._id, { isActive }).catch((er) => console.log(er));
	};

	const onCell = (rec: AttributesManagement.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<AttributesManagement.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.icon' }),
			dataIndex: 'icon',
			align: 'center',
			width: 90,
			render: (val) =>
				val ? <Image src={val} width={64} height={64} preview={false} style={{ objectFit: 'contain' }} /> : null,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.id' }),
			dataIndex: 'code',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.name' }),
			dataIndex: 'name',
			width: 200,
			render: (val, rec) => <Tag color={rec?.color}>{rec?.name}</Tag>,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.des' }),
			dataIndex: 'description',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.active' }),
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
							deleteModel(rec._id, undefined, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'attributesmanagement.confirm.delete' })}
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
			modelName='danhmuc.attributes'
			title={intl.formatMessage({ id: 'attributesmanagement.title' })}
			Form={FormAttributes}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default AttributesPage;
