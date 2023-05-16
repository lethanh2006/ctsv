import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { page, limit } = useModel('danhmuc.dmtrinhdo');

  const columns: IColumn<TrinhDoDaoTao.IRecordBo>[] = [
    {
      title: 'Mã trình độ',
      dataIndex: 'ma',
      align: 'center',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
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
      modelName="danhmuc.dmtrinhdo"
      title="Trình độ đào tạo"
      Form={Form}
      buttons={{ create: false }}
      addStt={false}
    />
  );
};

export default TrinhDoDTBo;
