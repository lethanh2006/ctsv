import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau } from '@/services/TienIch/constant';
import { useModel } from 'umi';

const TableSelectNhanSu = (props: {
  selectedUsers?: ThongBao.IUser[];
  setSelectedUsers?: (val: ThongBao.IUser[]) => void;
}) => {
  const { selectedUsers, setSelectedUsers } = props;
  const { page, limit } = useModel('tochucnhansu.nhansu');

  const onChange = (keys?: string[], rows?: ToChucNhanSu.INhanSu[]) => {
    if (setSelectedUsers)
      setSelectedUsers(
        rows?.map((item) => ({
          ma: item.maCanBo,
          ssoId: item.ssoId,
          ten: [item.hoDem, item.ten].join(' '),
          vaiTro: EVaiTroBieuMau.NHAN_VIEN,
        })) ?? [],
      );
  };

  const columns: IColumn<ToChucNhanSu.INhanSu>[] = [
    {
      title: 'Mã cán bộ',
      dataIndex: 'maCanBo',
      width: 80,
    },
    {
      title: 'Họ tên',
      width: 150,
      render: (val, rec) => [rec.hoDem, rec.ten].join(' '),
    },
    {
      title: 'Đơn vị',
      dataIndex: ['donViChinh', 'ten'],
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
        modelName="tochucnhansu.nhansu"
        hideCard
        buttons={{ create: false, reload: false }}
        rowSelection
        detailRow={{ selectedRowKeys: selectedUsers?.map((item) => item.ssoId), onChange }}
        otherProps={{ size: 'small', rowKey: 'ssoId' }}
      />
    </>
  );
};

export default TableSelectNhanSu;
