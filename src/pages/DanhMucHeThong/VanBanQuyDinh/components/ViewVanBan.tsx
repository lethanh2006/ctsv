import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Button } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewVanBanQuyDinh = (props: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  vanBanId: string;
  hasEdit?: boolean;
}) => {
  const { visible, setVisible, vanBanId, hasEdit } = props;
  const { getByIdModel, record, setEdit, setVisibleForm } = useModel('danhmuc.vanbanquydinh');

  useEffect(() => {
    getByIdModel(vanBanId);
  }, [vanBanId]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title="Chi tiết căn cứ pháp lý"
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
    >
      <Descriptions column={{ xs: 1, sm: 1, md: 1 }}>
        <Descriptions.Item label="Tên căn cứ">{record?.ten}</Descriptions.Item>
        <Descriptions.Item label="Mã">{record?.ma}</Descriptions.Item>
        <Descriptions.Item label="Nội dung">{record?.noiDung}</Descriptions.Item>
        <Descriptions.Item label="Tệp đính kèm">
          <a onClick={() => window.open(record?.url)}>
            <EyeOutlined /> Xem tệp tin
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian cập nhật">
          {moment(record?.updatedAt).format('HH:mm DD/MM/YYYY')}
        </Descriptions.Item>
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

export default ViewVanBanQuyDinh;
