import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormPhanHoi = () => {
  const { loading, record, setVisibleForm, traLoiPhanHoiModel } = useModel('tienich.phanhoi');
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const onFinish = async (values: PhanHoi.IRecord) => {
    traLoiPhanHoiModel({
      id: record?._id ?? '',
      data: {
        noiDungTraLoiPhanHoi: values.noiDungTraLoiPhanHoi,
        maChuyenVien: currentUser?.username ?? '',
        noiDungPhanHoi: record?.noiDungPhanHoi ?? '',
      },
    });
  };

  return (
    <Card loading={loading} title="Trả lời phản hồi">
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <p>Câu hỏi: {record?.noiDungPhanHoi}</p>
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

        <div className="form-footer">
          {!record?.daTraLoiPhanHoi && (
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Gửi
            </Button>
          )}
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormPhanHoi;
