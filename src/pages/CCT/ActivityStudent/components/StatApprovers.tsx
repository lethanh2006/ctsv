import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivityApprovers = (props: { getData: () => void; dependency?: any }) => {
	const { getData, dependency } = props;
	const intl = useIntl();
	const { loadingThongKeApprovers, dataThongKeApprovers } = useModel('cct.activityoutcome');

	useEffect(() => {
		getData();
	}, [dependency]);

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKeApprovers?.total ?? 0),
			valueColor: '#1677ff',
		},
		{
			title: 'Pending',
			value: inputFormat(dataThongKeApprovers?.pending ?? 0),
			valueColor: '#faad14',
		},
		{
			title: 'Processed',
			value: inputFormat(dataThongKeApprovers?.processed ?? 0),
			valueColor: '#52c41a',
		},
		{
			title: 'Unassigned',
			value: inputFormat(dataThongKeApprovers?.unassigned ?? 0),
			valueColor: '#c41a1a',
		},
	];

	return (
		<>
			<StatisticsCard
				data={statisticsData}
				loading={loadingThongKeApprovers}
				hideCard={true}
				colSpan={{ xs: 24, md: 6 }}
				rowGutter={8}
				containerStyle={{ marginBottom: 12 }}
				title=''
			/>
		</>
	);
};

export default StatActivityApprovers;
