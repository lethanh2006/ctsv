import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';

const FormKyLuat = () => {
  const [form] = Form.useForm();

  const {
    record,
    setVisibleForm,
    edit,
    postModel,
    putModel,
    getModel,
    formSubmiting,
    setRecord,
    setEdit,
  } = useModel('sinhvien.kyluat');

  const { record: hoSoSinhVien } = useModel('sinhvien.sinhvien');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const getData = () =>
    getModel(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      `page/sso-id/${hoSoSinhVien?.ssoId}`,
    );

  const onFinish = async (values: any) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel({ ...values, sinhVienSsoId: hoSoSinhVien?.ssoId }, getData, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          setVisibleForm(false);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Form.Item name="namBiKyLuat" label="Năm bị kỷ luật" rules={[...rules.required]}>
              <InputNumber
                min={2000}
                max={new Date().getFullYear()}
                style={{ width: '100%' }}
                placeholder="Năm bị kỷ luật"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="soQuyetDinh" label="Số quyết định" rules={[...rules.required]}>
              <Input placeholder="Số quyết định" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="capQuyetDinh" label="Cấp quyết định" rules={[...rules.required]}>
              <Input placeholder="Cấp quyết định" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="ngayQuyetDinh" label="Ngày quyết định" rules={[...rules.required]}>
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="lyDo" label="Lý do" rules={[...rules.required]}>
              <Input placeholder="Lý do" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="loaiKyLuat" label="Loại kỷ luật" rules={[...rules.required]}>
              <Select
                placeholder="Chọn loại"
                options={['Khiển trách', 'Cảnh cáo', 'Đình chỉ học tập', 'Buộc thôi học'].map(
                  (item) => ({
                    value: item,
                    label: item,
                  }),
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới ' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormKyLuat;
