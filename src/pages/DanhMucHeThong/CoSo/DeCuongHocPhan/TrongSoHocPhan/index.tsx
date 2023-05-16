import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './Form';

const TrongSoHocPhanPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('hocphan.trongsohocphan');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

  const handleEdit = (record: HocPhan.ITrongSoHocPhan) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<HocPhan.ITrongSoHocPhan>[] = [
    {
      title: 'Đầu điểm',
      width: 150,
      render: (val, rec) => rec.hinhThucDanhGia?.ten,
    },
    {
      title: 'Hình thức đánh giá',
      width: 150,
      render: (val, rec) => rec.hinhThucThi?.ten,
    },
    {
      title: 'Tỷ lệ đánh giá',
      dataIndex: 'tyLeDanhGia',
      width: 100,
      align: 'center',
    },
    {
      title: 'Đặc điểm đánh giá',
      dataIndex: 'dacDiemDanhGia',
      width: 120,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: HocPhan.ITrongSoHocPhan) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() =>
                deleteModel(record._id, () => getModel({ deCuongId: recDeCuong?._id }))
              }
              title="Bạn có chắc chắn muốn xóa trọng số này?"
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
      params={{ deCuongId: recDeCuong?._id }}
      modelName="hocphan.trongsohocphan"
      title="Trọng số"
      Form={Form}
      hideCard
      buttons={{ reload: false }}
    />
  );
};

export default TrongSoHocPhanPage;
