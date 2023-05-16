import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { formatPhoneNumber } from '@/utils/utils';
import { useModel } from 'umi';
import Form from './components/Form';

const CoSoDaoTao = () => {
  const { page, limit } = useModel('danhmuc.cosodaotao');

  const columns: IColumn<CoSoDaoTao.IRecord>[] = [
    {
      title: 'Tên cơ sở',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Ký hiệu',
      dataIndex: 'ma',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      width: 150,
      filterType: 'string',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 100,
      filterType: 'string',
      render: (val) => <>{formatPhoneNumber(val)}</>,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.cosodaotao"
      title="Cơ sở đào tạo"
      Form={Form}
      buttons={{ create: false }}
    />
  );
};

export default CoSoDaoTao;
