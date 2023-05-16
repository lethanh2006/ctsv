import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import { EHinhThucTuyenDung, EViTriViecLam } from '@/services/constant';
import { tienVietNam } from '@/utils/utils';
import moment from 'moment';
import { useModel } from 'umi';

const ViecLamSinhVienPage = () => {
  const { getModel, page, limit } = useModel('sinhvien.vieclam');
  const { record: recSinhVien } = useModel('sinhvien.sinhvien');

  const columns: IColumn<SinhVien.IViecLamSinhVien>[] = [
    {
      title: 'Đơn vị tuyển dụng',
      dataIndex: 'donViTuyenDung',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Hình thức tuyển dụng',
      width: 120,
      dataIndex: 'hinhThucTuyenDung',
      filterType: 'select',
      filterData: Object.values(EHinhThucTuyenDung),
      sortable: true,
    },
    {
      title: 'Thời gian tuyển dụng',
      width: 100,
      dataIndex: 'thoiGianTuyenDung',
      filterType: 'date',
      sortable: true,
      render: (val) => val && moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Vị trí việc làm',
      width: 120,
      dataIndex: 'viTriViecLam',
      filterType: 'select',
      filterData: Object.values(EViTriViecLam),
      sortable: true,
    },
    {
      title: 'Mức lương khởi điểm',
      width: 100,
      dataIndex: 'mucLuongKhoiDiem',
      filterType: 'number',
      sortable: true,
      render: (val) => val && tienVietNam(val),
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
        modelName="sinhvien.vieclam"
        hideCard
        buttons={{ create: false }}
      />
    </>
  );
};

export default ViecLamSinhVienPage;
