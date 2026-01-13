import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentDomainModel from './Form';

const StudenDomainModelPage = (props: { mode: 'activitiesType' | 'activity'; disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled, mode } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { record: recActiType } = useModel('danhmuc.ccd');
	const { getModel, page, limit, deleteModel } = useModel('danhmuc.studentdomain');

	const getData = () => {
		if (recActiType?._id || recActivity?._id)
			getModel(
				mode === 'activitiesType'
					? {
							activitiesTypeDomainId: recActiType?._id,
						}
					: {
							activitiesId: recActivity?._id,
						},
			);
	};

	const columns: IColumn<ActivitiesTypeDomain.IStudentDeclaration>[] = [
		{
			title: intl.formatMessage({ id: 'activitiestypedomain.student.column.hoten' }),
			dataIndex: 'name',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activitiestypedomain.student.column.email' }),
			dataIndex: 'email',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() =>
							deleteModel(rec._id, undefined, {
								messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
							})
						}
						title={intl.formatMessage({ id: 'activitiestypedomain.student.comfirm.xoa' })}
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
			dependencies={[page, limit, recActiType?._id, recActivity?._id]}
			modelName='danhmuc.studentdomain'
			title={intl.formatMessage({ id: 'activitiestypedomain.title' })}
			Form={FormStudentDomainModel}
			formProps={{ getData, mode }}
			buttons={{ create: !disabled }}
			hideCard
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default StudenDomainModelPage;
