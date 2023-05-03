import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectHocLieu from '../../HocLieu/components/Select';

const FormHocLieuDeCuong = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('hocphan.hoclieudecuong');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const getData = () => getModel({ deCuongId: recDeCuong?._id });

  const onFinish = async (values: HocPhan.IHocLieuDeCuong) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData)
        .then()
        .catch((er) => console.log(er));
    } else {
      postModel({ ...values, deCuongId: recDeCuong?._id ?? '' }, getData)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
    }
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col xs={24}>
            <Form.Item name="hocLieuId" label="Học liệu" rules={[...rules.required]}>
              <SelectHocLieu />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="batBuoc" label="Là học liệu bắt buộc" valuePropName="checked">
              <Switch />
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

export default FormHocLieuDeCuong;
