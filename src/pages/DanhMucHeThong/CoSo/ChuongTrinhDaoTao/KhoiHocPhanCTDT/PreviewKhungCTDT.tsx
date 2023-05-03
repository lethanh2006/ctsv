import { PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Select, Space } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';
import TableDanhSachHocPhan from './TableDanhSachHocPhan';
import { useState } from 'react';

const PreviewKhungCTDT = (props: { visble: boolean; setVisible: (vis: boolean) => void }) => {
  const { visble, setVisible } = props;
  const { danhSach } = useModel('chuongtrinhdaotao.khoihocphanctdt');
  const [selectChuyenNganh, setSelectChuyenNganh] = useState<string>();
  const listHocKy = _.uniq(
    danhSach
      .filter(
        (item) =>
          !selectChuyenNganh || !item.chuyenNganhId || selectChuyenNganh === item.chuyenNganhId,
      )
      .map((item) => item.soThuTuKy),
  );
  const emptyHocKy = danhSach
    .filter(
      (item) =>
        !selectChuyenNganh || !item.chuyenNganhId || selectChuyenNganh === item.chuyenNganhId,
    )
    .find((item) => !item.soThuTuKy);
  const listChuyenNganh = _.uniqBy(
    danhSach.filter((item) => item.chuyenNganhId),
    (item) => item.chuyenNganhId,
  );

  return (
    <Modal
      title="Khung chương trình đào tạo"
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
              In khung chương trình
            </Button>
          </Space>
        </Col>

        {listHocKy.map((hk) => (
          <Col span={24} key={hk}>
            <div className="fw500" style={{ fontSize: 16 }}>
              Học kỳ {hk}
            </div>
            <TableDanhSachHocPhan hocKy={hk} chuyenNganh={selectChuyenNganh} />
          </Col>
        ))}

        {emptyHocKy ? (
          <Col span={24} key={-1}>
            <div className="fw500" style={{ fontSize: 16 }}>
              Khối tự chọn khác
            </div>
            <TableDanhSachHocPhan hocKy={-1} chuyenNganh={selectChuyenNganh} />
          </Col>
        ) : null}
      </Row>
    </Modal>
  );
};

export default PreviewKhungCTDT;
