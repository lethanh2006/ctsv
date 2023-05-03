import { Button, Card, Modal, Tabs } from 'antd';
import ViewChiTiet from './ViewChiTiet';
import TietHoc from '../../TietHoc';
import { useModel } from 'umi';
import { useEffect } from 'react';

const ModalChiTietNhomTietHoc = (props: { visible: boolean; setVisible: any }) => {
  const { visible, setVisible } = props;
  const { setCondition } = useModel('danhmuc.tiethoc');
  const { record } = useModel('danhmuc.nhomtiethoc');

  useEffect(() => {
    setCondition({ nhomTietHocId: record?._id });
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
          <Tabs.TabPane tab="Danh sách tiết học" key={1}>
            <TietHoc hideCard />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Modal>
  );
};

export default ModalChiTietNhomTietHoc;
