/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import { type IColumn } from '@/components/Table/typing';
import { PhamVi } from '@/utils/constants';

const ChuDeChung = () => {
  const {
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
  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');

  const handleEdit = (record: ChuDe.Record) => {
    setRecord(record);
    setEdit(true);
    setVisibleForm(true);
  };

  const columns: IColumn<ChuDe.Record>[] = [
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Hình thức đào tạo',
      dataIndex: 'hinhThucDaoTaoId',
      width: 100,
      sortable: true,
      render: (val, record) =>
        record?.phamVi === 'Tất cả' ? (
          <div>Tất cả</div>
        ) : (
          <div>
            {danhSachHinhThucDaoTao?.find((item) => item?._id === val)?.danhMucHTDT?.ten ?? ''}
          </div>
        ),
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'order',
      width: 70,
      sortable: true,
    },
    {
      title: 'Thao tác',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (record: ChuDe.Record) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              // disabled={!canUpdate}
              onClick={() => handleEdit(record)}
              type="link"
              shape="circle"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              // disabled={!canDelete}
              onConfirm={() => delChuDeModel({ id: record._id })}
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
      ),
    },
  ];

  useEffect(() => {
    getAllHinhThucDaoTaoModel();
    // getAllLoaiChuDeModel();
  }, []);

  return (
    <TableBase
      columns={columns}
      getData={getChuDeModel}
      dependencies={[page, limit, phamVi]}
      modelName="chude"
      title="Chủ đề chung"
      Form={Form}
    >
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
          <Select.Option key={item?._id} value={item?._id}>
            {item?.danhMucHTDT?.ten}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default ChuDeChung;
