import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row, InputNumber, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';
import moment from 'moment';

const FormTietHoc = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('danhmuc.tiethoc');
  const { record: recNhomTietHoc } = useModel('danhmuc.nhomtiethoc');
  const { title } = props;

  const getData = () => getModel({ nhomTietHocId: recNhomTietHoc?._id });

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: any) => {
    if (moment(values.timeKetThuc).diff(moment(values.timeBatDau), 'minutes') <= 0) {
      message.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
      return;
    }
    if (edit) {
      putModel(record?._id ?? '', values, getData)
        .then()
        .catch((er) => console.log(er));
    } else {
      const valuesFinal = { ...values, nhomTietHocId: recNhomTietHoc?._id };
      postModel(valuesFinal, getData)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
    }
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col xs={24}>
            <Form.Item
              name="tietHoc"
              label="Tiết học"
              rules={[...rules.required, ...rules.number(30, 1)]}
            >
              <InputNumber min={1} max={30} placeholder="Nhập tiết học" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="timeBatDau" label="Thời gian bắt đầu" rules={[...rules.required]}>
              <MyDatePicker
                pickerStyle="time"
                format="HH:mm"
                placeholder="Chọn thời gian bắt đầu"
                minuteStep={10}
                saveFormat="HH:mm"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="timeKetThuc" label="Thời gian kết thúc" rules={[...rules.required]}>
              <MyDatePicker
                pickerStyle="time"
                placeholder="Chọn thời gian kết thúc"
                format="HH:mm"
                minuteStep={10}
                saveFormat="HH:mm"
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

export default FormTietHoc;
