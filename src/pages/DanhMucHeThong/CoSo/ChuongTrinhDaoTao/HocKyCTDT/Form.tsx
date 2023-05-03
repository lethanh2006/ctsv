import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectChuongTrinh from '../../ChuongTrinhDaoTao/components/Select';

const FormHocKyCTDT = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
    'chuongtrinhdaotao.hockyctdt',
  );
  const { record: recCTDT } = useModel('chuongtrinhdaotao.chuongtrinh');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  if (recCTDT?._id) form.setFieldsValue({ chuongTrinhId: recCTDT._id });

  const onFinish = async (values: ChuongTrinhDaoTao.IRecordHocKyCTDT) => {
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
              name="chuongTrinhId"
              label="Chương trình đào tạo"
              rules={[...rules.required]}
            >
              <SelectChuongTrinh disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="soThuTuKy"
              label="Số thứ tự kỳ"
              rules={[...rules.required, ...rules.number(30, 1)]}
            >
              <InputNumber
                min={1}
                max={30}
                placeholder="Nhập số thứ tự kỳ"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="soTinChiTuChonPhaiHoc"
              label="Số tín chỉ tự chọn phải học"
              rules={[...rules.required, ...rules.number(100, 1)]}
            >
              <InputNumber
                min={1}
                max={100}
                placeholder="Nhập số tín chỉ"
                style={{ width: '100%' }}
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

export default FormHocKyCTDT;
