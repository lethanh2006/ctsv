/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormPhanHoi = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, traLoiPhanHoiModel, setRecord } = useModel('phanhoi');

  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState || {};
  console.log(currentUser, 'current user');
  return (
    <Card loading={loading} title="Trả lời phản hồi">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: PhanHoi.IRecord) => {
          traLoiPhanHoiModel({
            id: record?._id ?? '',
            data: {
              noiDungTraLoiPhanHoi: values.noiDungTraLoiPhanHoi,
              maChuyenVien: currentUser?.username,
              noiDungPhanHoi: record?.noiDungPhanHoi ?? '',
            },
          });
          setRecord({} as PhanHoi.IRecord);
        }}
        form={form}
      >
        <p>Nội dung phản hồi: {record?.noiDungPhanHoi}</p>
        {record?.daTraLoiPhanHoi ? (
          <p>Nội dung trả lời: {record?.noiDungTraLoiPhanHoi}</p>
        ) : (
          <Form.Item
            name="noiDungTraLoiPhanHoi"
            label="Nội dung trả lời"
            initialValue={record?.noiDungTraLoiPhanHoi}
            rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung" />
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!record?.daTraLoiPhanHoi && (
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Gửi
            </Button>
          )}
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormPhanHoi;
