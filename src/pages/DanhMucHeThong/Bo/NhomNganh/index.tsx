import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import Form from './components/Form';
import SelectLinhVuc from '../LinhVuc/components/SelectLinhVuc';

const TrinhDoDTBo = () => {
  const { page, limit, condition } = useModel('danhmuc.dmnhomnganh');

  const columns: IColumn<NhomNganhDaoTao.IRecordBo>[] = [
    {
      title: 'Mã nhóm ngành',
      dataIndex: 'ma',
      align: 'center',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên nhóm ngành',
      dataIndex: 'ten',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Lĩnh vực đào tạo',
      width: 200,
      dataIndex: 'dmLinhVucDaoTaoId',
      render: (val, rec) => (
        <>
          {rec?.dmLinhVucDaoTao?.ma} - {rec?.dmLinhVucDaoTao?.ten}
        </>
      ),
      filterType: 'customselect',
      filterCustomSelect: <SelectLinhVuc hasCreate={false} multiple />,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit, condition]}
      modelName="danhmuc.dmnhomnganh"
      title="Nhóm ngành đào tạo"
      Form={Form}
      buttons={{ create: false }}
    />
  );
};

export default TrinhDoDTBo;
