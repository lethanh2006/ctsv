import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectKhoaSinhVien from '@/pages/DaoTao/KhoaSinhVien/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTao/LopHanhChinh/Select';
import SelectLopHocPhanDebounce from '@/pages/DaoTao/LopHocPhan/Select';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import GroupTagVaiTro from '@/pages/TienIch/KhaoSat/DotKhaoSat/GroupTagVaiTro';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableSelectNhanSu from './TableSelectNhanSu';
import TableSelectSinhVien from './TableSelectSinhVien';
import { type ThongBao } from '@/services/ThongBao/typing';
import _ from 'lodash';
import { EReceiverType, LoaiDoiTuongThongBao } from '@/services/ThongBao/constant';

const FormThongBao = (props: any) => {
  const [form] = Form.useForm();
  const {
    record,
    setFormSubmiting,
    setVisibleForm,
    edit,
    // putModel,
    postModel,
    formSubmiting,
    visibleForm,
  } = useModel('thongbao.thongbao');
  const { title } = props;
  const [activeKey, setActiveKey] = useState<string>();
  const [danhSachNhanSu, setDanhSachNhanSu] = useState<ThongBao.IUser[]>([]);
  const [danhSachSinhVien, setDanhSachSinhVien] = useState<ThongBao.IUser[]>([]);
  const roles: EVaiTroBieuMau[] = Form.useWatch(['filter', 'roles'], form);
  const receiverType: EReceiverType = Form.useWatch('receiverType', form) || EReceiverType.All;
  const loaiNguoiDung = Form.useWatch('loaiNguoiDung', form);

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);

    setActiveKey(roles?.[0]);
    form.setFieldsValue({
      receiverType: EReceiverType.All,
      loaiNguoiDung: 'all',
      content: record?.content ?? '<p></p>',
    });
  }, [record?._id, visibleForm]);

  const onFinish = async (values: any) => {
    if (formSubmiting) return;
    setFormSubmiting(true);
    try {
      const imageUrl = await buildUpLoadFile(values, 'imageUrl');
      values.imageUrl = imageUrl;
      setFormSubmiting(false);

      if (receiverType !== EReceiverType.All)
        values.filter[`id${receiverType}`] = values.danhSachDoiTuong;
      delete values.danhSachDoiTuong;

      console.log('🚀 ~ file: Form.tsx:56 ~ onFinish ~ values:', values);
      // if (edit) {
      //   putModel(record?._id ?? '', values)
      //     .then()
      //     .catch((er) => console.log(er));
      // } else
      postModel(values)
        .then()
        .catch((er) => console.log(er));
    } catch (er) {
      console.log(er);
    } finally {
      setFormSubmiting(false);
    }
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.text, ...rules.length(250)]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        <Row gutter={[12, 0]}>
          <Col span={24} md={6}>
            <Form.Item name="urlAnhDaiDien" label="Ảnh đại diện">
              <UploadFile isAvatarSmall />
            </Form.Item>
          </Col>
          <Col span={24} md={18}>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[...rules.text, ...rules.length(500)]}
            >
              <Input.TextArea rows={3} placeholder="Mô tả" />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              name="receiverType"
              label="Đối tượng nhận thông báo"
              rules={[...rules.required]}
            >
              <Select
                options={Object.entries(LoaiDoiTuongThongBao).map(([value, label]) => ({
                  key: value,
                  value,
                  label,
                }))}
                placeholder="Chọn nhóm người nhận"
                onChange={() => {
                  form.setFieldsValue({
                    filter: { roles: undefined },
                    danhSachDoiTuong: undefined,
                  });
                  setDanhSachNhanSu([]);
                  setDanhSachSinhVien([]);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item name={['filter', 'roles']} label="Vai trò" rules={[...rules.required]}>
              <GroupTagVaiTro
                onChange={(arr) => {
                  setActiveKey(arr?.[0]);
                  if (!arr.includes(EVaiTroBieuMau.SINH_VIEN)) setDanhSachSinhVien([]);
                  if (!arr.includes(EVaiTroBieuMau.NHAN_VIEN)) setDanhSachNhanSu([]);
                }}
                listVaiTro={
                  [EReceiverType.KhoaSinhVien, EReceiverType.Nganh].includes(receiverType)
                    ? [EVaiTroBieuMau.SINH_VIEN]
                    : undefined
                }
              />
            </Form.Item>
          </Col>

          {receiverType !== EReceiverType.All ? (
            <Col span={24}>
              <Form.Item
                name="danhSachDoiTuong"
                label={LoaiDoiTuongThongBao[receiverType]}
                rules={[...rules.required]}
              >
                {receiverType === EReceiverType.Khoa ? (
                  <SelectDonVi multiple />
                ) : receiverType === EReceiverType.KhoaSinhVien ? (
                  <SelectKhoaSinhVien multiple />
                ) : receiverType === EReceiverType.LopHanhChinh ? (
                  <SelectLopHanhChinhDebounce multiple />
                ) : receiverType === EReceiverType.LopHocPhan ? (
                  <SelectLopHocPhanDebounce multiple />
                ) : receiverType === EReceiverType.Nganh ? (
                  <SelectNganhCoSo multiple />
                ) : null}
              </Form.Item>
            </Col>
          ) : null}

          {roles?.length ? (
            <>
              <Col span={24}>
                <Form.Item name="loaiNguoiDung" label="Danh sách người dùng">
                  <Radio.Group buttonStyle="solid" optionType="button">
                    <Radio value={'all'}>Tất cả</Radio>
                    <Radio value={'users'}>Người dùng cụ thể</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {loaiNguoiDung === 'users' ? (
                <Col span={24} style={{ marginBottom: 12 }}>
                  <Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
                    {Object.values(EVaiTroBieuMau).map((item) =>
                      roles.includes(item) ? (
                        <Tabs.TabPane key={item} tab={TenVaiTroBieuMau[item]} />
                      ) : null,
                    )}
                  </Tabs>

                  {activeKey === EVaiTroBieuMau.SINH_VIEN ? (
                    <TableSelectSinhVien
                      selectedUsers={danhSachSinhVien}
                      setSelectedUsers={setDanhSachSinhVien}
                    />
                  ) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
                    <TableSelectNhanSu
                      selectedUsers={danhSachNhanSu}
                      setSelectedUsers={setDanhSachNhanSu}
                    />
                  ) : null}
                </Col>
              ) : null}
            </>
          ) : null}
        </Row>

        <Form.Item
          name="content"
          label="Nội dung chi tiết thông báo"
          rules={[...rules.length(5000)]}
        >
          <TinyEditor height={400} hideMenubar />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới ' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormThongBao;
