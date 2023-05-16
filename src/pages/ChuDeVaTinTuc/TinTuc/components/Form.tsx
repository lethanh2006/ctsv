import TinyEditor from '@/components/TinyEditor';
import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormTinTuc = () => {
  const access = useAccess();
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm, edit, putTinTucModel, addTinTucModel } =
    useModel('tintuc');
  const { danhSach: danhSachChuDe } = useModel('chude');
  const [chuDeSelected, setChuDeSelected] = useState<ChuDe.Record>();
  const { initialState } = useModel('@@initialState');
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    setChuDeSelected(danhSachChuDe.find((item) => item._id === record.idTopic));
  }, [record._id]);

  const onFinish = async (values: any) => {
    if (formSubmitting) return;
    setFormSubmitting(true);

    if (values.urlAnhDaiDien.fileList?.[0]?.originFileObj) {
      const response = await getURLImg({
        filename: 'url1',
        public: true,
        file: values?.urlAnhDaiDien.fileList?.[0].originFileObj,
      });
      values.urlAnhDaiDien = response?.data?.data?.url;
    } else values.urlAnhDaiDien = values.urlAnhDaiDien.fileList?.[0]?.url;

    if (edit)
      putTinTucModel({
        id: record._id,
        data: {
          ...values,
          doiTuong: values.danhSachVaiTro?.length !== 1 ? 'Tất cả' : 'Vai trò',
        },
      });
    else {
      addTinTucModel({
        ...values,
        hinhThucDaoTaoId:
          access?.quanTri === true
            ? initialState?.currentUser?.hinh_thuc_dao_tao_id ?? 0
            : values?.hinhThucDaoTaoId,
        doiTuong: values.danhSachVaiTro?.length !== 1 ? 'Tất cả' : 'Vai trò',
        phamVi: chuDeSelected?.phamVi ?? 'Tất cả',
      });
    }
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form labelCol={{ span: 24 }} onFinish={onFinish} scrollToFirstError form={form}>
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          initialValue={record?.tieuDe}
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>

        <Form.Item
          name="idTopic"
          label="Chủ đề"
          rules={[...rules.required]}
          initialValue={record?.idTopic}
        >
          <Select
            placeholder="Chọn chủ đề"
            onChange={(value) => setChuDeSelected(danhSachChuDe.find((item) => item._id === value))}
          >
            {danhSachChuDe.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          initialValue={record?.moTa}
          rules={[...rules.text, ...rules.length(300)]}
        >
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="urlAnhDaiDien"
          label="Ảnh đại diện"
          initialValue={renderFileListUrl(record?.urlAnhDaiDien)}
        >
          <UploadAvatar
            style={{
              width: 102,
              maxWidth: 102,
              height: 102,
              maxHeight: 102,
            }}
          />
        </Form.Item>
        <Row gutter={[20, 0]}>
          {chuDeSelected?.phamVi === 'Tất cả' && (
            <Col xs={24} md={12}>
              <Form.Item
                name="danhSachVaiTro"
                label="Đối tượng"
                initialValue={
                  record?.doiTuong !== 'Tất cả'
                    ? record?.danhSachVaiTro
                    : ['sinh_vien', 'nhan_vien']
                }
              >
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
                >
                  {[
                    { value: 'tat_ca', name: 'Tất cả' },
                    { value: 'sinh_vien', name: 'Sinh viên' },
                    { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                  ].map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={12}>
            <Form.Item name="ngayDang" label="Ngày đăng" initialValue={moment(record?.ngayDang)}>
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabledDate={(cur) => moment(cur).isAfter(moment())}
                placeholder="Ngày đăng"
                clearIcon={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="noiDung"
          label="Nội dung"
          // rules={[...rules.textEditor]}
          initialValue={{ text: record?.noiDung || '' }}
        >
          <TinyEditor height={350} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            loading={formSubmitting}
            style={{ marginRight: 8 }}
            htmlType="submit"
            type="primary"
          >
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTinTuc;
