import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormViewDetail from './components/FormViewDetail';
import Form from './components/Modal';

const KhaoSatPage = () => {
  const { page, limit, edit, deleteModel, handleEdit } = useModel('tienich.bieumau');
  const [form, setForm] = useState<string>('edit');
  // const canUpdate = useCheckAccess('khao-sat:update');
  // const canDelete = useCheckAccess('khao-sat:delete');
  // const canCreate = useCheckAccess('khao-sat:create');

  const onCell = (record: BieuMau.Record) => ({
    onClick: () => {
      setForm('view');
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
      render: (val) => <ExpandText>{val}</ExpandText>,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: BieuMau.Record) => (
        <>
          <Tooltip title="Xem trước">
            <Button
              onClick={() => {
                setForm('view');
                handleEdit(record);
              }}
              type="link"
              icon={<EyeOutlined />}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setForm('edit');
                handleEdit(record);
              }}
              type="link"
              icon={<EditOutlined />}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              // disabled={!canDelete}
              onConfirm={() => deleteModel(record._id)}
              title="Bạn có chắc chắn muốn xóa khảo sát này?"
              placement="topLeft"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  let formTable = Form;
  if (form === 'view' && edit) formTable = FormViewDetail;

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="tienich.bieumau"
      title="Biểu mẫu khảo sát"
      widthDrawer={800}
      Form={formTable}
    />
  );
};

export default KhaoSatPage;
