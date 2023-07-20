import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import { formatPhoneNumber } from '@/utils/utils';
import moment from 'moment';
import { useModel } from 'umi';
import ModalSinhVien from './component/ModalSinhVien';
import PreviewHoSo from './component/PreviewHoSo';
import SelectKhoaNganh from '../DaoTao/KhoaNganh/Select';

const ViewSinhVien = () => {
  const { page, limit, handleView, isView } = useModel('sinhvien.sinhvien');

  const onCell = (rec: SinhVien.IRecord) => ({
    onClick: () => handleView(rec),
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<SinhVien.IRecord>[] = [
    {
      title: 'Họ tên',
      dataIndex: 'ten',
      width: 140,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma',
      align: 'center',
      width: 100,
      sortable: true,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      align: 'center',
      width: 100,
      filterType: 'date',
      sortable: true,
      render: (val) => val && moment(val).format('DD/MM/YYYY'),
      onCell,
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      width: 100,
      filterType: 'string',
      onCell,
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      width: 100,
      filterType: 'string',
      render: (val) => val && formatPhoneNumber(val),
      onCell,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 140,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Khóa ngành',
      dataIndex: 'khoaNganhId',
      width: 120,
      filterType: 'customselect',
      filterCustomSelect: <SelectKhoaNganh multiple />,
      render: (val, rec) =>
        `${rec.khoaNganh?.khoaSinhVien?.ten ?? ''} - ${rec.khoaNganh?.nganh?.ma ?? ''}`,
      onCell,
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 90,
    //   fixed: 'right',
    //   render: (record: SinhVien.IRecord) => (
    //     <>
    //       <Tooltip title="Chỉnh sửa">
    //         <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
    //       </Tooltip>
    //       <Tooltip title="Xóa">
    //         <Popconfirm
    //           onConfirm={() => deleteModel(record._id, getModel)}
    //           title="Bạn có chắc chắn muốn xóa sinh viên này?"
    //           placement="topLeft"
    //         >
    //           <Button danger type="link" icon={<DeleteOutlined />} />
    //         </Popconfirm>
    //       </Tooltip>
    //     </>
    //   ),
    // },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="sinhvien.sinhvien"
      title="Danh sách sinh viên"
      Form={isView ? PreviewHoSo : ModalSinhVien}
      formProps={{ hasEdit: true }}
      widthDrawer={1100}
      buttons={{ import: true }}
    />
  );
};

export default ViewSinhVien;
