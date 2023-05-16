import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';

const HinhThucDTNhaNuoc = () => {
  const { page, limit } = useModel('danhmuc.dmtrinhdo');

  const columns: IColumn<TrinhDoDaoTao.IRecordBo>[] = [
    {
      title: 'Tên hình thức',
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
      modelName="danhmuc.nhanuoc.hinhthuc"
      title="Hình thức đào tạo"
      buttons={{ create: false }}
    />
  );
};

export default HinhThucDTNhaNuoc;
