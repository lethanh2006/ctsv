import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, InputNumber, Radio } from 'antd';
import { useEffect, useState } from 'react';

const FormTotNghiepVanBang = () => {
  const [typeUpload, setTypeUpload] = useState<'UPLOAD' | 'URL'>('URL');

  useEffect(() => {
    setTypeUpload('URL');
  }, []);

  return (
    <Form layout="vertical">
      <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
        Cập nhật
      </Button>

      <Divider orientation="center">Thông tin tốt nghiệp</Divider>
      <Row gutter={[12, 0]}>
        <Col span={24} md={6}>
          <Form.Item label="Thời gian tốt nghiệp">
            <MyDatePicker />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Loại tốt nghiệp">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Số quyết định tốt nghiệp">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Ngày ban hành QĐ">
            <MyDatePicker />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="center">Thông tin văn bằng</Divider>
      <Row gutter={[12, 0]}>
        <Col span={24} md={6}>
          <Form.Item label="Mã ngành">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Mã chương trình đào tạo">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Tên đơn vị bằng cấp">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Trình độ đào tạo">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={24} md={6}>
          <Form.Item label="Năm tốt nghiệp">
            <InputNumber style={{ width: '100%' }} min={2020} max={2300} />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Số QĐ công nhận tốt nghiệp">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Số QĐ thành lập hội đồng">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} md={6}>
          <Form.Item label="Ngày bảo vệ">
            <MyDatePicker />
          </Form.Item>
        </Col>

        <Col span={24} md={8}>
          <Form.Item label="Tên văn bằng">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Số hiệu văn bằng">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Ngày cấp">
            <MyDatePicker />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="url"
            label={
              <>
                Tệp đính kèm &nbsp;
                <Radio.Group onChange={(e) => setTypeUpload(e.target.value)} value={typeUpload}>
                  <Radio value={'URL'}>Đường dẫn</Radio>
                  <Radio value={'UPLOAD'}>Tải lên</Radio>
                </Radio.Group>
              </>
            }
            rules={[
              ...rules.required,
              ...(typeUpload === 'UPLOAD' ? rules.fileRequired : rules.httpLink),
            ]}
          >
            {typeUpload === 'UPLOAD' ? (
              <UploadFile
                maxCount={1}
                otherProps={{
                  accept: '.pdf',
                  showUploadList: { showDownloadIcon: false },
                }}
              />
            ) : (
              <Input placeholder="Nhập đường dẫn" />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormTotNghiepVanBang;
