import SelectHocPhan from '@/pages/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { type CongNhanKQHT } from '@/services/KetQuaHocTap/CongNhan/typing';
import { ELoaiDiemChu, ETrangThaiCongNhanKqht } from '@/services/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCongNhanKQHT = () => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('ketquahoctap.congnhan');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: CongNhanKQHT.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values, getModel)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getModel)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Form.Item name="sinhVienSsoId" label="Sinh viên" rules={[...rules.required]}>
              <SelectSinhVienDebounce />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="hocPhanId" label="Học phần" rules={[...rules.required]}>
              <SelectHocPhan />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="diemTongKetQuyDoi"
              label="Điểm tổng kết quy đổi"
              rules={[...rules.required, ...rules.number(100, 0, true)]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Điểm tổng kết quy đổi"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="diemThang4QuyDoi"
              label="Điểm thang 4 quy đổi"
              rules={[...rules.required, ...rules.number(100, 0, true)]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Điểm thang 4 quy đổi"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item name="diemChuQuyDoi" label="Điểm chữ quy đổi" rules={[...rules.required]}>
              <Select
                options={Object.values(ELoaiDiemChu).map((item) => ({
                  key: item,
                  value: item,
                  label: item,
                }))}
                placeholder="Điểm chữ quy đổi"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="trangThai" label="Trạng thái công nhận" rules={[...rules.required]}>
              <Select
                options={Object.values(ETrangThaiCongNhanKqht).map((item) => ({
                  key: item,
                  value: item,
                  label: item,
                }))}
                placeholder="Trạng thái công nhận"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormCongNhanKQHT;
