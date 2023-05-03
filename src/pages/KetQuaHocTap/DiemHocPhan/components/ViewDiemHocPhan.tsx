import { EditOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewDiemHocPhan = (props: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  diemHocPhanId?: string;
  hasEdit?: boolean;
}) => {
  const { visible, setVisible, diemHocPhanId, hasEdit } = props;
  const { record, getByIdModel, setVisibleForm, setEdit } = useModel('ketquahoctap.diemhocphan');

  useEffect(() => {
    if (visible && diemHocPhanId) getByIdModel(diemHocPhanId);
  }, [visible, diemHocPhanId]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title="Chi tiết điểm lớp học phần"
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={600}
    >
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
        <Descriptions.Item label="Mã sinh viên">{record?.sinhVien?.ma}</Descriptions.Item>
        <Descriptions.Item label="Họ tên sinh viên">{record?.sinhVien?.ten}</Descriptions.Item>

        <Descriptions.Item label="Mã học phần">{record?.hocPhan?.ma}</Descriptions.Item>
        <Descriptions.Item label="Tên học phần">{record?.hocPhan?.ten}</Descriptions.Item>

        <Descriptions.Item label="Điểm tổng kết">{record?.diemTongKet ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Điểm chữ">{record?.diemChu ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Điểm thang 4">{record?.diemThang4 ?? '--'}</Descriptions.Item>
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

export default ViewDiemHocPhan;
