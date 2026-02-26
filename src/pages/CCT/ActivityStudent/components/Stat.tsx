import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatActivityOutCome = (props: {
	getData: () => void;
	dependency?: any;
	setTabActive?: (tab: string) => void;
}) => {
	const { getData, dependency, setTabActive } = props;
	// const intl = useIntl();
	const { loadingThongKe, dataThongKe } = useModel('cct.activityoutcome');

	useEffect(() => {
		getData();
	}, [dependency]);

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#1677ff',
		},
		{
			title: 'Pending',
			value: inputFormat(dataThongKe?.pending ?? 0),
			valueColor: '#faad14',
			onClick: () => setTabActive && setTabActive('1'),
		},
		{
			title: 'Processed',
			value: inputFormat(dataThongKe?.processed ?? 0),
			valueColor: '#52c41a',
			onClick: () => setTabActive && setTabActive('2'),
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingThongKe}
			hideCard={true}
			colSpan={{ xs: 24, md: 8 }}
			rowGutter={8}
			containerStyle={{ marginBottom: 12 }}
			title=''
		/>
	);
};

export default StatActivityOutCome;
