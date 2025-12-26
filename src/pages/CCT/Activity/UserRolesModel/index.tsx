import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { EparticipantRole } from '@/services/CCT/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentModel from './Form';

const UserRolesModelPage = (props: { disabled?: boolean; participantRole: EparticipantRole }) => {
	const intl = useIntl();
	const { disabled, participantRole } = props;
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
			title: intl.formatMessage({ id: 'activity.info.participantsList.column.name' }),
			dataIndex: 'name',
			width: 220,
		},
		{
			title: intl.formatMessage({ id: 'activity.info.participantsList.column.email' }),
			dataIndex: 'email',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'activity.info.participantsList.column.role' }),
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
						onConfirm={() =>
							deleteModel(rec?._id, getData, undefined, intl.formatMessage({ id: 'global.message.xoathanhcong' }))
						}
						title={intl.formatMessage({ id: 'activity.info.participantsList.confirm.xoa' })}
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
			modelName='cct.userroles'
			title={intl.formatMessage({ id: 'activity.info.form.participantsList' })}
			Form={FormStudentModel}
			formProps={{ getData, participantRole }}
			buttons={{ create: !disabled }}
			widthDrawer={800}
			hideCard
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default UserRolesModelPage;
