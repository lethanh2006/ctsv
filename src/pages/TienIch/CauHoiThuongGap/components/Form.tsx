import TinyEditor from '@/components/TinyEditor';
import { ELoaiPhanHoi } from '@/services/PhanHoi/constant';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormCauHoiThuongGap = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, postModel, putModel, getModel, edit } =
    useModel('cauhoithuonggap');

  const getData = () => {
    getModel(undefined, undefined, undefined, undefined, undefined, 'page');
  };

  return (
    <Card loading={loading} title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (edit) {
            putModel(
              record?._id ?? '',
              {
                ...values,
                loaiCauHoi: ELoaiPhanHoi.DVMC,
              },
              getData,
              false,
              true,
            );
          } else postModel({ ...values, loaiCauHoi: ELoaiPhanHoi.DVMC }, getData, true);
        }}
        form={form}
      >
        <Form.Item
          name="cauHoi"
          label="Câu hỏi"
          initialValue={record?.cauHoi}
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung" />
        </Form.Item>
        <Form.Item
          name="cauTraLoi"
          label="Câu trả lời"
          initialValue={record?.cauTraLoi}
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
        >
          <TinyEditor height={350} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Lưu
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormCauHoiThuongGap;
