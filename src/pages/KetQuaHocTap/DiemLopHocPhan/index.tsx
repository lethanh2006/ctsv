import { Col, Row } from 'antd';
import CardLopHocPhan from './components/CardLopHocPhan';
import CardDiemLopHocPhan from './components/CardDiemLopHocPhan';

const DiemLopHocPhanPage = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24} md={8}>
        <CardLopHocPhan />
      </Col>

      <Col span={24} md={16}>
        <CardDiemLopHocPhan />
      </Col>
    </Row>
  );
};

export default DiemLopHocPhanPage;
