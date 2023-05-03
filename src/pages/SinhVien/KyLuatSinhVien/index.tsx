import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import moment from 'moment';
import { useModel } from 'umi';

const KyLuatSinhVienPage = () => {
  const { getModel, page, limit } = useModel('sinhvien.kyluat');
  const { record: recSinhVien } = useModel('sinhvien.sinhvien');

  const columns: IColumn<SinhVien.IKyLuatSinhVien>[] = [
    {
      title: 'Loại kỷ luật',
      dataIndex: 'loaiKyLuat',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Cấp QĐ',
      width: 120,
      dataIndex: 'capQuyetDinh',
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Số QĐ',
      width: 90,
      dataIndex: 'soQuyetDinh',
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Ngày QĐ',
      width: 100,
      dataIndex: 'ngayQuyetDinh',
      filterType: 'date',
      sortable: true,
      render: (val) => val && moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Năm bị kỷ luật',
      width: 90,
      dataIndex: 'namBiKyLuat',
      filterType: 'number',
      sortable: true,
    },
    {
      title: 'Lý do',
      width: 150,
      dataIndex: 'lyDo',
      filterType: 'string',
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        getData={() =>
          getModel(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            `page/sso-id/${recSinhVien?.ssoId}`,
          )
        }
        modelName="sinhvien.kyluat"
        hideCard
        buttons={{ create: false }}
      />
    </>
  );
};

export default KyLuatSinhVienPage;
