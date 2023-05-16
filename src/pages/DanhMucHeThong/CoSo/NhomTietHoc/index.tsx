import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietNhomTietHoc from './components/ModalChiTiet';
import ModalFormNhomTietHoc from './components/ModalForm';

const NhomTietHoc = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, putModel } =
    useModel('danhmuc.nhomtiethoc');
  const [visible, setVisible] = useState<boolean>(false);

  const handleEdit = (record: NhomTietHoc.IRecordCoSo) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onChecked = (checked: boolean, rec: NhomTietHoc.IRecordCoSo) => {
    putModel(rec?._id, { ...rec, active: checked });
  };

  const onCell = (record: NhomTietHoc.IRecordCoSo) => ({
    onClick: () => {
      setVisible(true);
      setRecord(record);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<NhomTietHoc.IRecordCoSo>[] = [
    {
      title: 'Mã nội bộ',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Tên nhóm tiết học',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      align: 'center',
      width: 80,
      render: (val, rec) => (
        <Switch checked={val} onChange={(checked) => onChecked(checked, rec)} />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: NhomTietHoc.IRecordCoSo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa nhóm tiết học này?"
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
        modelName="danhmuc.nhomtiethoc"
        title="Nhóm tiết học"
        Form={ModalFormNhomTietHoc}
        widthDrawer={600}
      />
      <ModalChiTietNhomTietHoc visible={visible} setVisible={setVisible} />
    </>
  );
};

export default NhomTietHoc;
