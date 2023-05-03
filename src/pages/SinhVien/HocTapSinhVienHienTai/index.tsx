import MyDatePicker from '@/components/MyDatePicker';
import { getHocTapHienTai } from '@/services/SinhVien';
import { Col, Divider, Form, Input, Row } from 'antd';
import { useEffect } from 'react';

const HocTapSinhVienHienTaiPage = (props: { sinhVienSsoId?: string }) => {
  const { sinhVienSsoId } = props;
  const [form] = Form.useForm();

  const fetchData = async () =>
    sinhVienSsoId &&
    getHocTapHienTai(sinhVienSsoId)
      .then((res) => form.setFieldsValue(res.data?.data))
      .catch((er) => console.log(er));

  useEffect(() => {
    if (sinhVienSsoId) fetchData();
  }, [sinhVienSsoId]);

  return (
    <Form form={form} layout="vertical">
      <Divider orientation="center">Thông tin đào tạo</Divider>
      <Row gutter={[12, 0]}>
        <Col span={24} md={8}>
          <Form.Item label="Trạng thái sinh viên" name="trangThaiSinhVien">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Loại học viên" name="loaiHocVien">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Chương trình đào tạo" name={['chuongTrinhDaoTao', 'ma']}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Hình thức đào tạo" name={['hinhThucDaoTao', 'ma']}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Khoa">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Khoá sinh viên" name={['khoaSinhVien', 'ten']}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Ngành đào tạo" name={['nganhDaoTao', 'ma']}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Chuyên ngành">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Lớp hành chính" name={['lopHanhChinh', 'ten']}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Sinh viên năm thứ" name="sinhVienNamThu">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Đào tạo từ năm" name="daoTaoTuNam">
            <MyDatePicker format={'YYYY'} disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Số năm đào tạo" name={'soNamDaoTao'}>
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="center">Thông tin kết quả học tập</Divider>
      <Row gutter={[12, 0]}>
        <Col span={24} md={8}>
          <Form.Item label="Điểm TBTL hệ 10" name={'diemTbtl10'}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Điểm TBTL hệ 4" name={'diemTbtl4'}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item label="Điểm TBTL chữ" name={'diemTbtlChu'}>
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default HocTapSinhVienHienTaiPage;
