import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { page, limit } = useModel('danhmuc.dmhinhthuc');

  const columns: IColumn<HinhThucDaoTao.IRecordBo>[] = [
    {
      title: 'Mã hình thức',
      dataIndex: 'ma',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
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
      modelName="danhmuc.dmhinhthuc"
      title="Hình thức đào tạo"
      Form={Form}
      buttons={{ create: false }}
    />
  );
};

export default TrinhDoDTBo;
