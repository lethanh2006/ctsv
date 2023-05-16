import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { page, limit } = useModel('danhmuc.dmlinhvuc');

  const columns: IColumn<LinhVucDaoTao.IRecordBo>[] = [
    {
      title: 'Mã lĩnh vực',
      dataIndex: 'ma',
      align: 'center',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên lĩnh vực',
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
      modelName="danhmuc.dmlinhvuc"
      title="Lĩnh vực đào tạo"
      Form={Form}
      buttons={{ create: false }}
      addStt={false}
    />
  );
};

export default TrinhDoDTBo;
