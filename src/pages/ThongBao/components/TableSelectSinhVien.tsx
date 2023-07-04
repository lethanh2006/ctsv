import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { useModel } from 'umi';

const TableSelectSinhVien = (props: {
  selectedUsers?: ThongBao.IUser[];
  setSelectedUsers?: (val: ThongBao.IUser[]) => void;
}) => {
  const { selectedUsers, setSelectedUsers } = props;
  const { page, limit } = useModel('sinhvien.sinhvien');

  const onChange = (keys?: string[], rows?: SinhVien.IRecord[]) => {
    if (setSelectedUsers)
      setSelectedUsers(
        rows?.map((item) => ({
          ma: item.ma,
          ssoId: item.ssoId,
          ten: item.ten,
          vaiTro: EVaiTroBieuMau.SINH_VIEN,
        })) ?? [],
      );
  };

  const columns: IColumn<SinhVien.IRecord>[] = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma',
      width: 80,
    },
    {
      title: 'Họ tên',
      dataIndex: 'ten',
      width: 150,
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        modelName="sinhvien.sinhvien"
        hideCard
        buttons={{ create: false, reload: false }}
        rowSelection
        detailRow={{ selectedRowKeys: selectedUsers?.map((item) => item.ssoId), onChange }}
        otherProps={{ size: 'small', rowKey: 'ssoId' }}
      />
    </>
  );
};

export default TableSelectSinhVien;
