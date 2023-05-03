import MyDatePicker from '@/components/MyDatePicker';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormPhienBan = (props: { afterAddNew: (rec: ChuongTrinhDaoTao.IPhienBanCTDT) => void }) => {
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
  } = useModel('chuongtrinhdaotao.phienbanctdt');
  const { record: recChuongTrinh } = useModel('chuongtrinhdaotao.chuongtrinh');

  const getData = () => getModel({ chuongTrinhId: recChuongTrinh?._id });

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: ChuongTrinhDaoTao.IPhienBanCTDT) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else {
      const payload = { ...values, chuongTrinhId: recChuongTrinh?._id ?? '', active: false };
      postModel(payload, getData, false)
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
        <Col span={24} md={12}>
          <Form.Item
            name="ma"
            label="Phiên bản"
            rules={[...rules.required, ...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Phiên bản" />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="canCuId" label="Căn cứ pháp lý">
            <SelectVanBanQuyDinh hasDefault={!edit} />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="ngayBanHanh" label="Ngày ban hành">
            <MyDatePicker placeholder="Ngày ban hành" />
          </Form.Item>
        </Col>
      </Row>

      <div className="form-footer">
        <Button loading={formSubmiting} htmlType="submit" type="primary">
          {!edit ? 'Thêm mới & Tiếp tục' : 'Lưu lại'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Form>
  );
};

export default FormPhienBan;
