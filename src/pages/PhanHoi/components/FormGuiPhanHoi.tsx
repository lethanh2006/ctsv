/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { includes, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useModel } from 'umi';
import Upload from '@/components/Upload/UploadMultiFile';

const FormGuiPhanHoi = () => {
  const [form] = Form.useForm();

  const { loading, setVisibleForm, userPostPhanHoiModel } = useModel('phanhoi');
  const { danhSach } = useModel('donvi');
  return (
    <Card loading={loading} title="Gửi phản hồi">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          const urlFileDinhKem = await uploadMultiFile(values?.urlFileCauHoi?.fileList);
          userPostPhanHoiModel({ ...values, urlFileCauHoi: urlFileDinhKem?.[0] });
        }}
        form={form}
      >
        <Form.Item
          name="noiDungPhanHoi"
          label="Nội dung phản hồi"
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung" />
        </Form.Item>
        <Form.Item name="urlFileCauHoi" label="File đính kèm">
          <Upload
            otherProps={{
              maxCount: 1,
              multiple: false,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        </Form.Item>
        <Form.Item name="donViId" label="Đơn vị nhận phản hồi" rules={[...rules.required]}>
          <Select
            showSearch
            filterOption={(value, option) => includes(option?.props.children, value)}
            placeholder="Chọn đơn vị"
          >
            {danhSach?.map((item) => (
              <Select.Option key={item.id} value={item.id.toString()}>
                {item.ten_don_vi} ({item.ma_don_vi})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormGuiPhanHoi;
