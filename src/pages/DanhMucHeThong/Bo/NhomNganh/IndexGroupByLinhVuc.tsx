import TableBase from '@/components/Table';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';

const TrinhDoDTBo = () => {
  const {
    page,
    limit,
    getModelTheoLinhVuc,
    getAllModel,
    setDanhSachTheoLichVuc,
    danhSachTheoLichVuc,
  } = useModel('danhmuc.dmnhomnganh');

  const getData = () => getModelTheoLinhVuc();

  const columns: IColumn<NhomNganhDaoTao.IRecordByLinhVuc>[] = [
    {
      title: 'Mã lĩnh vực',
      dataIndex: 'ma',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên lĩnh vực',
      dataIndex: 'ten',
      width: 200,
      render: (val, rec) => `${val} (${rec.count})`,
    },
  ];

  const expandedRowRender = (rec: NhomNganhDaoTao.IRecordByLinhVuc) => {
    const columns1: IColumn<NhomNganhDaoTao.IRecordBo>[] = [
      {
        title: 'Mã nhóm ngành',
        dataIndex: 'ma',
        align: 'center',
        width: 80,
      },
      {
        title: 'Tên nhóm ngành',
        dataIndex: 'ten',
        width: 200,
      },
    ];

    const data = rec.nhomNganhList ?? [];
    return <TableStaticData columns={columns1} data={data} addStt />;
  };

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.dmnhomnganh"
      getData={getData}
      dataState="danhSachTheoLichVuc"
      title="Nhóm ngành đào tạo"
      buttons={{ create: false }}
      otherProps={{
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          expandIconColumnIndex: 0,
          rowExpandable: (rec: NhomNganhDaoTao.IRecordByLinhVuc) => rec.count,
          columnWidth: 10,
          onExpand: (expand: boolean, rec: NhomNganhDaoTao.IRecordByLinhVuc) => {
            if (expand)
              getAllModel(false, { ma: 1 }, { dmLinhVucDaoTaoId: rec._id }).then((data) => {
                const temp = danhSachTheoLichVuc?.map((item) =>
                  item._id === rec._id ? { ...rec, nhomNganhList: data } : item,
                );
                setDanhSachTheoLichVuc(temp);
              });
          },
        },
      }}
    />
  );
};

export default TrinhDoDTBo;
