import rules from '@/utils/rules';
import { Col, Form, Row, Select } from 'antd';

const NumericRange = (props: { index: number }) => {
  return (
    <Row gutter={[12, 0]}>
      <Col span={12}>
        <Form.Item
          name={[props.index, 'gioiHanDuoiTuyenTinh']}
          rules={[...rules.required]}
          label="Từ"
        >
          <Select>
            {[0, 1].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="đến"
          rules={[...rules.required]}
          name={[props.index, 'gioiHanTrenTuyenTinh']}
        >
          <Select>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default NumericRange;
