import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterPhamVi from '@/pages/TinTuc/ChuDe/components/Filter';
import { exportKetQuaKhaoSat } from '@/services/TienIch/BieuMau';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  MenuOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Divider, Popconfirm, Popover, Switch, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Modal';
import FormViewDetail from './components/FormViewDetail';
import ThongKe from './components/ThongKe';

const KhaoSatPage = () => {
  const {
    page,
    limit,
    kichHoatBieuMauModel,
    edit,
    getBieuMauThongKeModel,
    getModel,
    deleteModel,
    handleEdit,
  } = useModel('tienich.bieumau');
  const [form, setForm] = useState<string>('edit');
  // const canUpdate = useCheckAccess('khao-sat:update');
  // const canDelete = useCheckAccess('khao-sat:delete');
  // const canCreate = useCheckAccess('khao-sat:create');
  // const canViewStats = useCheckAccess('khao-sat:view-stats');
  // const canExportStats = useCheckAccess('khao-sat:export-stats');

  const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'pageable');

  const handleChangeStatus = (record: BieuMau.Record) => {
    kichHoatBieuMauModel({ id: record._id, data: { kichHoat: !record.kichHoat } });
  };

  const onCell = (record: BieuMau.Record) => ({
    onClick: () => {
      setForm('statistic');
      getBieuMauThongKeModel(record._id);
      handleEdit(record);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<BieuMau.Record>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      width: 200,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      align: 'center',
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
      sortable: true,
      filterType: 'datetime',
      width: 120,
      onCell,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
      sortable: true,
      filterType: 'datetime',
      width: 120,
      onCell,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'loaiDoiTuongSuDung',
      render: (val) => (val?.length === 0 ? 'Tất cả' : val),
      width: 120,
      onCell,
    },
    // {
    //   title: 'Hình thức đào tạo',
    //   dataIndex: 'hinhThucDaoTaoId',
    //   align: 'center',
    //   width: 170,
    //   // hide: !access.admin,
    //   render: (val, record) => (
    //     <div>
    //       {record?.phamVi === 'Tất cả'
    //         ? 'Tất cả'
    //         : danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}
    //     </div>
    //   ),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'kichHoat',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (val, rec) => (
        <Switch checked={val} onChange={() => handleChangeStatus(rec)} size="small" />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (record: BieuMau.Record) => (
        <Popover
          placement="left"
          content={
            <>
              <Tooltip title="Xuất kết quả">
                <Button
                  shape="circle"
                  onClick={() => {
                    exportKetQuaKhaoSat({ idKhaoSat: record._id }).then((res) =>
                      fileDownload(res.data, 'Kết quả khảo sát.xlsx'),
                    );
                  }}
                  icon={<ExportOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Thống kê">
                <Button
                  onClick={() => {
                    setForm('statistic');
                    getBieuMauThongKeModel(record._id);
                    handleEdit(record);
                  }}
                  shape="circle"
                  icon={<PieChartOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Xem trước">
                <Button
                  onClick={() => {
                    setForm('view');
                    handleEdit(record);
                  }}
                  shape="circle"
                  icon={<EyeOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Chỉnh sửa">
                <Button
                  onClick={() => {
                    setForm('edit');
                    handleEdit(record);
                  }}
                  type="primary"
                  shape="circle"
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Xóa">
                <Popconfirm
                  // disabled={!canDelete}
                  onConfirm={() => deleteModel(record._id, getData)}
                  title="Bạn có chắc chắn muốn xóa khảo sát này?"
                  placement="topLeft"
                >
                  <Button shape="circle" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </>
          }
        >
          <Button type="link" icon={<MenuOutlined />} />
        </Popover>
      ),
    },
  ];

  let formTable = Form;
  if (form === 'view' && edit) formTable = FormViewDetail;
  else if (form === 'statistic' && edit) formTable = ThongKe;

  return (
    <TableBase
      columns={columns}
      getData={getData}
      dependencies={[page, limit]}
      modelName="tienich.bieumau"
      title="Khảo sát"
      widthDrawer={800}
      Form={formTable}
    >
      <FilterPhamVi modelName="tienich.bieumau" />
    </TableBase>
  );
};

export default KhaoSatPage;
