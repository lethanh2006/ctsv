import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentModel from './Form';

const StudenModelPage = (props: { mode: 'activitiesType' | 'activity'; disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled, mode } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { record: recActiType } = useModel('danhmuc.activities');
	const { getModel, page, limit, deleteModel } = useModel('danhmuc.student');

	const getData = () => {
		if (recActiType?._id || recActivity?._id)
			getModel(
				mode === 'activitiesType'
					? {
							activitiesTypeId: recActiType?._id,
						}
					: {
							activitiesId: recActivity?._id,
						},
			);
	};

	const columns: IColumn<ActivitiesManagement.IStudentDeclaration>[] = [
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.student.column.hoten' }),
			dataIndex: 'name',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activitiesmanagement.student.column.email' }),
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
						title={intl.formatMessage({ id: 'activitiesmanagement.student.comfirm.xoa' })}
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
			modelName='danhmuc.student'
			title={intl.formatMessage({ id: 'activitiesmanagement.title' })}
			Form={FormStudentModel}
			formProps={{ getData, mode }}
			buttons={{ create: !disabled }}
			hideCard
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default StudenModelPage;
