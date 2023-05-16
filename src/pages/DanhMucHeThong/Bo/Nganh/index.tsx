import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import SelectNhomNganh from '../NhomNganh/components/SelectNhomNganh';
import SelectTrinhDo from '../TrinhDo/components/SelectTrinhDo';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { page, limit } = useModel('danhmuc.dmnganh');

  const columns: IColumn<NganhDaoTao.IRecordBo>[] = [
    {
      title: 'Mã ngành',
      dataIndex: 'ma',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên ngành',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Nhóm ngành đào tạo',
      width: 150,
      dataIndex: 'dmNhomNganhId',
      render: (val, rec) => (
        <>
          {rec?.dmNhomNganh?.ma} - {rec?.dmNhomNganh?.ten}
        </>
      ),
      filterType: 'customselect',
      filterCustomSelect: <SelectNhomNganh hasCreate={false} multiple />,
    },
    {
      title: 'Trình độ đào tạo',
      width: 150,
      dataIndex: 'dmTrinhDoId',
      render: (val, rec) => (
        <>
          {rec?.dmTrinhDo?.ma} - {rec?.dmTrinhDo?.ten}
        </>
      ),
      filterType: 'customselect',
      filterCustomSelect: <SelectTrinhDo multiple />,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.dmnganh"
      title="Ngành đào tạo"
      Form={Form}
      buttons={{ create: false }}
    />
  );
};

export default TrinhDoDTBo;
