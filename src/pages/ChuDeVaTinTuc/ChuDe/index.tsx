/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { PhamVi } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { useCheckAccess } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel, useAccess } from 'umi';
import Form from './components/Form';

const ChuDeChung = () => {
  const {
    loading,
    loaiChuDe,
    getAllLoaiChuDeModel,
    getChuDeModel,
    setEdit,
    setVisibleForm,
    delChuDeModel,
    setRecord,
    page,
    limit,
    condition,
    setCondition,
    phamVi,
    setPhamVi,
    setPage,
  } = useModel('chude');
  const access = useAccess();
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');

  const canCreate = useCheckAccess('chu-de-chung:create');
  const canUpdate = useCheckAccess('chu-de-chung:update');
  const canDelete = useCheckAccess('chu-de-chung:delete');

  const handleEdit = (record: ChuDe.Record) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<ChuDe.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      search: 'search',
    },
    // {
    //   title: 'Loại chủ đề',
    //   dataIndex: 'type',
    //   align: 'center',
    //   width: 100,
    // },
    {
      title: 'Phạm vi',
      dataIndex: 'phamVi',
      align: 'center',
      width: 100,
      hide: access.quanTri || false,
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTaoId',
      align: 'center',
      width: 100,
      render: (val, record) =>
        record?.phamVi === 'Tất cả' ? (
          <div>Tất cả</div>
        ) : (
          <div>{danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name ?? ''}</div>
        ),
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'order',
      align: 'center',
      width: 70,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (record: ChuDe.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              disabled={!canUpdate}
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
              disabled={!canDelete}
              onConfirm={() => delChuDeModel({ id: record._id })}
              title="Bạn có chắc chắn muốn xóa chủ đề này"
            >
              <Button disabled={!canDelete} type="primary" shape="circle">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (access.adminVaQuanTri || access.nhanVien) {
      getAllHinhThucDaoTaoModel();
    }
    getAllLoaiChuDeModel();
  }, []);

  // const onChangeLoaiChuDe = (value: string) => {
  //   setLoaiChuDe(value);
  // };

  return (
    <TableBase
      columns={columns}
      getData={getChuDeModel}
      loading={loading}
      hascreate={canCreate}
      dependencies={[loaiChuDe, page, limit, condition, phamVi]}
      modelName="chude"
      title="Chủ đề chung"
      Form={Form}
    >
      {(access.admin || access.nhanVien) && (
        <>
          <Select
            onChange={(val) => {
              setCondition({ ...condition, hinhThucDaoTaoId: undefined });
              setPhamVi(val);
              setPage(1);
            }}
            style={{ width: 170, marginRight: 8 }}
            value={phamVi}
            allowClear
            placeholder="Chọn phạm vi"
          >
            {PhamVi.map((item) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
          <Select
            disabled={phamVi !== 'Hình thức đào tạo'}
            allowClear
            placeholder="Lọc theo hình thức đào tạo"
            value={condition?.hinhThucDaoTaoId}
            onChange={(val: number) => {
              setCondition({ ...condition, hinhThucDaoTaoId: val });
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
      )}
      {/* <Select
        allowClear
        placeholder="Lọc theo loại chủ đề"
        onChange={onChangeLoaiChuDe}
        value={loaiChuDe}
        style={{ width: 180, marginBottom: 8, marginRight: 8 }}
      >
        {danhSachLoaiChuDe?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select> */}
    </TableBase>
  );
};

export default ChuDeChung;
