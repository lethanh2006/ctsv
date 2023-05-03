import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const LoaiCanhCaoHocTapPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, putModel } =
    useModel('danhmuc.loaicanhcaohoctap');

  const handleEdit = (record: CanhCaoHocTap.ILoaiCanhCao) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onChange = (rec: CanhCaoHocTap.ILoaiCanhCao, active: boolean) => {
    putModel(rec._id, { ...rec, active });
  };

  const columns: IColumn<CanhCaoHocTap.ILoaiCanhCao>[] = [
    {
      title: 'Loại cảnh cáo',
      dataIndex: 'ten',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      width: 120,
      align: 'center',
      render: (val, rec) => <Switch checked={val} onChange={(active) => onChange(rec, active)} />,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: CanhCaoHocTap.ILoaiCanhCao) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa loại cảnh cáo này?"
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
      modelName="danhmuc.loaicanhcaohoctap"
      title="Loại cảnh cáo học tập"
      Form={Form}
    />
  );
};

export default LoaiCanhCaoHocTapPage;
