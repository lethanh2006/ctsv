import { Button, Card, Modal, Tabs } from 'antd';
import ViewChiTiet from './ViewChiTiet';
import SinhVienLopHanhChinh from '../../SvLopHanhChinh';
import { useIntl, useModel } from 'umi';
import { useEffect } from 'react';

const ModalChiTiet = (props: { visible: boolean; setVisible: any }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { setCondition } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record } = useModel('daotaov2.namhoc.lophanhchinh');

	useEffect(() => {
		setCondition({ lopHanhChinhId: record?._id });
	}, [record?._id]);

	return (
		<Modal
			footer={<Button onClick={() => setVisible(false)}>Đóng</Button>}
			styles={{ padding: 0 }}
			width={800}
			open={visible}
			onCancel={() => setVisible(false)}
		>
			<Card bordered={false}>
				<Tabs>
					<Tabs.TabPane tab={intl.formatMessage({ id: 'namhoc.lophanhchinh.tab1' })} key={0}>
						<ViewChiTiet setVisible={setVisible} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={intl.formatMessage({ id: 'namhoc.lophanhchinh.tab2' })} key={1}>
						<SinhVienLopHanhChinh hideCard />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</Modal>
	);
};

export default ModalChiTiet;
