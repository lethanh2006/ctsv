import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../components/SelectNganh';
import { type TFilter } from '@/components/Table/typing';
import { EOperatorType } from '@/components/Table/constant';

const FormChuyenNganh = () => {
  const [form] = Form.useForm();
  const { record, getModel, setVisibleForm, postModel, edit, putModel, formSubmiting } =
    useModel('danhmuc.chuyennganh');
  const { record: recNganh } = useModel('danhmuc.nganhdaotao');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const isChuyenNganh = arrPathName.includes('chuyen-nganh');

  const getData = () => {
    const filter: TFilter<NganhDaoTao.IRecordCoSo> = {
      field: 'parentId',
      operator: isChuyenNganh ? EOperatorType.NOT_NULL : EOperatorType.EQUAL,
      values: recNganh?._id && !isChuyenNganh ? [recNganh._id] : [''],
      active: true,
    };
    getModel(undefined, [filter]);
  };

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: NganhDaoTao.IRecordCoSo) => {
    if (edit) {
      putModel(record?._id ?? '', values, getData)
        .then()
        .catch((er) => console.log(er));
    } else {
      const valuesFinal = { ...values, parentId: recNganh?._id };
      postModel(!isChuyenNganh ? valuesFinal : values, getData)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
    }
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} chuyên ngành đào tạo`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          {isChuyenNganh ? (
            <Col xs={24}>
              <Form.Item name="parentId" label="Ngành đào tạo" rules={[...rules.required]}>
                <SelectNganhCoSo hasDefault={!edit} />
              </Form.Item>
            </Col>
          ) : null}
          <Col xs={24}>
            <Form.Item
              name="ma"
              label="Mã chuyên ngành"
              rules={[...rules.required, ...rules.text, ...rules.length(20)]}
            >
              <Input placeholder="Nhập mã chuyên ngành" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="ten"
              label="Tên chuyên ngành"
              rules={[...rules.required, ...rules.text, ...rules.length(250)]}
            >
              <Input placeholder="Nhập tên chuyên ngành" />
            </Form.Item>
          </Col>

          <Col xs={24}>
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
    </Card>
  );
};

export default FormChuyenNganh;
