import { type ThongBao } from '@/services/ThongBao/typing';
import { Card } from 'antd';
import DetailThongBao from './Detail';
import './style.less';

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void }) => {
	const { record, afterViewDetail } = props;

	return (
		<Card title={record?.title} bodyStyle={{ paddingTop: 5 }}>
			{/* <Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab)}>
				<Tabs.TabPane key='1' tab='Nội dung thông báo' />
				<Tabs.TabPane key='2' tab='Danh sách người nhận' />
			</Tabs>

			{tabActive === '1' ? ( */}
			<DetailThongBao record={record} afterViewDetail={afterViewDetail} />
			{/* ) : tabActive === '2' ? (
				<TableReceiverThongBao record={record} />
			) : null} */}
		</Card>
	);
};

export default ViewThongBao;
