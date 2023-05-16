import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const TietHoc = (props: { hideCard?: boolean }) => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('danhmuc.tiethoc');
  const { record: recNhomTietHoc } = useModel('danhmuc.nhomtiethoc');
  const getData = () => getModel({ nhomTietHocId: recNhomTietHoc?._id });

  const handleEdit = (record: TietHoc.IRecordCoSo) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<TietHoc.IRecordCoSo>[] = [
    {
      title: 'Tiết học',
      dataIndex: 'tietHoc',
      align: 'center',
      width: 80,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'timeBatDau',
      align: 'center',
      width: 100,
      sortable: true,
      render: (val) => (val ? val?.slice(0, -3) : ''),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'timeKetThuc',
      align: 'center',
      width: 100,
      sortable: true,
      render: (val) => (val ? val?.slice(0, -3) : ''),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: TietHoc.IRecordCoSo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getData)}
              title="Bạn có chắc chắn muốn xóa tiết học này?"
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
      params={{ nhomTietHocId: recNhomTietHoc?._id }}
      modelName="danhmuc.tiethoc"
      title="Tiết học"
      Form={Form}
      hideCard={props?.hideCard}
    />
  );
};

export default TietHoc;
