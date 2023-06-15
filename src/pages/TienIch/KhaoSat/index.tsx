import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { exportKetQuaKhaoSat } from '@/services/TienIch/BieuMau';
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
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import FormViewDetail from './components/FormViewDetail';
import ThongKe from './components/ThongKe';

const KhaoSatPage = () => {
  const {
    setLoaiBieuMau,
    page,
    limit,
    kichHoatBieuMauModel,
    edit,
    getBieuMauThongKeModel,
    phamVi,
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

  const getData = () =>
    getModel({ loai: 'Khảo sát' }, undefined, undefined, undefined, undefined, 'pageable');

  // useEffect(() => {
  //   getUserMetaDataFilterModel(1, 100);
  // }, [conditionNguoiDungCuThe]);

  // useEffect(() => {
  //   adminGetLopTinChi(100);
  // }, [condLopTinChi]);

  // useEffect(() => {
  //   getLopHanhChinhAdminModel({ page: 1, limit: 100 });
  // }, [condLopHanhChinh]);

  useEffect(() => {
    // getAllNganhModel();
    // getKhoaHocModel({ pageParam: 1, limitParam: 1000 });
    setLoaiBieuMau('Khảo sát');
    // getAllHinhThucDaoTaoModel();
    return () => {
      setLoaiBieuMau(undefined);
    };
  }, []);

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
      render: (val: boolean, record: BieuMau.Record) => (
        <Switch checked={val} onChange={() => handleChangeStatus(record)} size="small" />
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
      dependencies={[page, limit, phamVi]}
      modelName="tienich.bieumau"
      title="Khảo sát"
      widthDrawer={800}
      Form={formTable}
    >
      {/* {(access.admin || access.nhanVien) && (
        <>
          <Select
            onChange={(val) => {
              setCondition({ ...condition, hinhThucDaoTaoId: undefined });
              setPhamVi(val);
              setPage(1);
            }}
            style={{ width: 170, marginRight: 8 }}
            value={phamVi}
          >
            {PhamVi.map((item) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
          <Select
            disabled={phamVi === 'Tất cả'}
            allowClear
            placeholder="Lọc theo hình thức đào tạo"
            value={condition?.hinhThucDaoTaoId}
            onChange={(val: number) => {
              setCondition({ ...condition, hinhThucDaoTaoId: val });
            }}
            style={{ marginBottom: 8, width: 250, marginRight: 8 }}
          >
            {danhSachHinhThucDaoTao?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.ten_hinh_thuc_dao_tao}
              </Select.Option>
            ))}
          </Select>
        </>
      )} */}
    </TableBase>
  );
};

export default KhaoSatPage;
