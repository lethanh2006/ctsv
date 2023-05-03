import SelectLoaiCanhCao from '@/pages/DanhMucHeThong/LoaiCanhCaoHocTap/components/Select';
import SelectHocKy from '@/pages/HocKy/HocKy/components/SelectHocKy';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCanhCaoHocTap = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('ketquahoctap.canhcao');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: CanhCaoHocTap.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values, getModel)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getModel)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Form.Item name="sinhVienSsoId" label="Sinh viên" rules={[...rules.required]}>
              <SelectSinhVienDebounce />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="hocKyId" label="Học kỳ" rules={[...rules.required]}>
              <SelectHocKy />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="loaiCanhCaoId" label="Loại cảnh cáo" rules={[...rules.required]}>
              <SelectLoaiCanhCao />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="ghiChu" label="Ghi chú" rules={[...rules.text, ...rules.length(500)]}>
              <Input.TextArea placeholder="Ghi chú" />
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

export default FormCanhCaoHocTap;
