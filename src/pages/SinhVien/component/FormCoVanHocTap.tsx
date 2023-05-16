import MyDatePicker from '@/components/MyDatePicker';
import { Col, Divider, Form, Input, Row } from 'antd';

const FormCoVanHocTap = () => {
  return (
    <Form layout="vertical">
      <Divider orientation="center">Thông tin cố vấn học tập</Divider>
      <Row gutter={[12, 0]}>
        <Col span={24} md={8}>
          <Form.Item label="Cố vấn">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Điện thoại">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Email">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Địa chỉ">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Từ ngày">
            <MyDatePicker disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Đến ngày">
            <MyDatePicker disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormCoVanHocTap;
