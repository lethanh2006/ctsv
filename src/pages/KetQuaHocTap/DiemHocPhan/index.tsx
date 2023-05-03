import { Col, Row } from 'antd';
import CardLopHanhChinh from './components/CardLopHanhChinh';
import CardDiemHocPhan from './components/CardDiemHocPhan';

const DiemLopHocPhanPage = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24} md={8}>
        <CardLopHanhChinh />
      </Col>

      <Col span={24} md={16}>
        <CardDiemHocPhan />
      </Col>
    </Row>
  );
};

export default DiemLopHocPhanPage;
