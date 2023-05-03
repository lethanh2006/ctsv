import { useModel } from 'umi';
import { Button, Descriptions, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const ViewChiTiet = (props: { setVisible?: any }) => {
  const { record, setEdit, setVisibleForm } = useModel('chuongtrinhdaotao.chuongtrinh');

  const handleEdit = () => {
    setEdit(true);
    setVisibleForm(true);
    props?.setVisible(false);
  };

  return (
    <>
      <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered>
        <Descriptions.Item label="Tên">{record?.ten ?? ''}</Descriptions.Item>
        <Descriptions.Item label="Ngành">
          {record?.nganh?.ten} ({record?.nganh?.ma})
        </Descriptions.Item>
        {/* <Descriptions.Item label="Hình thức đào tạo">
          {record?.hinhThucDaoTao?.ten ?? ''} ({record?.hinhThucDaoTao?.ma})
        </Descriptions.Item> */}
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
