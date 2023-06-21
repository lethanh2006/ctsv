import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { type TinTuc } from '@/services/TinTuc/typing';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectChuDe from '../../ChuDe/components/Select';
import { buildUpLoadFile } from '@/services/uploadFile';
import { EPhamViChuDe } from '@/services/TinTuc/constant';

const FormTinTuc = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, putModel, postModel, formSubmiting, getModel } =
    useModel('tintuc.tintuc');
  const { danhSach: danhSachChuDe } = useModel('tintuc.chude');
  const [chuDeSelected, setChuDeSelected] = useState<TinTuc.IChuDe>();
  const { title } = props;

  const onChangeChuDe = (val?: string) =>
    setChuDeSelected(danhSachChuDe.find((item) => item._id === val));

  useEffect(() => {
    onChangeChuDe(record?.idTopic);
  }, [danhSachChuDe.length]);

  useEffect(() => {
    onChangeChuDe(record?.idTopic);
    form.resetFields();
    if (record?._id)
      form.setFieldsValue({
        ...record,
        danhSachVaiTro:
          record?.doiTuong !== 'Tất cả' ? record?.danhSachVaiTro : ['sinh_vien', 'nhan_vien'],
      });
  }, [record?._id]);

  const onFinish = async (values: any) => {
    if (formSubmiting) return;
    setVisibleForm(true);
    const urlAnhDaiDien = await buildUpLoadFile(values, 'urlAnhDaiDien');
    values.urlAnhDaiDien = urlAnhDaiDien;
    setVisibleForm(false);

    const payload = {
      ...values,
      doiTuong: values.danhSachVaiTro?.length !== 1 ? 'Tất cả' : 'Vai trò',
      phamVi: record?.phamVi ?? EPhamViChuDe.TAT_CA,
    };

    if (edit) {
      putModel(record?._id ?? '', payload, getModel)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(payload, getModel)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.text, ...rules.length(250)]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item name="idTopic" label="Chủ đề" rules={[...rules.required]}>
          <SelectChuDe onChange={(val) => onChangeChuDe(val)} />
        </Form.Item>
        <Form.Item name="moTa" label="Mô tả" rules={[...rules.text, ...rules.length(2000)]}>
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Row gutter={[12, 0]}>
          <Col span={24} md={8}>
            <Form.Item name="urlAnhDaiDien" label="Ảnh đại diện">
              <UploadFile isAvatar />
            </Form.Item>
          </Col>

          {chuDeSelected?.phamVi === 'Tất cả' && (
            <Col xs={24} md={8}>
              <Form.Item name="danhSachVaiTro" label="Đối tượng">
                <Select
                  mode="multiple"
                  placeholder="Chọn vai trò"
                  onChange={(value: any) => {
                    if (value.includes('tat_ca'))
                      form.setFieldsValue({
                        doiTuong: 'Tất cả',
                        danhSachVaiTro: ['sinh_vien', 'nhan_vien'],
                      });
                  }}
                  options={[
                    { value: 'tat_ca', label: 'Tất cả' },
                    { value: 'sinh_vien', label: 'Sinh viên' },
                    { value: 'nhan_vien', label: 'Cán bộ, giảng viên' },
                  ]}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} md={8}>
            <Form.Item
              name="ngayDang"
              label="Ngày đăng"
              rules={[...rules.required, ...(!edit ? rules.sauHomNay : [])]}
            >
              <MyDatePicker
                format="HH:mm DD/MM/YYYY"
                disabledDate={(cur) => (!edit ? moment(cur).isBefore(moment()) : false)}
                placeholder="Chọn ngày đăng"
                allowClear={false}
                showTime={{ showHour: true, showMinute: true }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="noiDung" label="Nội dung" rules={[...rules.requiredHtml]}>
          <TinyEditor height={700} />
        </Form.Item>

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

export default FormTinTuc;
