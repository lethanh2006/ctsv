import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
	mapEvalidation,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { Button, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from '../../ActivityStudent/components/Form';

const PersonalActivity = () => {
	const intl = useIntl();
	const { record: recActivity, setVisibleForm: setVisibleActi } = useModel('cct.activity');
	const { handleView, visibleForm, setVisibleForm } = useModel('cct.activityoutcome');

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
			title: 'Activity name',
			dataIndex: 'activitiesOutcomeName',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Activity type',
			width: 200,
			render: (val, rec) => rec?.activitiesType?.name,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.level' }),
			dataIndex: 'levelsId',
			width: 140,
			render: (val, rec) => rec?.levels?.name,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.role' }),
			dataIndex: 'rolesId',
			width: 200,
			render: (val, rec) => rec?.roles?.name,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.startdate' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activities?.startDate && dayjs(rec?.activities?.startDate).format('DD/MM/YYYY'),
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
			<TableStaticData columns={columns} data={recActivity?.activityOutcomes ?? []} addStt hasTotal />

			<div className='form-footer'>
				<Button onClick={() => setVisibleActi(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

			<ModalExpandable
				width={1000}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				open={visibleForm}
				styles={{
					body: { padding: 0 },
				}}
			>
				<FormActivityStudent isActivity />
			</ModalExpandable>
		</>
	);
};

export default PersonalActivity;
