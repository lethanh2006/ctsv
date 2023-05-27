/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Select, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewTinTuc from './components/ViewTinTuc';
import { type IColumn } from '@/components/Table/typing';
import { PhamVi } from '@/utils/constants';

const TinTuc = () => {
  const {
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
  const [recordTT, setRecordTT] = useState<TinTuc.IRecord>({} as TinTuc.IRecord);
  const {
    getAllChuDeModel,
    danhSach,
    condition: condChuDe,
    setCondition: setCondChuDe,
    setPhamVi: setPhamViChuDe,
    setDanhSach,
  } = useModel('chude');
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('namhoc.lophanhchinh');

  const handleEdit = (rec: TinTuc.IRecord) => {
    setRecord(rec);
    setEdit(true);
    setVisibleForm(true);
  };

  const onCell = (record: TinTuc.IRecord) => ({
    onClick: () => {
      setVisibleModal(true);
      setRecordTT(record);
    },
    style: { cursor: 'pointer' },
  });

  // const canUpdate = useCheckAccess('tin-tuc:update');
  // const canDelete = useCheckAccess('tin-tuc:delete');
  // const canCreate = useCheckAccess('tin-tuc:create');
  console.log(danhSachHinhThucDaoTao, 'danhSachHinhThucDaoTao');
  const columns: IColumn<TinTuc.IRecord>[] = [
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
                  type="link"
                  shape="circle"
                >
                  <EyeOutlined />
                </Button>
              </Tooltip>{' '}
              <Tooltip title="Chỉnh sửa">
                <Button
                  // disabled={!canUpdate}
                  onClick={() => handleEdit(record)}
                  type="link"
                  shape="circle"
                >
                  <EditOutlined />
                </Button>
              </Tooltip>{' '}
              <Tooltip title="Xóa">
                <Popconfirm
                  // disabled={!canDelete}
                  onConfirm={() => delTinTucModel({ id: record._id })}
                  title="Bạn có chắc chắn muốn xóa chủ đề này"
                >
                  <Button
                    // disabled={!canDelete}
                    type="link"
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
    getAllHinhThucDaoTaoModel();
    return () => {
      setDanhSach([]);
    };
  }, []);

  const onChangeChuDe = (value: string) => {
    setCondition({ ...condition, idTopic: value });
    setPage(1);
  };

  return (
    <>
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
          onChange={(val: string) => {
            setCondition({ ...condition, hinhThucDaoTaoId: val, idTopic: undefined });
            setCondChuDe({ ...condChuDe, hinhThucDaoTaoId: val });
            setPage(1);
          }}
          style={{ marginBottom: 8, width: 200, marginRight: 8 }}
        >
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.danhMucHTDT?.ten}
            </Select.Option>
          ))}
        </Select>

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
      </TableBase>
      <Modal
        width={800}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={
          <Button onClick={() => setVisibleModal(false)} type="default">
            Đóng
          </Button>
        }
        onCancel={() => setVisibleModal(false)}
        visible={visibleModal}
      >
        <ViewTinTuc record={recordTT} />
      </Modal>
    </>
  );
};

export default TinTuc;
