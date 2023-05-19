/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
// import { PhamVi } from '@/utils/constants';
// import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Select, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';
import ViewTinTuc from './components/ViewTinTuc';
import { type IColumn } from '@/components/Table/typing';

const TinTuc = () => {
  // const access = useAccess();
  const {
    loading,
    getTinTucModel,
    setEdit,
    setVisibleForm,
    delTinTucModel,
    setRecord,
    page,
    limit,
    setCondition,
    condition,
    setPage,
    phamVi,
    setPhamVi,
  } = useModel('tintuc');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [recordTT, setRecordTT] = useState<TinTuc.Record>({} as TinTuc.Record);
  const {
    getAllChuDeModel,
    danhSach,
    condition: condChuDe,
    setCondition: setCondChuDe,
    setPhamVi: setPhamViChuDe,
    setDanhSach,
  } = useModel('chude');
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');

  const handleEdit = (record: TinTuc.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (record: TinTuc.Record) => ({
    onClick: () => {
      setVisibleModal(true);
      setRecordTT(record);
    },
    style: { cursor: 'pointer' },
  });

  // const canUpdate = useCheckAccess('tin-tuc:update');
  // const canDelete = useCheckAccess('tin-tuc:delete');
  // const canCreate = useCheckAccess('tin-tuc:create');

  const columns: IColumn<TinTuc.Record>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      width: 220,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
      width: 220,
    },
    {
      title: 'Phạm vi',
      dataIndex: 'phamVi',
      width: 100,
      // hide: access.quanTri || false,
      onCell,
    },
    {
      title: 'Chủ đề',
      dataIndex: ['chuDe', 'name'],
      align: 'center',
      onCell,
      width: 200,
    },
    {
      title: 'Người đăng',
      dataIndex: ['nguoiDang', 'username'],
      width: 100,
      onCell,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'ngayDang',
      render: (val) => <div>{moment(val).format('DD/MM/YYYY')}</div>,
      width: 120,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 70,
      fixed: 'right',
      render: (record) => (
        <Popover
          placement="left"
          content={
            <>
              <Tooltip title="Xem chi tiết">
                <Button
                  onClick={() => {
                    setVisibleModal(true);
                    setRecordTT(record);
                  }}
                  type="primary"
                  shape="circle"
                >
                  <EyeOutlined />
                </Button>
              </Tooltip>{' '}
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
              </Tooltip>{' '}
              <Divider type="vertical" />
              <Tooltip title="Xóa">
                <Popconfirm
                  // disabled={!canDelete}
                  onConfirm={() => delTinTucModel({ id: record._id })}
                  title="Bạn có chắc chắn muốn xóa chủ đề này"
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

  useEffect(() => {
    getAllChuDeModel();
  }, [condChuDe]);

  useEffect(() => {
    // getAllHinhThucDaoTaoModel();
    return () => {
      setDanhSach([]);
    };
  }, []);

  const onChangeChuDe = (value: string) => {
    setCondition({ ...condition, idTopic: value });
    setPage(1);
  };

  return (
    <TableBase
      columns={columns}
      getData={getTinTucModel}
      dependencies={[page, limit, phamVi]}
      modelName="tintuc"
      formType="Drawer"
      widthDrawer={700}
      scroll={{ x: 1000 }}
      title="Quản lý tin tức"
      Form={Form}
    >
      {/* {(access.admin || access.nhanVien) && (
        <>
          <Select
            onChange={(val) => {
              setCondition({ ...condition, hinhThucDaoTaoId: undefined });
              setPhamVi(val);
              setPhamViChuDe(val);
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
            notFoundContent="Không có hình thức đào tạo nào"
            allowClear
            placeholder="Lọc theo hình thức đào tạo"
            value={condition?.hinhThucDaoTaoId}
            onChange={(val: number) => {
              setCondition({ ...condition, hinhThucDaoTaoId: val, idTopic: undefined });
              setCondChuDe({ ...condChuDe, hinhThucDaoTaoId: val });
              setPage(1);
            }}
            style={{ marginBottom: 8, width: 200, marginRight: 8 }}
          >
            {danhSachHinhThucDaoTao?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.ten_hinh_thuc_dao_tao}
              </Select.Option>
            ))}
          </Select>
        </>
      )} */}

      <Select
        notFoundContent="Không có chủ đề nào"
        allowClear
        placeholder="Lọc theo chủ đề"
        onChange={onChangeChuDe}
        value={condition?.idTopic}
        style={{ width: 200, marginBottom: 8, marginRight: 8 }}
      >
        {danhSach?.map((item: ChuDe.Record) => (
          <Select.Option key={item._id} value={item._id}>
            {item?.name}
          </Select.Option>
        ))}
      </Select>
      <Modal
        width="80%"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button onClick={() => setVisibleModal(false)} type="primary">
            Đóng
          </Button>
        }
        onCancel={() => setVisibleModal(false)}
        visible={visibleModal}
      >
        <ViewTinTuc record={recordTT} />
      </Modal>
    </TableBase>
  );
};

export default TinTuc;
