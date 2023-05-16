import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormHocPhanCTDT from './Form';

const HocPhanCTDT = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel(
    'chuongtrinhdaotao.hocphanctdt',
  );
  const { record: recKhoi } = useModel('chuongtrinhdaotao.khoihocphanctdt');

  const handleEdit = (record: ChuongTrinhDaoTao.IHocPhanTuChonCTDT) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<ChuongTrinhDaoTao.IHocPhanTuChonCTDT>[] = [
    {
      title: 'Học phần',
      width: 200,
      dataIndex: 'hocPhanId',
      render: (val, rec) => [rec?.hocPhan?.ten, rec?.hocPhan?.ma].join(' - '),
    },
    {
      title: 'Học phần tiên quyết',
      width: 200,
      dataIndex: 'hocPhanTienQuyetId',
      render: (val, rec) => [rec?.hocPhanTienQuyet?.ten, rec?.hocPhanTienQuyet?.ma].join(' - '),
    },
    {
      title: 'Học phần trước',
      width: 200,
      dataIndex: 'hocPhanTruocId',
      render: (val, rec) => [rec?.hocPhanTruoc?.ten, rec?.hocPhanTruoc?.ma].join(' - '),
    },
    {
      title: 'Học phần song hành',
      width: 200,
      dataIndex: 'hocPhanSongHanhId',
      render: (val, rec) => [rec?.hocPhanSongHanh?.ten, rec?.hocPhanSongHanh?.ma].join(' - '),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ChuongTrinhDaoTao.IHocPhanTuChonCTDT) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() =>
                deleteModel(record._id, () => getModel({ khoiHpCtId: recKhoi?._id }))
              }
              title="Bạn có chắc chắn muốn xóa học phần này khỏi khối tự chọn?"
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
      params={{ khoiHpCtId: recKhoi?._id }}
      modelName="chuongtrinhdaotao.hocphanctdt"
      title="Học phần tự chọn"
      Form={FormHocPhanCTDT}
      buttons={{ reload: false }}
      hideCard
    />
  );
};

export default HocPhanCTDT;
