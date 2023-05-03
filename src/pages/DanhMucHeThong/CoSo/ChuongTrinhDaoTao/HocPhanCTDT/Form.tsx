import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectHocPhan from '../../HocPhan/components/SelectHocPhan';

const FormHocPhanCTDT = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
    'chuongtrinhdaotao.hocphanctdt',
  );
  const { record: recKhoi } = useModel('chuongtrinhdaotao.khoihocphanctdt');
  const { title } = props;

  const getData = () => getModel({ khoiHpCtId: recKhoi?._id });

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: ChuongTrinhDaoTao.IHocPhanTuChonCTDT) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel({ ...values, khoiHpCtId: recKhoi?._id ?? '' }, getData)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col xs={24}>
            <Form.Item name="hocPhanId" label="Học phần" rules={[...rules.required]}>
              <SelectHocPhan />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="hocPhanTienQuyetId" label="Học phần tiên quyết">
              <SelectHocPhan allowClear loadData={false} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="hocPhanTruocId" label="Học phần trước">
              <SelectHocPhan allowClear loadData={false} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="hocPhanSongHanhId" label="Học phần song hành">
              <SelectHocPhan allowClear loadData={false} />
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

export default FormHocPhanCTDT;
