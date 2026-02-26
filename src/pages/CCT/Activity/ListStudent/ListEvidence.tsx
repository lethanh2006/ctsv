import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory } from '@/services/CCT/constant';
import { FileOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useIntl, useModel } from 'umi';

const ListEvidenceActivity = () => {
	const intl = useIntl();
	const { record: recActivity, setVisibleForm } = useModel('cct.activity');
	const { getModel, page, limit } = useModel('cct.activityoutcome');

	const getData = () => {
		if (recActivity?._id)
			getModel({
				activitiesId: recActivity?._id,
				activityCategory: EActivityCategory.REGISTERED,
			});
	};

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.column.sv.name' }),
			dataIndex: 'name',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.column.sv.email' }),
			dataIndex: 'email',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'List Evidence',
			width: 220,
			render: (val, rec) =>
				rec?.evidenceFile?.length ? (
					rec.evidenceFile.map((item: any, index: number) => (
						<span key={index}>
							<Typography.Link href={item.file} target='_blank' rel='noopener noreferrer'>
								<FileOutlined style={{ marginRight: 4 }} />
								{item.name}
							</Typography.Link>
							{index < rec.evidenceFile.length - 1 && ', '}
						</span>
					))
				) : (
					<i className='text-warning'>No info</i>
				),
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
