import MyDatePicker from '@/components/MyDatePicker';
import TableDiemHocPhan from '@/pages/KetQuaHocTap/DiemHocPhan/components/TableDiemHocPhan';
import { Col, Collapse, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import HocBongSinhVienPage from '../HocBongSinhVien';
import HocTapSinhVienHienTaiPage from '../HocTapSinhVienHienTai';

const FormQuaTrinhHocTap = () => {
  const { record } = useModel('sinhvien.sinhvien');

  return (
    <Form layout="vertical">
      <Collapse>
        <Collapse.Panel header="Thông tin tuyển sinh đầu vào" key={'1'}>
          <Row gutter={[12, 0]}>
            <Col span={24} md={12}>
              <Form.Item label="Đối tượng đầu vào">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Kết quả tuyển sinh">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item label="Ngày nhập học">
                <MyDatePicker disabled />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item label="Số quyết định trúng tuyển">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item label="Ngày ký quyết định trúng tuyển">
                <MyDatePicker disabled />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>

        <Collapse.Panel header="Thông tin học tập hiện tại" key={'2'}>
          <HocTapSinhVienHienTaiPage sinhVienSsoId={record?.ssoId} />
        </Collapse.Panel>

        <Collapse.Panel header="Học bổng" key={'3'}>
          <HocBongSinhVienPage />
        </Collapse.Panel>

        <Collapse.Panel header="Kết quả học tập" key={'4'}>
          <TableDiemHocPhan sinhVienSsoId={record?.ssoId ?? ''} />
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
};

export default FormQuaTrinhHocTap;
