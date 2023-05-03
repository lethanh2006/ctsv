import { Button, Card, Modal, Tabs } from 'antd';
import ViewChiTiet from './ViewChiTiet';
import { useModel } from 'umi';
import { useEffect } from 'react';
import HocPhanCTDT from '../HocPhanCTDT';
import HocKyCTDT from '../HocKyCTDT';

const ModalChiTietCTDT = (props: { visible: boolean; setVisible: any }) => {
  const { visible, setVisible } = props;
  const { setCondition: setCondHocPhan } = useModel('chuongtrinhdaotao.hocphanctdt');
  const { setCondition: setCondHocKy } = useModel('chuongtrinhdaotao.hockyctdt');
  const { record } = useModel('chuongtrinhdaotao.chuongtrinh');

  useEffect(() => {
    setCondHocPhan({ chuongTrinhId: record?._id });
    setCondHocKy({ chuongTrinhId: record?._id });
  }, [record?._id]);

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
          <Tabs.TabPane tab="Chi tiết" key={0}>
            <ViewChiTiet setVisible={setVisible} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Học phần CTĐT" key={1}>
            <HocPhanCTDT hideCard />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Học kỳ CTĐT" key={2}>
            <HocKyCTDT hideCard />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Modal>
  );
};

export default ModalChiTietCTDT;
