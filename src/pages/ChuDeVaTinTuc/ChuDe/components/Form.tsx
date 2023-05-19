/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useState } from 'react';
import { useAccess, useModel } from 'umi';

const FormChuDe = () => {
  const [form] = Form.useForm();
  const access = useAccess();
  const { loading, record, setVisibleForm, edit, putChuDeModel, addChuDeModel } = useModel('chude');
  const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const [phamVi, setPhamVi] = useState<string>(record?.phamVi ?? '');
  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: ChuDe.Record) => {
          if (edit) putChuDeModel({ id: record._id, data: values });
          else addChuDeModel({ ...values, type: 'Tin tức' });
        }}
        form={form}
      >
        <Row gutter={[12, 0]}>
          <Col xs={24}>
            <Form.Item
              name="name"
              label="Tên chủ đề"
              rules={[...rules.required, ...rules.text, ...rules.length(30)]}
              initialValue={record?.name}
            >
              <Input placeholder="Tên chủ đề" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            {(access.admin || access.nhanVien) && (
              <>
                <Form.Item
                  initialValue={record?.phamVi}
                  rules={[...rules.required]}
                  name="phamVi"
                  label="Phạm vi"
                >
                  <Select onChange={(val: string) => setPhamVi(val)} placeholder="Phạm vi">
                    {['Tất cả', 'Hình thức đào tạo'].map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {phamVi === 'Hình thức đào tạo' && (
                  <Form.Item
                    initialValue={record?.hinhThucDaoTaoId}
                    rules={[...rules.required]}
                    name="hinhThucDaoTaoId"
                    label="Hình thức đào tạo"
                  >
                    <Select placeholder="Hình thức đào tạo">
                      {danhSachHinhThucDaoTao?.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.ten_hinh_thuc_dao_tao}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </>
            )}
          </Col>
          {/* <Col xs={24} lg={12}>
            <Form.Item
              name="type"
              label="Loại chủ đề"
              rules={[...rules.required]}
              initialValue={record?.type}
            >
              <Select placeholder="Chọn loại chủ đề">
                {danhSachLoaiChuDe.map((item: string) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="order"
              label="Thứ tự hiển thị"
              rules={[...rules.required]}
              initialValue={record?.order ?? 0}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={1000}
                placeholder="Thứ tự hiển thị"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormChuDe;
