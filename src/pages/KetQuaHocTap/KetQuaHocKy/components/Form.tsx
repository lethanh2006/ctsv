import SelectHocKy from '@/pages/HocKy/HocKy/components/SelectHocKy';
import { type KetQuaHocKy } from '@/services/KetQuaHocTap/KetQuaHocKy/typing';
import { ETrinhDoKqhtHocKy } from '@/services/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKetQuaHocKy = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
    'ketquahoctap.ketquahocky',
  );
  const { record: recordSVLopHC } = useModel('namhoc.sinhvienlophanhchinh');
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: KetQuaHocKy.IRecord) => {
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
            <Form.Item name="hocKyId" label="Học kỳ" rules={[...rules.required]}>
              <SelectHocKy />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item name="gpa" label="GPA" rules={[...rules.required, ...rules.number(100, 0)]}>
              <InputNumber min={0} max={100} placeholder="Nhập GPA" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="cpa" label="CPA" rules={[...rules.required, ...rules.number(100, 0)]}>
              <InputNumber min={0} max={100} placeholder="Nhập CPA" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="soTinChiDat"
              label="Số tín chỉ đạt"
              rules={[...rules.required, ...rules.number(200, 0)]}
            >
              <InputNumber
                min={0}
                max={200}
                placeholder="Nhập số tín chỉ đạt"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="tongSoTinChiTichLuy"
              label="Tổng số tín chỉ tích lũy"
              rules={[...rules.required, ...rules.number(200, 0)]}
            >
              <InputNumber
                min={0}
                max={200}
                placeholder="Nhập tổng số tín chỉ tích lũy"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="tongSoTinChiNo"
              label="Tổng số tín chỉ nợ"
              rules={[...rules.required, ...rules.number(200, 0)]}
            >
              <InputNumber
                min={0}
                max={200}
                placeholder="Nhập tổng số tín chỉ nợ"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              name="tongSoTinChiDaDk"
              label="Tổng số tín chỉ đã đăng ký"
              rules={[...rules.required, ...rules.number(200, 0)]}
            >
              <InputNumber
                min={0}
                max={200}
                placeholder="Nhập tổng số tín chỉ đã đăng ký"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name="trinhDo" label="Trình độ" rules={[...rules.required]}>
              <Select
                placeholder="Chọn trình độ"
                options={Object.values(ETrinhDoKqhtHocKy).map((item) => ({
                  key: item,
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

export default FormKetQuaHocKy;
