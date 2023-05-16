import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT } from '@/services/DanhMucHeThong/constant';
import { useModel } from 'umi';

const TableDanhSachHocPhan = (props: { hocKy?: number; chuyenNganh?: string }) => {
  const { hocKy, chuyenNganh } = props;
  const { danhSach, setDanhSach } = useModel('chuongtrinhdaotao.khoihocphanctdt');
  const { getAllModel: getHocPhanTuChon } = useModel('chuongtrinhdaotao.hocphanctdt');
  const data = danhSach.filter(
    (item) =>
      (!hocKy || (hocKy === -1 && !item.soThuTuKy) || item.soThuTuKy === hocKy) &&
      (!chuyenNganh || !item.chuyenNganhId || item.chuyenNganhId === chuyenNganh),
  );

  const columns: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
    {
      title: 'Tên học phần / khối học phần',
      width: 150,
      render: (val, rec) => rec.hocPhan?.ten ?? rec.ten,
    },
    {
      title: 'Loại học phần',
      width: 120,
      dataIndex: 'loaiHocPhanCtdt',
    },
    {
      title: 'Số tín chỉ',
      width: 80,
      align: 'center',
      render: (val, rec) => rec.hocPhan?.soTinChi ?? rec.soTinChiTuChonPhaiHoc,
    },
    {
      title: 'Học kỳ dự kiến',
      width: 80,
      dataIndex: 'soThuTuKy',
      align: 'center',
      hide: !!hocKy,
    },
    {
      title: 'Chuyên ngành',
      width: 120,
      render: (val, rec) => rec.chuyenNganh?.ten,
      hide: !!chuyenNganh,
    },
  ];

  const expandedRowRender = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
    const columns1: IColumn<ChuongTrinhDaoTao.IHocPhanTuChonCTDT>[] = [
      {
        title: 'Tên học phần tự chọn',
        width: 150,
        render: (val, r) => r.hocPhan?.ten,
      },
      {
        title: 'Số tín chỉ',
        width: 80,
        align: 'center',
        render: (val, r) => r.hocPhan?.soTinChi,
      },
    ];

    return <TableStaticData columns={columns1} data={rec.hocPhanTuChonList ?? []} size="small" />;
  };

  return (
    <TableStaticData
      addStt
      data={data}
      columns={columns}
      size="small"
      otherProps={{
        bordered: true,
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          expandIconColumnIndex: 0,
          rowExpandable: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) =>
            rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON,
          columnWidth: 10,
          onExpand: (expand: boolean, rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
            if (expand)
              getHocPhanTuChon(false, undefined, { khoiHpCtId: rec._id }).then((dat) => {
                const temp = danhSach?.map((item) =>
                  item._id === rec._id ? { ...rec, hocPhanTuChonList: dat } : item,
                );
                setDanhSach(temp);
              });
          },
        },
      }}
    />
  );
};

export default TableDanhSachHocPhan;
