import { Button, Card, Modal, Tabs } from 'antd';
import SinhVienLopHanhChinh from '../SvLopHanhChinh';
import ViewChiTiet from './ViewChiTiet';

const ModalChiTiet = (props: { visible: boolean; setVisible: any }) => {
	const { visible, setVisible } = props;

	return (
		<Modal
			footer={<Button onClick={() => setVisible(false)}>Đóng</Button>}
			bodyStyle={{ padding: 0 }}
			width={800}
			visible={visible}
			onCancel={() => setVisible(false)}
		>
			<Card bordered={false}>
				<Tabs>
					<Tabs.TabPane tab='Chi tiết' key={0}>
						<ViewChiTiet setVisible={setVisible} />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Danh sách sinh viên' key={1}>
						<SinhVienLopHanhChinh hideCard />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</Modal>
	);
};

export default ModalChiTiet;
