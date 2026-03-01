import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { officialColors } from '@/services/base/constant';
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
import { Button, Space, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ListEvidenceActivity = () => {
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
			title: 'Student Code',
			dataIndex: 'code',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Student Name',
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Role',
			dataIndex: 'rolesId',
			width: 180,
			render: (val, rec) => rec?.roles?.name ?? <i className='text-warning'>No info</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: 'Level',
			dataIndex: 'levelsId',
			width: 120,
			render: (val, rec) => rec?.levels?.name ?? <i className='text-warning'>No info</i>,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
			onCell,
		},
		{
			title: 'Track',
			width: 120,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? (rec?.activities?.activitiesType?.trackText ?? rec?.activities?.activitiesType?.track?.name)
					: (rec?.activitiesType?.trackText ?? rec?.activitiesType?.track?.name),
			onCell,
		},
		{
			title: 'Attribute',
			width: 160,
			render: (val, rec) => {
				const attriRe = rec?.activities?.coCurricularActivityEquivalency?.filter(
					(item) => item?.rolesId === rec?.rolesId,
				);

				const attriDec = rec?.activitiesType?.attributes;

				if (rec?.activityCategory === EActivityCategory.REGISTERED) {
					return (
						<Space wrap>
							{attriRe?.map((item: any) => (
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
							))}
						</Space>
					);
				} else
					return (
						<Space wrap>
							{attriDec?.map((item: any) => (
								<Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>
							))}
						</Space>
					);
			},
			onCell,
		},
		{
			title: 'Competency',
			width: 220,
			render: (val, rec) => (
				<ExpandText>
					{(rec?.activityCategory === EActivityCategory.REGISTERED
						? rec?.activities?.competencyList
						: rec?.listAchievedCompetencies
					)
						?.map((item) => item?.competency?.name)
						.filter(Boolean)
						.join(', ')}
				</ExpandText>
			),
			onCell,
		},
		{
			title: 'Activity Type',
			width: 200,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? rec?.activities?.activitiesType?.name
					: rec?.activitiesType?.name,
			onCell,
		},
		{
			title: 'Submission Time',
			dataIndex: 'submittedAt',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: 'Evidence Review Time',
			dataIndex: 'approvalTime',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: 'Impact',
			dataIndex: 'validation',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.workflow === EApprovalStatus.APPROVED && <Tag color={mapEvalidation[val as Evalidation]}>{val}</Tag>,
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
			render: (val, rec) => {
				const now = dayjs();
				const endDateUpdateEvidence =
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED
						? rec?.dueDate
							? dayjs(rec?.dueDate)
							: null
						: rec?.activities?.allowPostEventResultsUpdate
							? rec?.activities?.dueDate
								? dayjs(rec?.activities?.dueDate)
								: null
							: rec?.activities?.endDate
								? dayjs(rec?.activities?.endDate)
								: null;

				const editableWorkflow =
					rec?.workflow === EApprovalStatus.DRAFT ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
					rec?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

				const isExpired = editableWorkflow && now.isAfter(endDateUpdateEvidence);

				if (isExpired) {
					return (
						<Tag
							color={officialColors.official500}
							style={{
								color: officialColors.official300,
								fontWeight: 600,
							}}
						>
							Expired
						</Tag>
					);
				}
				return (
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
				);
			},
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

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</>
	);
};

export default ListEvidenceActivity;
