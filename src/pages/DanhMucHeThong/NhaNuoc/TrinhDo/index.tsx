import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';

const TrinhDoDTNhaNuoc = () => {
  const { page, limit } = useModel('danhmuc.dmtrinhdo');

  const columns: IColumn<TrinhDoDaoTao.IRecordBo>[] = [
    {
      title: 'Tên trình độ',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.nhanuoc.trinhdo"
      title="Trình độ đào tạo"
      buttons={{ create: false }}
    />
  );
};

export default TrinhDoDTNhaNuoc;
