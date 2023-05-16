import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHocPhan from '@/pages/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { type CongNhanKQHT } from '@/services/KetQuaHocTap/CongNhan/typing';
import { ELoaiDiemChu, ETrangThaiCongNhanKqht } from '@/services/KetQuaHocTap/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const PageCongNhanKetQua = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('ketquahoctap.congnhan');

  const handleEdit = (record: CongNhanKQHT.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<CongNhanKQHT.IRecord>[] = [
    {
      title: 'Sinh viên',
      dataIndex: 'sinhVienSsoId',
      width: 150,
      filterType: 'customselect',
      filterCustomSelect: <SelectSinhVienDebounce />,
      render: (val, rec) => [rec.sinhVien?.ten, rec.sinhVien?.ma].join(' - '),
    },
    {
      title: 'Học phần',
      dataIndex: 'hocPhanId',
      width: 120,
      filterType: 'customselect',
      filterCustomSelect: <SelectHocPhan multiple />,
      render: (val, rec) => [rec.hocPhan?.ten, rec.hocPhan?.ma].join(' - '),
    },
    {
      title: 'Điểm tổng kết quy đổi',
      dataIndex: 'diemTongKetQuyDoi',
      width: 120,
      align: 'center',
      filterType: 'number',
      sortable: true,
    },
    {
      title: 'Điểm thang 4 quy đổi',
      dataIndex: 'diemThang4QuyDoi',
      width: 120,
      align: 'center',
      filterType: 'number',
      sortable: true,
    },
    {
      title: 'Điểm chữ quy đổi',
      dataIndex: 'diemChuQuyDoi',
      width: 120,
      align: 'center',
      filterType: 'select',
      filterData: Object.values(ELoaiDiemChu),
      sortable: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 120,
      filterType: 'select',
      filterData: Object.values(ETrangThaiCongNhanKqht),
    },
    {
      title: 'Minh chứng',
      dataIndex: 'minhChungId',
      align: 'center',
      width: 150,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: CongNhanKQHT.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa cơ sở đào tạo này?"
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
      modelName="ketquahoctap.congnhan"
      title="Công nhận kết quả học tập và chuyển đổi tín chỉ"
      Form={Form}
    />
  );
};

export default PageCongNhanKetQua;
