import { type ThongBao } from '@/services/ThongBao/typing';
import { Card, Tabs } from 'antd';
import { useState } from 'react';
import DetailThongBao from './Detail';
import TableReceiverThongBao from './TableReceiver';
import './style.less';

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void }) => {
	const { record, afterViewDetail } = props;
	const [tabActive, setTabActive] = useState('1');

	return (
		<Card title={record?.title} bodyStyle={{ paddingTop: 5 }}>
			<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab)}>
				<Tabs.TabPane key='1' tab='Nội dung thông báo' />
				<Tabs.TabPane key='2' tab='Danh sách người nhận' />
			</Tabs>

			{tabActive === '1' ? (
				<DetailThongBao record={record} afterViewDetail={afterViewDetail} />
			) : tabActive === '2' ? (
				<TableReceiverThongBao record={record} />
			) : null}
		</Card>
	);
};

export default ViewThongBao;
