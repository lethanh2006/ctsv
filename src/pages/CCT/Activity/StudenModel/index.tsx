import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentModel from './Form';

const StudenModelPage = (props: { disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { getModel, page, limit, deleteModel } = useModel('cct.userroles');

	const getData = () => {
		if (recActivity?._id)
			getModel({
				activitiesId: recActivity?._id,
			});
	};

	const columns: IColumn<Activity.IParticipantsList>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'name',
			width: 220,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 100,
		},
		{
			title: 'Vai trò',
			dataIndex: 'participantRole',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => deleteModel(rec?._id)}
						title={intl.formatMessage({ id: 'activitiesmanagement.student.comfirm.xoa' })}
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
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recActivity?._id]}
			modelName='danhmuc.student'
			title='Participants user list'
			Form={FormStudentModel}
			formProps={{ getData }}
			buttons={{ create: !disabled }}
			widthDrawer={800}
			hideCard
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default StudenModelPage;
