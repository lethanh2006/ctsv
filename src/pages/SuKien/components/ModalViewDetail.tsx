import { ColorSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ModalViewDetailCalendar = (props: {
  visible: boolean;
  setVisible: any;
  event: SuKien.IRecord;
  getData: () => void;
}) => {
  const { visible, setVisible, getData } = props;
  const { deleteModel, handleEdit } = useModel('sukien');
  const suKien = props.event;

  return (
    <Modal
      visible={visible}
      title="Chi tiết lịch"
      destroyOnClose
      onCancel={() => setVisible(false)}
      footer={
        <Space wrap>
          <Button
            type="primary"
            onClick={() => {
              handleEdit(suKien);
              setVisible(false);
            }}
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sự kiện này không?"
            onConfirm={() => {
              deleteModel(suKien?._id ?? '', getData);
              setVisible(false);
            }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>

          <Button onClick={() => setVisible(false)}>Đóng</Button>
        </Space>
      }
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Tên sự kiện">{suKien?.tenSuKien}</Descriptions.Item>
        <Descriptions.Item label="Thời gian bắt đầu">
          {moment(suKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian kết thúc">
          {moment(suKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Địa điểm">{suKien?.diaDiem ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{suKien?.ghiChu ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Loại sự kiện">
          {suKien?.loaiSuKien ? (
            <Tag color={ColorSuKien[suKien.loaiSuKien]}>{suKien.loaiSuKien}</Tag>
          ) : (
            '--'
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalViewDetailCalendar;
