import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import { tienVietNam } from '@/utils/utils';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const CongNoSinhVienPage = (props: { daNop: boolean }) => {
  const { daNop } = props;
  const [data, setData] = useState<SinhVien.ICongNoSinhVien[]>([]);
  const { record: recSinhVien } = useModel('sinhvien.sinhvien');
  const sum = _.sumBy(data, (item) =>
    daNop ? item.soTienDaNop : item.soTienPhaiNop - item.soTienDaNop,
  );

  const fetchData = async () => {};

  useEffect(() => {
    fetchData();
  }, [recSinhVien?.ssoId, daNop]);

  const columns: IColumn<SinhVien.ICongNoSinhVien>[] = [
    {
      title: 'Dịch vụ',
      dataIndex: 'dichVu',
      width: 250,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Số tiền phải nộp',
      width: 120,
      dataIndex: 'soTienPhaiNop',
      filterType: 'number',
      sortable: true,
      render: (val) => val && tienVietNam(val),
    },
    {
      title: 'Số tiền đã nộp',
      width: 120,
      dataIndex: 'soTienDaNop',
      filterType: 'number',
      sortable: true,
      render: (val) => val && tienVietNam(val),
    },
    {
      title: 'Số tiền còn lại phải nộp',
      width: 120,
      render: (val, rec) => tienVietNam(rec.soTienPhaiNop - rec.soTienDaNop),
      hide: daNop,
    },
  ];

  return (
    <>
      <TableStaticData columns={columns} data={data} addStt hasTotal>
        <span>
          Tổng số tiền {daNop ? 'đã nộp' : 'còn lại phải nộp'}: <b>{tienVietNam(sum)}</b>
        </span>
      </TableStaticData>
    </>
  );
};

export default CongNoSinhVienPage;
