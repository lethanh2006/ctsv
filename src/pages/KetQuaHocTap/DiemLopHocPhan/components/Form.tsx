import { ECachTinhDiem } from '@/services/HocKy/constant';
import { ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDiemLopHocPhan = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
    'hocky.sinhvienlophocphan',
  );
  const { record: recordLopHP } = useModel('hocky.lophocphan');
  const { title } = props;
  const [isChinhThuc, setIsChinhThuc] = useState(false);

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
    setIsChinhThuc(record?.isChinhThuc ?? false);
  }, [record?._id]);

  const onFinish = async (values: LopHocPhan.IRecordSinhVienLopHP) => {
    const payload: any = { ...values, lopHocPhanId: recordLopHP?._id, isChinhThuc };
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
    <Card title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ` ${title}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col xs={24} style={{ marginBottom: 8 }}>
            Lớp học phần: <b>{recordLopHP?.ten}</b>
          </Col>
          <Col xs={24} style={{ marginBottom: 8 }}>
            Sinh viên:{' '}
            <b>
              {record?.sinhVien?.ten} - {record?.sinhVien?.ma}
            </b>
          </Col>

          {/* <Col span={24}>
            <Form.Item name="sinhVienSsoId" label="Sinh viên" rules={[...rules.required]}>
              <SelectSinhVienLopHP lopHocPhanId={recordLopHP?._id} hasCreate={false} />
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item name="isChinhThuc" label="Là điểm chính thức" valuePropName="checked">
              <Switch onChange={(val) => setIsChinhThuc(val)} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <span className="fw500">Điểm thành phần</span>
          </Col>
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo1 ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemThanhPhan1"
                label="Điểm thành phần 1"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm thành phần 1"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo2 ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemThanhPhan2"
                label="Điểm thành phần 2"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm thành phần 2"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo3 ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemThanhPhan3"
                label="Điểm thành phần 3"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm thành phần 3"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo4 ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemThanhPhan4"
                label="Điểm thành phần 4"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm thành phần 4"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo5 ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemThanhPhan5"
                label="Điểm thành phần 5"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm thành phần 5"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo6 ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemThanhPhan6"
                label="Điểm thành phần 6"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm thành phần 6"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}
          {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSoKthp ? (
            <Col span={24} md={8}>
              <Form.Item
                name="diemKthp"
                label="Điểm kết thúc học phần"
                rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Nhập điểm kết thúc học phần"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          ) : null}

          {!recordLopHP?.trongSoHocPhan ||
          recordLopHP.trongSoHocPhan.cachTinhDiem === ECachTinhDiem.TRUNG_BINH ? (
            <>
              <Col span={24}>
                <span className="fw500">Điểm tổng kết</span>
              </Col>
              <Col span={24} md={8}>
                <Form.Item
                  name="diemTongKet"
                  label="Điểm tổng kết"
                  rules={[...(isChinhThuc ? rules.required : []), ...rules.number(100, 0)]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    placeholder="Nhập điểm tổng kết"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={8}>
                <Form.Item
                  name="diemChu"
                  label="Điểm chữ"
                  rules={[...(isChinhThuc ? rules.required : [])]}
                >
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
              <Col span={24} md={8}>
                <Form.Item
                  name="diemThang4"
                  label="Điểm thang 4"
                  rules={[...(isChinhThuc ? rules.required : []), ...rules.number(4, 0)]}
                >
                  <InputNumber
                    min={0}
                    max={4}
                    placeholder="Nhập điểm thang 4"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </>
          ) : (
            <Col span={24} md={8}>
              <Form.Item name="isDat" label="Kết quả" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          )}
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

export default FormDiemLopHocPhan;
