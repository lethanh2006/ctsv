import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';

const StatMyCTT = (props: { loadingThongKe: boolean; dataThongKe: MyCCT.IAnalyticsMyCCT }) => {
	const { loadingThongKe, dataThongKe } = props;

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#1677ff',
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			valueColor: '#52c41a',
		},
		{
			title: 'Changed Required',
			value: inputFormat(dataThongKe?.changeRequired ?? 0),
			valueColor: '#fa8c16',
		},
		{
			title: 'Pending Approval',
			value: inputFormat(dataThongKe?.pending ?? 0),
			valueColor: '#faad14',
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingThongKe}
			hideCard={true}
			colSpan={{ xs: 24, md: 6 }}
			rowGutter={8}
			containerStyle={{ marginBottom: 12 }}
			title=''
		/>
	);
};

export default StatMyCTT;
