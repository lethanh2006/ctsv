import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapEvalidation,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { Button, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from '../../ActivityStudent/components/Form';

const RegisteredActivity = () => {
	const intl = useIntl();
	const { record: recActivity, setVisibleForm } = useModel('cct.activity');
	const { getModel, page, limit, handleView } = useModel('cct.activityoutcome');

	const getData = () => {
		if (recActivity?._id)
			getModel({
				activitiesId: recActivity?._id,
				activityCategory: EActivityCategory.REGISTERED,
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
			dataIndex: 'startDate',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: 'Impact',
			dataIndex: 'validation',
			align: 'center',
			width: 110,
			render: (val, rec) => (
				<Tag
					color={mapEvalidation[val as Evalidation]}
					style={{
						maxWidth: 120,
						whiteSpace: 'normal',
						wordBreak: 'break-word',
						textAlign: 'center',
					}}
				>
					{val}
				</Tag>
			),
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(Evalidation).map((item) => ({
				value: item,
				label: item,
			})),
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
						color: mapColorTextApprovalStatus[rec?.workflow as EApprovalStatus],
						fontWeight: 600,
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
			/>

			<FormActivityStudent isActivity />

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</>
	);
};

export default RegisteredActivity;
