import { type ThongBao } from '@/services/ThongBao/typing';
import { Tag, Space } from 'antd';

const GroupTagUsers = (props: {
  users?: ThongBao.IUser[];
  setUsers?: (users: ThongBao.IUser[]) => void;
}) => {
  const { users, setUsers } = props;

  const onClose = (code: string) => {
    const tmp = users?.filter((item) => item.code !== code) ?? [];
    if (setUsers) setUsers(tmp);
  };

  return (
    <Space wrap>
      {users?.map((item) => (
        <Tag key={item.code} closable onClose={() => onClose(item.code)}>
          {item.firstname} {item.lastname} - {item.code}
        </Tag>
      ))}
    </Space>
  );
};

export default GroupTagUsers;
