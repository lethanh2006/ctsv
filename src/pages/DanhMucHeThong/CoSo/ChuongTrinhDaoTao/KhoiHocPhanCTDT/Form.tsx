import rules from '@/utils/rules';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectKhoiKienThuc from '../../KhoiKienThuc/components/Select';
import SelectChuyenNganh from '../../Nganh/ChuyenNganh/SelectChuyenNganh';
import { ELoaiHocPhanCTDT } from '@/services/DanhMucHeThong/constant';
import SelectHocPhan from '../../HocPhan/components/SelectHocPhan';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';

const FormKhoiHocPhanCTDT = (props: {
  initKhoi?: string;
  initNganh?: string;
  getData: any;
  afterInsertOrUpdate: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => void;
}) => {
  const [form] = Form.useForm();
  const { initKhoi, initNganh, getData, afterInsertOrUpdate } = props;
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, setRecord, setEdit } =
    useModel('chuongtrinhdaotao.khoihocphanctdt');
  const { record: recPhienBan } = useModel('chuongtrinhdaotao.phienbanctdt');
  const { record: recChuongTrinh } = useModel('chuongtrinhdaotao.chuongtrinh');
  const [loaiHocPhan, setLoaiHocPhan] = useState<ELoaiHocPhanCTDT>();

  useEffect(() => {
    if (record?._id) {
      form.setFieldsValue(record);
      setLoaiHocPhan(record.loaiHocPhanCtdt);
    } else {
      form.resetFields();
      setLoaiHocPhan(undefined);
      form.setFieldsValue({ khoiKienThucId: initKhoi, chuyenNganhId: initNganh });
    }
  }, [record?._id, initKhoi, initNganh]);

  const onFinish = async (values: any) => {
    const payload = { ...values, phienBanId: recPhienBan?._id ?? '' };
    if (edit) {
      putModel(record?._id ?? '', payload, getData, true, false)
        .then((rec) => {
          if (afterInsertOrUpdate) afterInsertOrUpdate(rec);
        })
        .catch((er) => console.log(er));
    } else
      postModel(payload, getData, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          if (afterInsertOrUpdate) afterInsertOrUpdate(rec);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Row gutter={[12, 0]}>
        <Col span={24} md={12}>
          <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[...rules.required]}>
            <SelectKhoiKienThuc disabled={edit || !!initKhoi} hasDefault={!edit} />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="chuyenNganhId" label="Thuộc chuyên ngành">
            <SelectChuyenNganh
              disabled={edit || !!initNganh}
              nganhId={recChuongTrinh?.nganhId}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="loaiHocPhanCtdt" label="Loại học phần" rules={[...rules.required]}>
            <Select
              options={Object.values(ELoaiHocPhanCTDT).map((item) => ({
                key: item,
                value: item,
                label: item,
              }))}
              placeholder="Chọn loại học phần"
              disabled={edit}
              onChange={(val) => setLoaiHocPhan(val as ELoaiHocPhanCTDT)}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item
            name="soThuTuKy"
            label="Học kỳ dự kiến"
            rules={[
              ...rules.number(20, 0, false),
              ...(loaiHocPhan === ELoaiHocPhanCTDT.TU_CHON ? [] : rules.required),
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={20} placeholder="Học kỳ dự kiến" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
        {loaiHocPhan === ELoaiHocPhanCTDT.BAT_BUOC ||
        loaiHocPhan === ELoaiHocPhanCTDT.THAY_THE_TOT_NGHIEP ? (
          <>
            <Col span={24} md={12}>
              <Form.Item name="hocPhanId" label="Học phần" rules={[...rules.required]}>
                <SelectHocPhan />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item name="hocPhanTienQuyetId" label="Học phần tiên quyết">
                <SelectHocPhan allowClear loadData={false} />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="hocPhanTruocId" label="Học phần trước">
                <SelectHocPhan allowClear loadData={false} />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="hocPhanSongHanhId" label="Học phần song hành">
                <SelectHocPhan allowClear loadData={false} />
              </Form.Item>
            </Col>
          </>
        ) : loaiHocPhan === ELoaiHocPhanCTDT.TU_CHON ? (
          <>
            <Col span={24} md={12}>
              <Form.Item
                name="ten"
                label="Tên khối học phần tự chọn"
                rules={[...rules.required, ...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập tên khối học phần tự chọn" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="soTinChiTuChonPhaiHoc"
                label="Số tín chỉ tự chọn phải học"
                rules={[...rules.number(20, 0, false)]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={20}
                  placeholder="Số tín chỉ tự chọn phải học"
                />
              </Form.Item>
            </Col>
          </>
        ) : null}
      </Row>

      <div className="form-footer">
        <Button loading={formSubmiting} htmlType="submit" type="primary">
          {!edit
            ? loaiHocPhan === ELoaiHocPhanCTDT.TU_CHON
              ? 'Thêm mới & Tiếp tục'
              : 'Thêm mới'
            : 'Lưu lại'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Form>
  );
};

export default FormKhoiHocPhanCTDT;
