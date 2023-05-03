import rules from '@/utils/rules';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectHinhThuc from '../../HinhThuc/components/Select';

const FormNhomTietHoc = (props: { afterAddNew?: (rec: NhomTietHoc.IRecordCoSo) => void }) => {
  const [form] = Form.useForm();
  const { afterAddNew } = props;
  const {
    record,
    setRecord,
    setVisibleForm,
    edit,
    setEdit,
    postModel,
    putModel,
    getModel,
    formSubmiting,
  } = useModel('danhmuc.nhomtiethoc');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: NhomTietHoc.IRecordCoSo) => {
    if (edit) {
      putModel(record?._id ?? '', values, getModel, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else {
      const finalValues = { ...values, active: true };
      postModel(finalValues, getModel, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          if (afterAddNew) afterAddNew(rec);
        })
        .catch((er) => console.log(er));
    }
  };

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
        <Col xs={24}>
          <Form.Item name="hinhThucDaoTaoId" label="Hình thức đào tạo" rules={[...rules.required]}>
            <SelectHinhThuc />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="ma"
            label="Mã nhóm tiết học"
            rules={[...rules.required, ...rules.text, ...rules.length(20)]}
          >
            <Input placeholder="Nhập mã nhóm tiết học" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="ten"
            label="Tên nhóm tiết học"
            rules={[...rules.required, ...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
        <Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType="submit" type="primary">
          {!edit ? 'Thêm mới ' : 'Lưu lại'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </Form.Item>
    </Form>
  );
};

export default FormNhomTietHoc;
