import SelectHocPhan from '@/pages/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import { type DiemHocPhan } from '@/services/KetQuaHocTap/DiemHocPhan/typing';
import { ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDiemHocPhan = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
    'ketquahoctap.diemhocphan',
  );
  const { record: recordSVLopHC } = useModel('namhoc.sinhvienlophanhchinh');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: DiemHocPhan.IRecord) => {
    const payload = { ...values, sinhVienSsoId: recordSVLopHC?.sinhVienSsoId ?? '' };
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
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col xs={24} style={{ marginBottom: 8 }}>
            Sinh viên:{' '}
            <b>
              {recordSVLopHC?.sinhVien?.ten} - {recordSVLopHC?.sinhVien?.ma}
            </b>
          </Col>

          <Col span={24}>
            <Form.Item name="hocPhanId" label="Học phần" rules={[...rules.required]}>
              <SelectHocPhan />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              name="diemTongKet"
              label="Điểm tổng kết"
              rules={[...rules.required, ...rules.number(100, 0)]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Nhập điểm tổng kết"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="diemChu" label="Điểm chữ" rules={[...rules.required]}>
              <Select
                placeholder="Nhập điểm chữ"
                options={Object.values(ELoaiDiemChu).map((item) => ({
                  key: item,
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="diemThang4"
              label="Điểm thang 4"
              rules={[...rules.required, ...rules.number(4, 0)]}
            >
              <InputNumber
                min={0}
                max={4}
                placeholder="Nhập điểm thang 4"
                style={{ width: '100%' }}
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

export default FormDiemHocPhan;
