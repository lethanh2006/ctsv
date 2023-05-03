import SelectNganh from '@/pages/DanhMucHeThong/Bo/Nganh/components/SelectNganh';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormNganhCoSo = (props: { afterAddNew?: (rec: NganhDaoTao.IRecordCoSo) => void }) => {
  const [form] = Form.useForm();
  const {
    record,
    edit,
    postModel,
    putModel,
    getModel,
    setEdit,
    setRecord,
    formSubmiting,
    setVisibleForm,
  } = useModel('danhmuc.nganhdaotao');
  const { afterAddNew } = props;

  const getData = () => getModel({ parentId: null });

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: NganhDaoTao.IRecordCoSo) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getData, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          if (afterAddNew) afterAddNew(rec);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
        <Col span={24} md={12}>
          <Form.Item name="dmNganhId" label="Tên ngành" rules={[...rules.required]}>
            <SelectNganh />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            name="tenTiengAnh"
            label="Tên ngành (Tiếng Anh)"
            rules={[...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập tên ngành (Tiếng Anh) " />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="ma" label="Mã nội bộ" rules={[...rules.text, ...rules.length(20)]}>
            <Input placeholder="Nhập mã nội bộ" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="canCuId" label="Căn cứ pháp lý">
            <SelectVanBanQuyDinh hasDefault={!edit} />
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
  );
};

export default FormNganhCoSo;
