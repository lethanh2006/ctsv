import SelectHinhThuc from '@/pages/DanhMucHeThong/Bo/HinhThuc/components/SelectHinhThuc';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTrinhDo = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('danhmuc.hinhthucdaotao');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: HinhThucDaoTao.IRecordCoSo) => {
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
              name="danhMucHTDTId"
              label="Danh mục hình thức đào tạo của bộ"
              rules={[...rules.required]}
            >
              <SelectHinhThuc
                onChange={(values: string[], options: any) =>
                  form.setFieldsValue({ ten: options.label.split('(').shift() })
                }
              />
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
