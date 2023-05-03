import SelectTrinhDo from '@/pages/DanhMucHeThong/Bo/TrinhDo/components/SelectTrinhDo';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTrinhDo = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('danhmuc.trinhdo');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: TrinhDoDaoTao.IRecordCoSo) => {
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
          <Col xs={24}>
            <Form.Item
              name="dmTrinhDoId"
              label="Trình độ đào tạo của bộ"
              rules={[...rules.required]}
            >
              <SelectTrinhDo
                onChange={(values: string[], options: any) =>
                  form.setFieldsValue({ ma: options.label.split('(').pop().split(')').shift() })
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="ma"
              label="Mã nội bộ"
              rules={[...rules.required, ...rules.text, ...rules.length(20)]}
            >
              <Input placeholder="Nhập mã nội bộ" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="canCuId" label="Căn cứ pháp lý">
              <SelectVanBanQuyDinh hasDefault={!edit} />
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

export default FormTrinhDo;
