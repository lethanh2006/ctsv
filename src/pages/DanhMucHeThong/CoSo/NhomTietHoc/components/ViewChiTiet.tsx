import { useModel } from 'umi';
import { Button, Descriptions, Form, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const ViewChiTiet = (props: { setVisible?: any }) => {
  const { record, setEdit, setVisibleForm } = useModel('danhmuc.nhomtiethoc');

  const handleEdit = () => {
    setEdit(true);
    setVisibleForm(true);
    props?.setVisible(false);
  };

  return (
    <>
      <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered>
        <Descriptions.Item label="Tên nhóm tiết học">{record?.ten ?? ''}</Descriptions.Item>
        <Descriptions.Item label="Mã nhóm tiết học">{record?.ma}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {record?.active ? (
            <Tag color="green">Đang hoạt động</Tag>
          ) : (
            <Tag color="gray">Không hoạt động</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
      <Form.Item style={{ margin: '20px 0', textAlign: 'center' }}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit()}>
          Chỉnh sửa
        </Button>
      </Form.Item>
    </>
  );
};

export default ViewChiTiet;
