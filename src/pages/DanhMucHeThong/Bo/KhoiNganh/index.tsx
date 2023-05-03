import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { page, limit } = useModel('danhmuc.dmkhoinganh');

  const columns: IColumn<KhoiNganhDaoTao.IRecordBo>[] = [
    {
      title: 'Mã khối ngành',
      dataIndex: 'ma',
      align: 'center',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên khối ngành',
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
      modelName="danhmuc.dmkhoinganh"
      title="Khối ngành đào tạo"
      Form={Form}
      buttons={{ create: false }}
    />
  );
};

export default TrinhDoDTBo;
