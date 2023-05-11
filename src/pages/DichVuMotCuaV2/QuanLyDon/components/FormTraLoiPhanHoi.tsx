/* eslint-disable no-param-reassign */
import type { PhanHoi } from '@/services/PhanHoi/typing';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormTraLoiPhanHoi = (props: { getData: any }) => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, traLoiPhanHoiDvmcModel } = useModel('phanhoi');

  const { recordDon } = useModel('dichvumotcuav2');
  return (
    <Card loading={loading} title="Trả lời phản hồi">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: PhanHoi.IRecord) => {
          traLoiPhanHoiDvmcModel(recordDon?._id ?? '', values, props.getData);
        }}
        form={form}
      >
        <p>Nội dung phản hồi: {recordDon?.noiDungPhanHoi}</p>
        {recordDon?.daTraLoiPhanHoi ? (
          <p>Nội dung trả lời: {recordDon?.noiDungTraLoiPhanHoi}</p>
        ) : (
          <Form.Item
            name="noiDungTraLoiPhanHoi"
            label="Nội dung trả lời"
            initialValue={recordDon?.noiDungTraLoiPhanHoi}
            rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung" />
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!recordDon?.daTraLoiPhanHoi && (
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

export default FormTraLoiPhanHoi;
