import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewHocLieu from '../../HocLieu/components/ViewHocLieu';
import Form from './Form';

const HocLieuDeCuongPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, putModel } =
    useModel('hocphan.hoclieudecuong');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
  const [visibleVanBan, setVisibleVanBan] = useState<boolean>(false);
  const [hocLieuId, setHocLieuId] = useState<string>();

  const handleEdit = (record: HocPhan.IHocLieuDeCuong) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<HocPhan.IHocLieuDeCuong>[] = [
    {
      title: 'Tên học liệu',
      width: 150,
      render: (val, rec) => rec.hocLieu?.ten,
    },
    {
      title: 'Loại học liệu',
      width: 120,
      render: (val, rec) => rec.hocLieu?.loaiHocLieu,
    },
    {
      title: 'Bắt buộc',
      width: 100,
      dataIndex: 'batBuoc',
      align: 'center',
      render: (val, rec) => (
        <Switch
          checked={val}
          onChange={(checked) =>
            putModel(rec._id, { ...rec, batBuoc: checked }, () =>
              getModel({ deCuongId: recDeCuong?._id }),
            )
          }
        />
      ),
    },
    {
      title: 'Học liệu',
      width: 120,
      align: 'center',
      dataIndex: 'hocLieuId',
      render: (val, rec) =>
        rec.hocLieu?.url ? (
          <a
            onClick={() => {
              setHocLieuId(val);
              setVisibleVanBan(true);
            }}
          >
            <EyeOutlined /> Xem chi tiết
          </a>
        ) : (
          'Chưa cập nhật'
        ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: HocPhan.IHocLieuDeCuong) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() =>
                deleteModel(record._id, () => getModel({ deCuongId: recDeCuong?._id }))
              }
              title="Bạn có chắc chắn muốn xóa học liệu này khỏi đề cương?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        params={{ deCuongId: recDeCuong?._id }}
        modelName="hocphan.hoclieudecuong"
        title="Đề cương học liệu"
        Form={Form}
        hideCard
        buttons={{ reload: false }}
      />

      {hocLieuId ? (
        <ViewHocLieu visible={visibleVanBan} setVisible={setVisibleVanBan} hocLieuId={hocLieuId} />
      ) : null}
    </>
  );
};

export default HocLieuDeCuongPage;
