import { ECachTinhDiem } from '@/services/HocKy/constant';
import { EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Switch, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewDiemLopHocPhan = (props: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  sinhVienLopHocPhanId?: string;
  hasEdit?: boolean;
}) => {
  const { visible, setVisible, sinhVienLopHocPhanId, hasEdit } = props;
  const { record, getByIdModel, setVisibleForm, setEdit } = useModel('hocky.sinhvienlophocphan');
  const { record: recordLopHP, getByIdModel: getLopHocPhan } = useModel('hocky.lophocphan');

  useEffect(() => {
    if (visible && sinhVienLopHocPhanId)
      getByIdModel(sinhVienLopHocPhanId).then((diemLHP) => getLopHocPhan(diemLHP.lopHocPhanId));
  }, [visible, sinhVienLopHocPhanId]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title="Chi tiết sinh viên lớp học phần"
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={600}
    >
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
        <Descriptions.Item label="Lớp học phần" span={2}>
          {recordLopHP?.ten}
        </Descriptions.Item>
        <Descriptions.Item label="Học phần">{recordLopHP?.hocPhan?.ten}</Descriptions.Item>
        <Descriptions.Item label="Học kỳ">{recordLopHP?.hocKy?.ten}</Descriptions.Item>

        <Descriptions.Item label="Sinh viên" span={2}>
          {record?.sinhVien?.ten} - {record?.sinhVien?.ma}
        </Descriptions.Item>
        <Descriptions.Item label="Là điểm chính thức" span={2}>
          <Switch checked={record?.isChinhThuc} disabled />
        </Descriptions.Item>

        {/* {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo1 ? (
          <Descriptions.Item label="Điểm thành phần 1">
            {record?.diemThanhPhan1 ?? '--'}
          </Descriptions.Item>
        ) : null}
        {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo2 ? (
          <Descriptions.Item label="Điểm thành phần 2">
            {record?.diemThanhPhan2 ?? '--'}
          </Descriptions.Item>
        ) : null}
        {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo3 ? (
          <Descriptions.Item label="Điểm thành phần 3">
            {record?.diemThanhPhan3 ?? '--'}
          </Descriptions.Item>
        ) : null}
        {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo4 ? (
          <Descriptions.Item label="Điểm thành phần 4">
            {record?.diemThanhPhan4 ?? '--'}
          </Descriptions.Item>
        ) : null}
        {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo5 ? (
          <Descriptions.Item label="Điểm thành phần 5">
            {record?.diemThanhPhan5 ?? '--'}
          </Descriptions.Item>
        ) : null}
        {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSo6 ? (
          <Descriptions.Item label="Điểm thành phần 6">
            {record?.diemThanhPhan6 ?? '--'}
          </Descriptions.Item>
        ) : null}
        {!recordLopHP?.trongSoHocPhan || recordLopHP.trongSoHocPhan.trongSoKthp ? (
          <Descriptions.Item label="Điểm kết thúc học phần">
            {record?.diemKthp ?? '--'}
          </Descriptions.Item>
        ) : null}

        {!recordLopHP?.trongSoHocPhan ||
        recordLopHP.trongSoHocPhan.cachTinhDiem === ECachTinhDiem.TRUNG_BINH ? (
          <>
            <Descriptions.Item label="Điểm tổng kết">
              {record?.diemTongKet ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm chữ">{record?.diemChu ?? '--'}</Descriptions.Item>
            <Descriptions.Item label="Điểm thang 4">{record?.diemThang4 ?? '--'}</Descriptions.Item>
          </>
        ) : (
          <Descriptions.Item label="Kết quả">
            {record?.isDat === true ? (
              <Tag color="green">Đạt</Tag>
            ) : record?.isDat === false ? (
              <Tag color="volcano">Không đạt</Tag>
            ) : (
              '--'
            )}
          </Descriptions.Item>
        )} */}
      </Descriptions>

      {hasEdit ? (
        <div style={{ textAlign: 'center' }}>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => {
              setEdit(true);
              setVisibleForm(true);
              setVisible(false);
            }}
          >
            Chỉnh sửa
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewDiemLopHocPhan;
