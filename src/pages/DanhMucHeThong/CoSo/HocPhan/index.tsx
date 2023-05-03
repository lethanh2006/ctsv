import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import ModalHocPhan from './components/ModalHocPhan';

const HocPhanPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('hocphan.hocphan');

  const handleEdit = (record: HocPhan.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (record: HocPhan.IRecord) => ({
    onClick: () => {
      setEdit(true);
      setRecord(record);
      setVisibleForm(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<HocPhan.IRecord>[] = [
    {
      title: 'Mã học phần',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Tên tiếng Anh',
      dataIndex: 'tenTiengAnh',
      width: 150,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      width: 80,
      align: 'center',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: HocPhan.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa học phần này?"
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
      modelName="hocphan.hocphan"
      title="Học phần"
      Form={ModalHocPhan}
      widthDrawer={800}
      buttons={{ import: true }}
    />
  );
};

export default HocPhanPage;
