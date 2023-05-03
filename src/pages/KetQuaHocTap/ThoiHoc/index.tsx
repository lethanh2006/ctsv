import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/HocKy/HocKy/components/SelectHocKy';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { type ThoiHoc } from '@/services/KetQuaHocTap/ThoiHoc/typing';
import { ELoaiThoiHoc } from '@/services/KetQuaHocTap/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const CoSoDaoTao = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('ketquahoctap.thoihoc');

  const handleEdit = (record: ThoiHoc.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<ThoiHoc.IRecord>[] = [
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
      width: 120,
      filterType: 'customselect',
      filterCustomSelect: <SelectHocKy hasCreate={false} multiple />,
      render: (val, rec) => rec.hocKy?.ten,
    },
    {
      title: 'Loại thôi học',
      dataIndex: 'loaiThoiHoc',
      width: 120,
      filterType: 'select',
      filterData: Object.values(ELoaiThoiHoc),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ThoiHoc.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa mục này?"
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
      modelName="ketquahoctap.thoihoc"
      title="Thôi học"
      Form={Form}
    />
  );
};

export default CoSoDaoTao;
