import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivity = () => {
	const intl = useIntl();
	const { loadingThongKe, dataThongKe, getAnalyticsActivityModel } = useModel('cct.activity');

	useEffect(() => {
		getAnalyticsActivityModel();
	}, []);

	const statisticsData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.stat.total' }),
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#1677ff',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.upcoming' }),
			value: inputFormat(dataThongKe?.upcoming ?? 0),
			valueColor: '#faad14',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.ongoing' }),
			value: inputFormat(dataThongKe?.ongoing ?? 0),
			valueColor: '#52c41a',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.completed' }),
			value: inputFormat(dataThongKe?.completed ?? 0),
			valueColor: '#8c8c8c',
		},
	];

	return (
		<>
			<StatisticsCard
				data={statisticsData}
				loading={loadingThongKe}
				hideCard={true}
				colSpan={{ xs: 24, md: 6 }}
				rowGutter={8}
				containerStyle={{ marginBottom: 12 }}
				title=''
			/>
		</>
	);
};

export default StatActivity;
