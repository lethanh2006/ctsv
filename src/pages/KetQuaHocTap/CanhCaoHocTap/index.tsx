import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectLoaiCanhCao from '@/pages/DanhMucHeThong/LoaiCanhCaoHocTap/components/Select';
import SelectHocKy from '@/pages/HocKy/HocKy/components/SelectHocKy';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const CanhCaoHocTapPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('ketquahoctap.canhcao');

  const handleEdit = (record: CanhCaoHocTap.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<CanhCaoHocTap.IRecord>[] = [
    {
      title: 'Sinh viên',
      dataIndex: 'sinhVienSsoId',
      width: 150,
      filterType: 'customselect',
      filterCustomSelect: <SelectSinhVienDebounce multiple />,
      render: (val, rec) => `${rec.sinhVien?.ten} - ${rec.sinhVien?.ma}`,
    },
    {
      title: 'Học kỳ',
      dataIndex: 'hocKyId',
      width: 100,
      filterType: 'customselect',
      filterCustomSelect: <SelectHocKy hasCreate={false} multiple />,
      render: (val, rec) => rec.hocKy?.ten,
    },
    {
      title: 'Loại cảnh cáo',
      dataIndex: 'loaiCanhCaoId',
      width: 120,
      filterType: 'customselect',
      filterCustomSelect: <SelectLoaiCanhCao hasCreate={false} multiple />,
      render: (val, rec) => rec.loaiCanhCao?.ten,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      width: 250,
      filterType: 'string',
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: CanhCaoHocTap.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa cảnh cáo này?"
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
      modelName="ketquahoctap.canhcao"
      title="Cảnh cáo học tập"
      Form={Form}
    />
  );
};

export default CanhCaoHocTapPage;
