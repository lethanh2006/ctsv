import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	mapColorApprovalStatus,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { Button, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from '../../ActivityStudent/components/Form';
import FormPerstionActivityOutCome from '../../ActivityStudent/components/FormPerstion';

const ListStudentActivity = () => {
	const intl = useIntl();
	const { record: recActivity, setVisibleForm } = useModel('cct.activity');
	const { getModel, page, limit, record, handleView } = useModel('cct.activityoutcome');

	const getData = () => {
		if (recActivity?._id)
			getModel({
				activitiesId: recActivity?._id,
			});
	};

	const onCell = (rec: ActivityOutCome.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.column.sv.name' }),
			dataIndex: 'name',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.sv.email' }),
			dataIndex: 'email',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.level' }),
			dataIndex: 'levelsId',
			width: 140,
			render: (val, rec) => rec?.levels?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.role' }),
			dataIndex: 'rolesId',
			width: 200,
			render: (val, rec) => rec?.roles?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.startdate' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activities?.startDate && dayjs(rec?.activities?.startDate).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.created' }),
			dataIndex: 'createdAt',
			align: 'center',
			width: 150,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag
					color={mapColorApprovalStatus[val as EApprovalStatus]}
					style={{
						maxWidth: 120,
						whiteSpace: 'normal',
						wordBreak: 'break-word',
						textAlign: 'center',
					}}
				>
					{mapNameApprovalStatus[val as EApprovalStatus]}
				</Tag>
			),
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(EApprovalStatus).map((item) => ({
				value: item,
				label: mapNameApprovalStatus[item as EApprovalStatus],
			})),
			onCell,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recActivity?._id]}
				modelName='cct.activityoutcome'
				buttons={{ create: false }}
				hideCard
				Form={
					record?.activityCategory === EActivityCategory.REGISTERED ? FormActivityStudent : FormPerstionActivityOutCome
				}
				widthDrawer={record?.activityCategory === EActivityCategory.REGISTERED ? 800 : 1000}
				formProps={{ isActivity: true }}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</>
	);
};

export default ListStudentActivity;
