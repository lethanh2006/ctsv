import { PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Select, Space } from 'antd';
import TableDanhSachHocPhan from './TableDanhSachHocPhan';
import { useState } from 'react';
import _ from 'lodash';
import { useModel } from 'umi';

const PreviewDanhSachHocPhan = (props: { visble: boolean; setVisible: (vis: boolean) => void }) => {
  const { visble, setVisible } = props;
  const { danhSach } = useModel('chuongtrinhdaotao.khoihocphanctdt');
  const [selectChuyenNganh, setSelectChuyenNganh] = useState<string>();
  const listChuyenNganh = _.uniqBy(
    danhSach.filter((item) => item.chuyenNganhId),
    (item) => item.chuyenNganhId,
  );

  return (
    <Modal
      title="Danh sách học phần thuộc CTĐT"
      visible={visble}
      onCancel={() => setVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={800}
    >
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space>
            <Select
              style={{ width: '250px' }}
              placeholder="Xem theo chuyên ngành"
              options={listChuyenNganh.map((item) => ({
                key: item.chuyenNganhId,
                value: item.chuyenNganhId,
                label: item.chuyenNganh?.ten,
              }))}
              value={selectChuyenNganh}
              onChange={(val) => setSelectChuyenNganh(val)}
              allowClear
            />

            <Button icon={<PrinterOutlined />} type="primary">
              In danh sách
            </Button>
          </Space>
        </Col>

        <Col span={24}>
          <TableDanhSachHocPhan chuyenNganh={selectChuyenNganh} />
        </Col>
      </Row>
    </Modal>
  );
};

export default PreviewDanhSachHocPhan;
