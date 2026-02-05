import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormCompetencyAttributeModel from './Form';

const AttributesCompetencyModel = (props: { disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled } = props;
	const { record: recCompetency } = useModel('danhmuc.competency');
	const { getModel, page, limit, deleteModel } = useModel('danhmuc.competencyattributes');

	const getData = () => {
		if (recCompetency?._id)
			getModel({
				competencyId: recCompetency?._id,
			});
	};

	const columns: IColumn<Competency.ICompetencyAttributes>[] = [
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.id' }),
			dataIndex: ['attributes', 'code'],
			align: 'center',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.name' }),
			dataIndex: ['attributes', 'name'],
			width: 200,
			render: (val, rec) => <Tag color={rec?.attributes?.color}>{rec?.attributes?.name}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'attributesmanagement.column.des' }),
			dataIndex: ['attributes', 'description'],
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() =>
							deleteModel(rec._id, undefined, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title='Do you want to remove this competency attribute?'
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
							disabled={disabled}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recCompetency?._id]}
			modelName='danhmuc.competencyattributes'
			title='Competency attribute'
			Form={FormCompetencyAttributeModel}
			formProps={{ getData }}
			buttons={{ create: !disabled }}
			hideCard
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default AttributesCompetencyModel;
