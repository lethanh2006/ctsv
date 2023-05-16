import SelectNhanSuTheoDonVi from '@/pages/ToChucNhanSu/NhanSu/SelectByDonVi';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Radio, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormGiangVienDeCuong = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
    'hocphan.giangviendecuong',
  );
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
  const { record: recHocPhan } = useModel('hocphan.hocphan');
  const [isNhanSu, setIsNhanSu] = useState(true);
  const [hoTenNhanSu, setHoTenNhanSu] = useState<string>();
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
    setIsNhanSu(!record?._id || !!record?.nhanSuSsoId);
  }, [record?._id]);

  const getData = () => getModel({ deCuongId: recDeCuong?._id });

  const onFinish = async (values: HocPhan.IGiangVienDeCuong) => {
    if (isNhanSu) {
      values.chucDanh = values.hocHam = values.hocVi = values.diaChi = values.soDienThoai = null;
      values.hoTen = hoTenNhanSu;
    } else values.nhanSuSsoId = null;

    if (edit) {
      putModel(record?._id ?? '', values, getData)
        .then()
        .catch((er) => console.log(er));
    } else {
      postModel({ ...values, deCuongId: recDeCuong?._id ?? '' }, getData)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
    }
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Radio.Group
              value={isNhanSu}
              onChange={(e) => setIsNhanSu(e.target.value)}
              style={{ marginBottom: 12 }}
            >
              <Radio value={true}>Giảng viên trong trường</Radio>
              <Radio value={false}>Giảng viên tự do</Radio>
            </Radio.Group>
          </Col>

          {isNhanSu ? (
            <Col span={24}>
              <Form.Item
                name="nhanSuSsoId"
                label="Giảng viên trong đơn vị"
                rules={[...rules.required]}
              >
                <SelectNhanSuTheoDonVi
                  donViId={recHocPhan?.donVi ?? ''}
                  onChange={(val, opt) => setHoTenNhanSu(opt?.hoten)}
                />
              </Form.Item>
            </Col>
          ) : (
            <>
              <Col span={24} md={12}>
                <Form.Item
                  name="hoTen"
                  label="Họ tên"
                  rules={[...rules.required, ...rules.text, ...rules.length(250)]}
                >
                  <Input placeholder="Nhập họ tên giảng viên" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="chucDanh"
                  label="Chức danh"
                  rules={[...rules.text, ...rules.length(250)]}
                >
                  <Input placeholder="Nhập chức danh" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="hocHam"
                  label="Học hàm"
                  rules={[...rules.text, ...rules.length(250)]}
                >
                  <Input placeholder="Nhập học hàm" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="hocVi"
                  label="Học vị"
                  rules={[...rules.text, ...rules.length(250)]}
                >
                  <Input placeholder="Nhập học vị" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="soDienThoai"
                  label="Số điện thoại"
                  rules={[...rules.text, ...rules.length(20), ...rules.soDienThoai]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="diaChi"
                  label="Địa chỉ"
                  rules={[...rules.text, ...rules.length(250)]}
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>
            </>
          )}
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

export default FormGiangVienDeCuong;
