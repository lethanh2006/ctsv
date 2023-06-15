import { LoaiDanhHieuThiDuaKhenThuongGiaiThuong } from '@/services/DanhMuc/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKhenThuong = () => {
  const [form] = Form.useForm();

  const {
    record,
    setVisibleForm,
    edit,
    postModel,
    putModel,
    getModel,
    formSubmiting,
    setRecord,
    setEdit,
  } = useModel('sinhvien.khenthuong');

  const { record: hoSoSinhVien } = useModel('sinhvien.sinhvien');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const getData = () =>
    getModel(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      `page/sso-id/${hoSoSinhVien?.ssoId}`,
    );

  const onFinish = async (values: any) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel({ ...values, sinhVienSsoId: hoSoSinhVien?.ssoId }, getData, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          setVisibleForm(false);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Form.Item name="namKhenThuong" label="Năm khen thưởng" rules={[...rules.required]}>
              <InputNumber
                min={2000}
                max={new Date().getFullYear()}
                style={{ width: '100%' }}
                placeholder="Năm khen thưởng"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="soQuyetDinhKhenThuong"
              label="Số quyết định khen thưởng"
              rules={[...rules.required]}
            >
              <Input placeholder="Số quyết định khen thưởng" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="danhHieuThiDuaGiaiThuongKhenThuong"
              label="Danh hiệu thi đua giải thưởng khen thưởng"
              rules={[...rules.required]}
            >
              <Input placeholder="Danh hiệu thi đua giải thưởng khen thưởng" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="capKhenThuong" label="Cấp khen thưởng" rules={[...rules.required]}>
              <Input placeholder="Cấp khen thưởng" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="loaiDanhHieuThiDuaGiaiThuongKhenThuong"
              label="Loại danh hiệu thi đua giải thưởng khen thưởng"
              rules={[...rules.required]}
            >
              <Select
                placeholder="Chọn loại"
                options={Object.values(LoaiDanhHieuThiDuaKhenThuongGiaiThuong).map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="phuongThucKhenThuong"
              label="Phương thức khen thưởng"
              rules={[...rules.required]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn phương thức"
                options={[
                  'Khen thưởng trong năm',
                  'Khen thưởng thường xuyên',
                  'Khen thưởng chuyên đề',
                  'Khen thưởng đột xuất, xuất sắc',
                  'Khen thưởng cống hiến',
                ].map((item) => ({
                  value: item,
                  label: item,
                }))}
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

export default FormKhenThuong;
