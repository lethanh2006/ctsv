import { Col, Row } from 'antd';
import CardLopHanhChinh from '../DiemHocPhan/components/CardLopHanhChinh';
import CardKetQuaHocKy from './components/CardKetQuaHocKy';

const DiemLopHocPhanPage = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24} md={8}>
        <CardLopHanhChinh />
      </Col>

      <Col span={24} md={16}>
        <CardKetQuaHocKy />
      </Col>
    </Row>
  );
};

export default DiemLopHocPhanPage;
