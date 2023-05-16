import TinyEditor from '@/components/TinyEditor';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, Row, Tabs, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../../Nganh/components/SelectNganh';
import SelectTrinhDo from '../../TrinhDo/components/Select';

const FormChuongTrinhDaoTao = (props: {
  afterAddNew: (rec: ChuongTrinhDaoTao.IRecord) => void;
}) => {
  const [form] = Form.useForm();
  const { afterAddNew } = props;
  const {
    record,
    setRecord,
    setEdit,
    setVisibleForm,
    edit,
    postModel,
    putModel,
    getModel,
    formSubmiting,
  } = useModel('chuongtrinhdaotao.chuongtrinh');
  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: ChuongTrinhDaoTao.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values, getModel, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getModel, false)
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
          <Form.Item name="trinhDoDaoTaoId" label="Trình độ đào tạo" rules={[...rules.required]}>
            <SelectTrinhDo hasDefault={!edit} />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="nganhId" label="Ngành đào tạo" rules={[...rules.required]}>
            <SelectNganhCoSo hasDefault={!edit} />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            name="ten"
            label="Tên chương trình (tiếng Việt)"
            rules={[...rules.required, ...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập tên chương trình (tiếng Việt)" />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            name="tenTiengAnh"
            label="Tên chương trình (tiếng Anh)"
            rules={[...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập tên chương trình (tiếng Anh)" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            name="thoiGianDaoTao"
            label="Thời gian đào tạo (năm)"
            rules={[...rules.number(10, 0)]}
          >
            <InputNumber
              placeholder="Nhập thời gian đào tạo"
              min={0}
              max={10}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            name="tongSoTinChi"
            label="Khối lượng kiến thức toàn khóa (tín chỉ)"
            rules={[...rules.required, ...rules.number(200, 0, false)]}
          >
            <InputNumber
              placeholder="Nhập khối lượng kiến thức toàn khóa"
              min={0}
              max={200}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
        <Tabs.TabPane key="1" tab="Mục tiêu đào tạo" />
        <Tabs.TabPane key="2" tab="Đối tượng tuyển sinh" />
        <Tabs.TabPane key="3" tab="Thang điểm" />
        <Tabs.TabPane key="4" tab="Quy trình ĐT, ĐK tốt nghiệp" />
      </Tabs>

      {/* Dùng CSS để show/hide các div, tránh trường hợp un-render */}
      <div style={{ display: activeKey === '1' ? 'block' : 'none' }}>
        <Form.Item name="mucTieuDaoTao" label="" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>
      <div style={{ display: activeKey === '2' ? 'block' : 'none' }}>
        <Form.Item name="doiTuongTuyenSinh" label="" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>
      <div style={{ display: activeKey === '3' ? 'block' : 'none' }}>
        <Form.Item name="thangDiem" label="" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>
      <div style={{ display: activeKey === '4' ? 'block' : 'none' }}>
        <Form.Item name="quyTrinhDaoTao" label="Quy trình đào tạo" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
        <Form.Item name="dieuKienTotNghiep" label="Điều kiện tốt nghiệp" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>

      <div className="form-footer">
        <Button loading={formSubmiting} htmlType="submit" type="primary">
          {!edit ? 'Thêm mới ' : 'Lưu lại'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Form>
  );
};

export default FormChuongTrinhDaoTao;
