import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewVanBanQuyDinh from './components/ViewVanBan';

const VanBanQuyDinh = () => {
  const {
    setEdit,
    setVisibleForm,
    setRecord,
    getModel,
    page,
    limit,
    deleteModel,
    record: recVanBan,
  } = useModel('danhmuc.vanbanquydinh');
  const [visibleVanBan, setVisibleVanBan] = useState<boolean>(false);

  const handleEdit = (record: VanBanQuyDinh.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (rec: VanBanQuyDinh.IRecord) => ({
    onClick: () => {
      setVisibleVanBan(true);
      setRecord(rec);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<VanBanQuyDinh.IRecord>[] = [
    {
      title: 'Mã căn cứ',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Tên căn cứ',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      width: 250,
      filterType: 'string',
      render: (val) => <ExpandText>{val}</ExpandText>,
      onCell,
    },
    {
      title: 'Tài liệu đính kèm',
      dataIndex: 'url',
      width: 150,
      align: 'center',
      render: (val, rec) => (
        <a onClick={() => window.open(val)}>
          <EyeOutlined /> Xem tệp tin
        </a>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: VanBanQuyDinh.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa căn cứ pháp lý này?"
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
        modelName="danhmuc.vanbanquydinh"
        title="Căn cứ pháp lý"
        Form={Form}
      />
      {recVanBan?._id ? (
        <ViewVanBanQuyDinh
          visible={visibleVanBan}
          setVisible={setVisibleVanBan}
          vanBanId={recVanBan._id}
          hasEdit
        />
      ) : null}
    </>
  );
};

export default VanBanQuyDinh;
