import { ELoaiBieuMau, ELoaiDoiTuong } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { Button, Form, Input, Switch } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormThongTinChungKhaoSat = (props: { afterAddNew?: () => void }) => {
  const [form] = Form.useForm();
  const { formSubmiting, record, setRecord, setVisibleForm } = useModel('tienich.bieumau');
  const [camKet, setCamKet] = useState<boolean | undefined>(record?.coCamKet);
  const onFinish = async (values: any) => {
    setRecord({
      ...record,
      ...values,
      loai: ELoaiBieuMau.KHAO_SAT,
      doiTuong: ELoaiDoiTuong.TAT_CA,
    });
    if (props.afterAddNew) props.afterAddNew();
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.Item
        name="tieuDe"
        label="Tiêu đề"
        rules={[...rules.required, ...rules.text, ...rules.length(250)]}
        initialValue={record?.tieuDe}
      >
        <Input placeholder="Nhập tiêu đề" />
      </Form.Item>
      <Form.Item
        name="moTa"
        label="Mô tả"
        rules={[...rules.length(2000)]}
        initialValue={record?.moTa}
      >
        <Input.TextArea rows={3} placeholder="Nhập mô tả" />
      </Form.Item>

      <Form.Item
        name="coCamKet"
        label="Có cam kết"
        initialValue={record?.coCamKet}
        valuePropName="checked"
      >
        <Switch onChange={(val) => setCamKet(val)} />
      </Form.Item>

      {camKet && (
        <Form.Item
          rules={[...rules.required]}
          name="noiDungCamKet"
          label="Nội dung cam kết"
          initialValue={record?.noiDungCamKet}
        >
          <Input placeholder="Nội dung cam kết" />
        </Form.Item>
      )}

      <div className="form-footer">
        <Button loading={formSubmiting} htmlType="submit" type="primary">
          Tiếp theo
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
      </div>
    </Form>
  );
};

export default FormThongTinChungKhaoSat;
