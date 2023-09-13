import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import { useModel } from 'umi';
import FormKhenThuong from "@/pages/SinhVien/KhenThuongSinhVien/components/Form";

const KhenThuongSinhVienPage = () => {
  const { getModel, page, limit } = useModel('sinhvien.khenthuong');
  const { record: recSinhVien } = useModel('sinhvien.sinhvien');

  const columns: IColumn<SinhVien.IKhenThuongSinhVien>[] = [
    {
      title: 'Danh hiệu khen thưởng',
      dataIndex: 'danhHieuThiDuaGiaiThuongKhenThuong',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Cấp khen thưởng',
      width: 120,
      dataIndex: 'capKhenThuong',
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Số QĐ',
      width: 90,
      dataIndex: 'soQuyetDinhKhenThuong',
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Năm KT',
      width: 90,
      dataIndex: 'namKhenThuong',
      filterType: 'number',
      sortable: true,
    },
    {
      title: 'Phương thức KT',
      width: 120,
      dataIndex: 'phuongThucKhenThuong',
      filterType: 'string',
      sortable: true,
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
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
        dependencies={[page, limit]}
        modelName="sinhvien.khenthuong"
        hideCard
        Form={FormKhenThuong}
        buttons={{ create: true }}
      />
    </>
  );
};

export default KhenThuongSinhVienPage;
