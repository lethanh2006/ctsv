import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDeCuong = (props: { afterAddNew: (rec: HocPhan.IDeCuongHocPhan) => void }) => {
  const [form] = Form.useForm();
  const { afterAddNew } = props;
  const {
    record,
    setRecord,
    setVisibleForm,
    edit,
    setEdit,
    postModel,
    putModel,
    getModel,
    formSubmiting,
  } = useModel('hocphan.decuonghocphan');
  const { record: recHocPhan } = useModel('hocphan.hocphan');
  const [activeKey, setActiveKey] = useState('1');

  const getData = () => getModel({ hocPhanId: recHocPhan?._id });

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: HocPhan.IDeCuongHocPhan) => {
    const payload = { ...values, hocPhanId: recHocPhan?._id ?? '' };
    if (edit) {
      putModel(record?._id ?? '', payload, getData, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(payload, getData, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          if (afterAddNew) afterAddNew(rec);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Row gutter={[12, 0]}>
        <Col span={24} md={12}>
          <Form.Item
            name="ma"
            label="Phiên bản"
            rules={[...rules.required, ...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập phiên bản" />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            name="nguoiBienSoan"
            label="Người biên soạn"
            rules={[...rules.required, ...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập người biên soạn" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="ngayApDung" label="Ngày áp dụng" rules={[...rules.required]}>
            <MyDatePicker />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="canCuId" label="Căn cứ pháp lý">
            <SelectVanBanQuyDinh hasDefault={!edit} />
          </Form.Item>
        </Col>
      </Row>

      <Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
        <Tabs.TabPane key="1" tab="Mục tiêu học phần" />
        <Tabs.TabPane key="2" tab="Nội dung học phần" />
      </Tabs>

      {/* Dùng CSS để show/hide các div, tránh trường hợp un-render */}
      <div style={{ display: activeKey === '1' ? 'block' : 'none' }}>
        <Form.Item name="mucTieuHocPhan" label="" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>
      <div style={{ display: activeKey !== '1' ? 'block' : 'none' }}>
        <Form.Item name="noiDungTomTat" label="Nội dung tóm tắt" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
        <Form.Item name="noiDungChiTiet" label="Nội dung chi tiết" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
        <Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType="submit" type="primary">
          {!edit ? 'Thêm mới & Tiếp tục' : 'Lưu lại'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Form>
  );
};

export default FormDeCuong;
