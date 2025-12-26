import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivityOutCome = (props: { getData: () => void; dependency?: any }) => {
	const { getData, dependency } = props;
	const intl = useIntl();
	const { loadingThongKe, dataThongKe } = useModel('cct.activityoutcome');

	useEffect(() => {
		getData();
	}, [dependency]);

	const statisticsData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.stat.total' }),
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#1677ff',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.upcoming' }),
			value: inputFormat(dataThongKe?.pending ?? 0),
			valueColor: '#faad14',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.ongoing' }),
			value: inputFormat(dataThongKe?.processed ?? 0),
			valueColor: '#52c41a',
		},
	];

	return (
		<>
			<StatisticsCard
				data={statisticsData}
				loading={loadingThongKe}
				hideCard={true}
				colSpan={{ xs: 24, md: 8 }}
				rowGutter={8}
				containerStyle={{ marginBottom: 12 }}
				title=''
			/>
		</>
	);
};

export default StatActivityOutCome;
