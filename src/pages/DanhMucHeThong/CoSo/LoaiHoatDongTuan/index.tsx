import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const LoaiHoatDongTuan = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, putModel } =
    useModel('danhmuc.loaihoatdongtuan');

  const handleEdit = (record: LoaiHoatDongTuan.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onChecked = (checked: boolean, rec: LoaiHoatDongTuan.IRecord) => {
    putModel(rec?._id, { ...rec, active: checked });
  };

  const columns: IColumn<LoaiHoatDongTuan.IRecord>[] = [
    {
      title: 'Tên loại hoạt động tuần',
      dataIndex: 'ten',
      width: 250,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'active',
      align: 'center',
      width: 120,
      render: (val, rec) => (
        <Switch checked={val} onChange={(checked) => onChecked(checked, rec)} />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: LoaiHoatDongTuan.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa loại hoạt động tuần này?"
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
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.loaihoatdongtuan"
      title="Loại hoạt động tuần"
      Form={Form}
    />
  );
};

export default LoaiHoatDongTuan;
