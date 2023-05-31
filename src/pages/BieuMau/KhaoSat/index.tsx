/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { PhamVi } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Divider, Popconfirm, Popover, Select, Switch, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import Form from './components/Form';
import FormViewDetail from './components/FormViewDetail';
import ThongKe from './components/ThongKe';

const KhaoSat = () => {
  const access = useAccess();
  const {
    getBieuMauAdminModel,
    delBieuMauModel,
    setLoaiBieuMau,
    loading,
    page,
    limit,
    setEdit,
    setRecord,
    setVisibleForm,
    kichHoatBieuMauModel,
    condition,
    edit,
    setCondition,
    getBieuMauThongKeModel,
    setPage,
    phamVi,
    setPhamVi,
    exportKetQuaKhaoSatModel,
    getBieuMauAdminHeModel,
    setDanhSach,
  } = useModel('bieumau');
  const { getLopHanhChinhAdminModel, condition: condLopHanhChinh } =
    useModel('namhoc.lophanhchinh');
  // const { getAllNganhModel } = useModel('namhoc.khoanganh');
  const { danhSachHinhThucDaoTao, getAllHinhThucDaoTaoModel } = useModel('namhoc.lophanhchinh');
  const { adminGetLopTinChi, condition: condLopTinChi } = useModel('loptinchi');
  // const { getKhoaHocModel } = useModel('khoahoc');
  const { getUserMetaDataFilterModel, conditionNguoiDungCuThe, setConditionNguoiDungCuThe } =
    useModel('user');
  const [form, setForm] = useState<string>('edit');

  // const canUpdate = useCheckAccess('khao-sat:update');
  // const canDelete = useCheckAccess('khao-sat:delete');
  // const canCreate = useCheckAccess('khao-sat:create');
  // const canViewStats = useCheckAccess('khao-sat:view-stats');
  // const canExportStats = useCheckAccess('khao-sat:export-stats');

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
      setConditionNguoiDungCuThe({});
      setDanhSach([]);
      setLoaiBieuMau(undefined);
    };
  }, []);

  const handleEdit = (record: BieuMau.Record) => {
    setForm('edit');
    setEdit(true);
    setRecord(record);
    setVisibleForm(true);
  };

  const handleChangeStatus = (record: BieuMau.Record) => {
    kichHoatBieuMauModel({ id: record._id, data: { kichHoat: !record.kichHoat } });
  };

  const onCell = (record: BieuMau.Record) => ({
    onClick: () => {
      setForm('statistic');
      setVisibleForm(true);
      setEdit(true);
      setRecord(record);
      getBieuMauThongKeModel(record._id);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<BieuMau.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      search: 'search',
      width: 200,
      onCell,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
      width: 120,
      onCell,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
      width: 120,
      onCell,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'loaiDoiTuongSuDung',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{val?.length === 0 ? 'Tất cả' : val}</div>,
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTaoId',
      align: 'center',
      width: 170,
      // hide: !access.admin,
      render: (val, record) => (
        <div>
          {record?.phamVi === 'Tất cả'
            ? 'Tất cả'
            : danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'kichHoat',
      align: 'center',
      width: '100px',
      fixed: 'right',
      render: (val: boolean, record: BieuMau.Record) => (
        <Switch
          checkedChildren="Mở"
          unCheckedChildren="Mở"
          checked={val}
          onChange={() => {
            handleChangeStatus(record);
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: BieuMau.Record) => (
        <Popover
          placement="left"
          content={
            <>
              <Tooltip title="Xuất kết quả">
                <Button
                  // disabled={!canExportStats}
                  type="primary"
                  onClick={() => {
                    exportKetQuaKhaoSatModel({ idKhaoSat: record._id });
                  }}
                  shape="circle"
                >
                  <ExportOutlined />
                </Button>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="Thống kê">
                <Button
                  // disabled={!canViewStats}
                  onClick={() => {
                    setForm('statistic');
                    setVisibleForm(true);
                    setEdit(true);
                    setRecord(record);
                    getBieuMauThongKeModel(record._id);
                  }}
                  shape="circle"
                >
                  <PieChartOutlined />
                </Button>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="Xem trước">
                <Button
                  onClick={() => {
                    setForm('view');
                    setVisibleForm(true);
                    setEdit(true);
                    setRecord(record);
                  }}
                  type="primary"
                  shape="circle"
                >
                  <EyeOutlined />
                </Button>
              </Tooltip>

              <Divider type="vertical" />
              <Tooltip title="Chỉnh sửa">
                <Button
                  // disabled={!canUpdate}
                  onClick={() => handleEdit(record)}
                  type="default"
                  shape="circle"
                >
                  <EditOutlined />
                </Button>
              </Tooltip>

              <Divider type="vertical" />
              <Tooltip title="Xóa">
                <Popconfirm
                  // disabled={!canDelete}
                  onConfirm={() => delBieuMauModel({ id: record._id })}
                  title="Bạn có chắc chắn muốn xóa khảo sát này"
                >
                  <Button
                    // disabled={!canDelete}
                    type="primary"
                    shape="circle"
                  >
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Tooltip>
            </>
          }
        >
          <Button type="primary" icon={<EditOutlined />} />
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
      getData={() => getBieuMauAdminHeModel('Khảo sát')}
      loading={loading}
      dependencies={[page, limit, condition, phamVi]}
      modelName="bieumau"
      title="Khảo sát"
      // hascreate={canCreate}
      formType="Drawer"
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

export default KhaoSat;
