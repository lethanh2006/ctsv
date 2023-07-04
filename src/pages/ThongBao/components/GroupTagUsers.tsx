import { type ThongBao } from '@/services/ThongBao/typing';
import { Tag, Space } from 'antd';

const GroupTagUsers = (props: {
  users?: ThongBao.IUser[];
  setUsers?: (users: ThongBao.IUser[]) => void;
}) => {
  const { users, setUsers } = props;

  const onClose = (ssoId: string) => {
    const tmp = users?.filter((item) => item.ssoId !== ssoId) ?? [];
    if (setUsers) setUsers(tmp);
  };

  return (
    <Space wrap>
      {users?.map((item) => (
        <Tag key={item.ssoId} closable onClose={() => onClose(item.ssoId)}>
          {item.ten} {item.ma}
        </Tag>
      ))}
    </Space>
  );
};

export default GroupTagUsers;
